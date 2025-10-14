// In /server/routes/codeforcesAuth.js (REVISED for nonce check within id_token)

const express = require('express');
const router = express.Router();
const axios = require('axios');
const qs = require('qs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const CF_CLIENT_ID = process.env.CF_CLIENT_ID;
const CF_CLIENT_SECRET = process.env.CF_CLIENT_SECRET;
const CF_REDIRECT_URI = process.env.CF_REDIRECT_URI || 'http://localhost:5000/api/auth/codeforces/callback';

const AUTHORIZATION_URL = 'https://codeforces.com/oauth/authorize';
const TOKEN_URL = 'https://codeforces.com/oauth/token';


router.get('/', ensureAuthenticated, (req, res) => {
    const nonce = crypto.randomBytes(16).toString('hex');
    req.session.oauthNonce = nonce;
    console.log('[CF OAuth - Start] Nonce generated and stored in session:', req.session.oauthNonce, 'for user:', req.user.displayName);
    
    const params = new URLSearchParams();
    params.append('response_type', 'code');
    params.append('client_id', CF_CLIENT_ID);
    params.append('redirect_uri', CF_REDIRECT_URI);
    params.append('scope', 'openid');
    params.append('nonce', nonce); // Still send nonce to Codeforces

    const authUrl = `${AUTHORIZATION_URL}?${params.toString()}`;
    res.redirect(authUrl);
});


router.get('/callback', ensureAuthenticated, async (req, res) => {
    const { code, error } = req.query; // Remove 'nonce: returnedNonce' from destructuring here

    // IMPORTANT: No longer expecting nonce in query params. We will verify from ID token.
    const sessionNonce = req.session.oauthNonce; // Get nonce from session
    delete req.session.oauthNonce; // Clear it immediately

    console.log('[CF OAuth - Callback] Received Request. User in session:', req.user ? req.user.displayName : 'None');
    console.log('[CF OAuth - Callback] Session Nonce (expected):', sessionNonce);
    // console.log('[CF OAuth - Callback] Nonce from Codeforces URL (no longer directly expected as query param): undefined'); // Remove or clarify this debug line

    if (error) {
        console.error(`Codeforces OAuth Error: ${error}`);
        return res.redirect(`http://localhost:5173/dashboard?cf_error=${error}`);
    }
    if (!code) {
        return res.redirect('http://localhost:5173/dashboard?cf_error=no_code');
    }

    try {
        const tokenPayload = {
            grant_type: 'authorization_code',
            code: code,
            client_id: CF_CLIENT_ID,
            client_secret: CF_CLIENT_SECRET,
            redirect_uri: CF_REDIRECT_URI,
        };

        const tokenResponse = await axios.post(TOKEN_URL, qs.stringify(tokenPayload), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const { id_token } = tokenResponse.data;

        if (!id_token) {
            console.error('Codeforces OAuth Error: id_token not found in response.');
            return res.redirect('http://localhost:5173/dashboard?cf_error=id_token_missing');
        }

        const decodedPayload = jwt.decode(id_token);
        if (!decodedPayload) {
            console.error('Codeforces OAuth Error: Failed to decode id_token.');
            return res.redirect('http://localhost:5173/dashboard?cf_error=token_decode_failed');
        }

        // --- NEW NONCE VERIFICATION ---
        console.log('[CF OAuth - Callback] Nonce from ID Token payload:', decodedPayload.nonce); // DEBUG LOG
        if (!sessionNonce || sessionNonce !== decodedPayload.nonce) {
            console.error('Codeforces OAuth Error: Nonce mismatch between session and ID token.',
                          'Session:', sessionNonce, 'ID Token:', decodedPayload.nonce);
            return res.redirect('http://localhost:5173/dashboard?cf_error=nonce_mismatch');
        }
        // --- END NEW NONCE VERIFICATION ---


        const currentUser = req.user;
        if (!currentUser) {
            console.error('Codeforces OAuth Error: No authenticated user found in session.');
            return res.redirect('http://localhost:5173/dashboard?cf_error=user_not_authenticated');
        }

        currentUser.codeforcesId = decodedPayload.handle;
        currentUser.codeforcesRating = decodedPayload.rating;
        currentUser.codeforcesAvatar = decodedPayload.avatar;
        await currentUser.save();

        res.redirect('http://localhost:5173/dashboard?cf_success=true');

    } catch (error) {
        const errorMsg = error.response ? error.response.data : error.message;
        console.error('An error occurred during Codeforces token exchange:', errorMsg);
        res.redirect(`http://localhost:5173/dashboard?cf_error=${encodeURIComponent(JSON.stringify(errorMsg))}`);
    }
});

module.exports = router;