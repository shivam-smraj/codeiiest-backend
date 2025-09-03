// backend/controllers/leaderboardController.js
import asyncHandler from 'express-async-handler';
import axios from 'axios';
import User from '../models/userModel.js';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let leaderboardCache = {
    data: null,
    timestamp: null
};

// Rate limiter configuration
const RATE_LIMIT = {
    tokens: 100,
    lastRefill: Date.now(),
    refillRate: 100, // tokens per minute
    refillInterval: 60 * 1000 // 1 minute
};

// Helper function to check rate limit
const checkRateLimit = () => {
    const now = Date.now();
    const timePassed = now - RATE_LIMIT.lastRefill;
    if (timePassed >= RATE_LIMIT.refillInterval) {
        RATE_LIMIT.tokens = RATE_LIMIT.refillRate;
        RATE_LIMIT.lastRefill = now;
    }
    if (RATE_LIMIT.tokens > 0) {
        RATE_LIMIT.tokens--;
        return true;
    }
    return false;
};

// Helper function for retrying API calls
const fetchWithRetry = async (url, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            if (!checkRateLimit()) {
                throw new Error('Rate limit exceeded');
            }
            const response = await axios.get(url);
            return response;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
    }
};

const getCodeforcesLeaderboard = asyncHandler(async (req, res) => {
    try {
        // Check cache first
        if (leaderboardCache.data && Date.now() - leaderboardCache.timestamp < CACHE_DURATION) {
            return res.status(200).json({
                data: leaderboardCache.data,
                cached: true,
                lastUpdated: leaderboardCache.timestamp
            });
        }

        // Get users from database
        const usersWithHandles = await User.find({ 
            codeforcesHandle: { $exists: true, $ne: null, $ne: '' } 
        }).select('name rollId codeforcesHandle year');

        if (!usersWithHandles || usersWithHandles.length === 0) {
            return res.status(200).json({ data: [], cached: false });
        }

        const handles = usersWithHandles.map(user => user.codeforcesHandle);
        const handlesString = handles.join(';');

    try {
        // Fetch user info with retry mechanism
        const cfApiResponse = await fetchWithRetry(`https://codeforces.com/api/user.info?handles=${handlesString}`);
        
        if (cfApiResponse.data.status !== 'OK') {
            throw new Error(`Codeforces API returned status: ${cfApiResponse.data.status}`);
        }

        const cfUsersData = cfApiResponse.data.result;

        // Fetch contest history in parallel with batching
        const batchSize = 5;
        const contestData = {};
        for (let i = 0; i < handles.length; i += batchSize) {
            const batch = handles.slice(i, i + batchSize);
            const promises = batch.map(handle => 
                fetchWithRetry(`https://codeforces.com/api/user.rating?handle=${handle}`)
                    .then(response => {
                        if (response.data.status === 'OK') {
                            const contests = response.data.result;
                            const lastContest = contests[contests.length - 1];
                            return {
                                handle: handle.toLowerCase(),
                                data: {
                                    contestsGiven: contests.length,
                                    ratingChange: lastContest ? lastContest.newRating - lastContest.oldRating : 0,
                                    lastContestDate: lastContest ? new Date(lastContest.ratingUpdateTimeSeconds * 1000) : null
                                }
                            };
                        }
                        return { handle: handle.toLowerCase(), data: { contestsGiven: 0, ratingChange: 0 } };
                    })
                    .catch(() => ({ handle: handle.toLowerCase(), data: { contestsGiven: 0, ratingChange: 0 } }))
            );
            
            const results = await Promise.all(promises);
            results.forEach(result => {
                contestData[result.handle] = result.data;
            });

            // Add delay between batches to respect rate limits
            if (i + batchSize < handles.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // Process and format the data
        const leaderboardData = usersWithHandles.map(dbUser => {
            const cfUser = cfUsersData.find(cf => cf.handle.toLowerCase() === dbUser.codeforcesHandle.toLowerCase());
            const userContests = contestData[dbUser.codeforcesHandle.toLowerCase()] || { contestsGiven: 0, ratingChange: 0 };
            
            const rating = cfUser?.rating || 0;
            const maxRating = cfUser?.maxRating || 0;
            
            // Calculate user level
            const currYear = new Date().getFullYear();
            const currMonth = new Date().getMonth();
            const academicYear = currMonth <= 4 ? currYear - 1 : currYear;
            const yearDiff = dbUser.year - academicYear;
            let experience = 'Unknown';
            switch(yearDiff) {
                case 3: experience = "Fresher"; break;
                case 2: experience = "Sophomore"; break;
                case 1: experience = "Junior"; break;
                case 0: experience = "Senior"; break;
            }

            return {
                id: dbUser._id,
                name: dbUser.name,
                rollId: dbUser.rollId,
                handle: cfUser ? cfUser.handle : dbUser.codeforcesHandle,
                rating,
                maxrating: maxRating,
                rank: cfUser?.rank || 'unrated',
                avatar: cfUser?.avatar || '',
                contestsGiven: userContests.contestsGiven,
                ratingChange: userContests.ratingChange,
                lastContestDate: userContests.lastContestDate,
                experience,
                year: dbUser.year
            };
        }).sort((a, b) => b.rating - a.rating || b.maxrating - a.maxrating);

        // Update cache
        leaderboardCache = {
            data: leaderboardData,
            timestamp: Date.now()
        };

        res.status(200).json({
            data: leaderboardData,
            cached: false,
            lastUpdated: leaderboardCache.timestamp
        });

    } catch (error) {
        console.error("Error in getCodeforcesLeaderboard:", error);
        // If cache exists, return it as fallback
        if (leaderboardCache.data) {
            return res.status(200).json({
                data: leaderboardCache.data,
                cached: true,
                lastUpdated: leaderboardCache.timestamp,
                error: error.message
            });
        }
        res.status(500).json({ 
            message: "Failed to fetch leaderboard data", 
            error: error.message 
        });
    }

    } catch (error) {
        console.error("Internal Server Error in getCodeforcesLeaderboard:", error.message);
        res.status(500).json({ message: "Failed to fetch live leaderboard data. The external API may be down or an invalid handle was provided." });
    }
});

export { getCodeforcesLeaderboard };