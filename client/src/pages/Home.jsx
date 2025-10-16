// In /codeiiest-backend/client/src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const HomePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await api.get('/api/auth/current_user');
                setUser(data);
            } catch (error) {
                console.log("User not logged in");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', minHeight: 'calc(100vh - 80px)' }}>
                Loading...
            </div>
        );
    }

    // If user is logged in, show welcome page with link to dashboard
    if (user) {
        return (
            <div style={{ 
                padding: '3rem', 
                maxWidth: '900px', 
                margin: '0 auto',
                textAlign: 'center',
                minHeight: 'calc(100vh - 80px)'
            }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--accent-blue)' }}>
                    Welcome to CodeIIEST! 👋
                </h1>
                <p style={{ fontSize: '1.3rem', marginBottom: '2rem', color: 'var(--text-light)' }}>
                    Hello, <strong>{user.displayName}</strong>!
                </p>

                <div style={{ 
                    backgroundColor: 'var(--secondary-bg-dark)', 
                    padding: '2rem', 
                    borderRadius: '10px',
                    marginBottom: '2rem',
                    border: '1px solid var(--border-color)'
                }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
                        🎯 Quick Actions
                    </h2>
                    <div style={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        marginTop: '1.5rem'
                    }}>
                        <Link to="/dashboard">
                            <button className="primary" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>
                                View Your Profile
                            </button>
                        </Link>
                        
                        {user.role === 'admin' && (
                            <>
                                <Link to="/admin/events">
                                    <button className="primary" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>
                                        Manage Events
                                    </button>
                                </Link>
                                <Link to="/admin/chapters">
                                    <button className="primary" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>
                                        Manage Chapters
                                    </button>
                                </Link>
                                <Link to="/admin/team-members">
                                    <button className="primary" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>
                                        Manage Team
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {user.role === 'admin' && (
                    <div style={{ 
                        backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                        padding: '1.5rem', 
                        borderRadius: '8px',
                        border: '1px solid var(--accent-blue)'
                    }}>
                        <p style={{ fontSize: '1.1rem', margin: 0 }}>
                            👨‍💼 You have <strong>Admin</strong> privileges
                        </p>
                    </div>
                )}
            </div>
        );
    }

    // If user is NOT logged in, show login page content
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 80px)',
            padding: '2rem',
            textAlign: 'center'
        }}>
            <h1 style={{ 
                fontSize: '3.5rem', 
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-green) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }}>
                Welcome to CodeIIEST
            </h1>
            
            {/* <p style={{ 
                fontSize: '1.3rem', 
                marginBottom: '3rem',
                color: 'var(--text-light)',
                maxWidth: '600px'
            }}>
                Join our community of student developers at IIEST Shibpur. 
                Track your progress, participate in events, and grow your skills!
            </p> */}

            <div style={{
                backgroundColor: 'var(--secondary-bg-dark)',
                padding: '3rem',
                borderRadius: '15px',
                border: '2px solid var(--border-color)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                maxWidth: '500px'
            }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
                    Get Started 🚀
                </h2>
                
                <p style={{ marginBottom: '2rem', color: 'var(--text-light)' }}>
                    Sign in with your IIEST Google account to access your dashboard
                </p>

                <Link to="/login">
                    <button 
                        className="primary"
                        style={{ 
                            padding: '15px 40px',
                            fontSize: '1.2rem',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>🔐</span>
                        Sign in with Google
                    </button>
                </Link>

                <p style={{ 
                    marginTop: '1.5rem', 
                    fontSize: '0.9rem',
                    color: 'var(--text-light)',
                    opacity: 0.8
                }}>
                    Only @students.iiests.ac.in accounts are allowed
                </p>
            </div>

            <div style={{ 
                marginTop: '3rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem',
                maxWidth: '800px',
                width: '100%'
            }}>
                {/* <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Track Progress</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                        Monitor your coding journey
                    </p>
                </div> */}
                
                {/* <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎯</div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Join Events</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                        Participate in contests
                    </p>
                </div> */}
                
                {/* <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Connect</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                        Network with peers
                    </p>
                </div> */}
            </div>
        </div>
    );
};

export default HomePage;
