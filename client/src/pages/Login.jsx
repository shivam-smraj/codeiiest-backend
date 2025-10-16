// In /codeiiest-backend/client/src/pages/Login.jsx (Updated for better UI)

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();

    // Check if user is already logged in (by trying to fetch /current_user on layout)
    // If they are, Layout will redirect to dashboard, so this page only shows if not logged in.
    // However, if direct navigation to / is done, ensure it goes to dashboard if user is present.
    // For now, simple text, but will integrate context if needed later.

    useEffect(() => {
        // Optional: If you want to check user status and redirect if already logged in here
        // The Layout component already handles this for the navbar, but this could be
        // a fallback or primary redirect logic.
        // For simplicity, relying on Layout's /dashboard redirect if user exists is usually fine.
    }, []);

    const loginPageStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 60px)', /* Adjust based on navbar height */
        textAlign: 'center',
        backgroundColor: 'var(--primary-bg-dark)',
        color: 'var(--text-light)',
        padding: '2rem',
    };

    const loginButtonStyle = {
        marginTop: '1.5rem',
        padding: '1rem 2rem',
        fontSize: '1.1rem',
        cursor: 'pointer',
        backgroundColor: 'var(--accent-blue)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        transition: 'background-color 0.2s ease-in-out',
    };

    // Use environment variable for API URL
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    return (
        <div style={loginPageStyle}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>CodeIIEST Admin & User Portal</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Please log in to continue</p>
            <a href={`${API_BASE_URL}/api/auth/google`}>
                <button style={loginButtonStyle}>
                    Login with Google
                </button>
            </a>
        </div>
    );
};

export default LoginPage;