// In /codeiiest-backend/client/src/pages/Dashboard.jsx (Updated to link to EditProfilePage)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
// UserProfileForm is no longer conditionally rendered here, but we keep the import for the dashboard's own display logic.
// import UserProfileForm from '../components/UserProfileForm'; // No longer needed here if only linking

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const DashboardPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // Removed: [isEditingProfile, setIsEditingProfile] = useState(false);
    const [cfMessage, setCfMessage] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await apiClient.get('/api/auth/current_user');
                setUser(data);
            } catch (error) {
                console.error("Not logged in", error);
                window.location.href = '/login';
            } finally {
                setLoading(false);
            }
        };

        fetchUser();

        const params = new URLSearchParams(location.search);
        if (params.get('cf_success')) {
            setCfMessage({ type: 'success', text: 'Codeforces handle verified and updated successfully!' });
            navigateWithoutQueryParams();
        } else if (params.get('cf_error')) {
            const errorDetails = decodeURIComponent(params.get('cf_error'));
            setCfMessage({ type: 'error', text: `Codeforces verification failed: ${errorDetails}` });
            navigateWithoutQueryParams();
        }
    }, [location.search]);

    const navigateWithoutQueryParams = () => {
        window.history.replaceState({}, document.title, window.location.pathname);
    };

    const handleLogout = async () => {
        try {
            await apiClient.get('/api/auth/logout');
            window.location.href = '/';
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    // Removed: handleProfileSubmit as it's now in EditProfilePage

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', minHeight: 'calc(100vh - 80px)' }}>
                Loading user data...
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'red', minHeight: 'calc(100vh - 80px)' }}>
                No user data. You might not be logged in.
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            {cfMessage && (
                <div style={{ padding: '10px', marginBottom: '20px', borderRadius: '5px',
                    backgroundColor: cfMessage.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: cfMessage.type === 'success' ? '#155724' : '#721c24',
                    border: `1px solid ${cfMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                }}>
                    {cfMessage.text}
                </div>
            )}

            <h1 style={{ marginBottom: '1.5rem', fontSize: '2.5rem' }}>Welcome, {user.displayName}!</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {user.image && (
                    <img
                        src={user.image}
                        alt="Profile"
                        style={{ borderRadius: '50%', width: '120px', height: '120px', border: '3px solid var(--accent-blue)' }}
                    />
                )}
                <div style={{ flexGrow: 1 }}>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Your Details:</h3>
                    <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.8' }}>
                        <li><strong>Email:</strong> {user.email}</li>
                        <li><strong>Role:</strong> <span style={{ textTransform: 'capitalize' }}>{user.role}</span></li>
                        {user.enrollmentNo && <li><strong>Enrollment No:</strong> {user.enrollmentNo}</li>}
                        {user.githubId && <li><strong>GitHub:</strong> <a href={`https://github.com/${user.githubId}`} target="_blank" rel="noopener noreferrer">{user.githubId}</a></li>}
                        {user.leetcodeId && <li><strong>LeetCode:</strong> <a href={`https://leetcode.com/${user.leetcodeId}`} target="_blank" rel="noopener noreferrer">{user.leetcodeId}</a></li>}
                        {user.codechefId && <li><strong>CodeChef:</strong> <a href={`https://www.codechef.com/users/${user.codechefId}`} target="_blank" rel="noopener noreferrer">{user.codechefId}</a></li>}
                    </ul>
                </div>
            </div>

            {/* Codeforces Details in a dedicated block */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem', backgroundColor: 'var(--secondary-bg-dark)' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Codeforces Profile:</h3>
                {user.codeforcesId ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        {user.codeforcesAvatar && (
                            <img src={user.codeforcesAvatar} alt="CF Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--text-light)' }} />
                        )}
                        <div>
                            <p style={{ margin: 0 }}><strong>Handle:</strong> <a href={`https://codeforces.com/profile/${user.codeforcesId}`} target="_blank" rel="noopener noreferrer">{user.codeforcesId}</a></p>
                            {user.codeforcesRating && <p style={{ margin: 0 }}><strong>Rating:</strong> {user.codeforcesRating}</p>}
                        </div>
                    </div>
                ) : (
                    <p>No Codeforces handle linked yet.</p>
                )}
            </div>

            {/* Link to dedicated Edit Profile Page */}
            <Link to="/edit-profile">
                <button
                    className="primary"
                    style={{ marginTop: '10px' }}
                >
                    Edit Profile
                </button>
            </Link>


            {user.role === 'admin' && ( // Admin Panel
                <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Admin Panel</h2>
                    <nav>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <li>
                                <Link to="/admin/events" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>Manage Events</Link>
                            </li>
                            <li>
                                <Link to="/admin/team-members" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>Manage Team Members</Link>
                            </li>
                            <li>
                                <Link to="/admin/chapters" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>Manage Chapters</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}

            <button onClick={handleLogout} className="danger" style={{ marginTop: '2rem' }}>Logout</button>
        </div>
    );
};

export default DashboardPage;