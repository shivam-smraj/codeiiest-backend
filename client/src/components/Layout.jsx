// In /codeiiest-backend/client/src/components/Layout.jsx (FIXED NAVBAR CONDITIONAL RENDERING)

import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import api from '../utils/api'; // Use centralized API client
import './Navbar.css';

const Layout = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 768); // New state for desktop view

    // Effect to detect screen size changes for desktop view
    useEffect(() => {
        const handleResize = () => {
            setIsDesktopView(window.innerWidth > 768);
            // If we resize to desktop, ensure mobile menu is closed
            if (window.innerWidth > 768 && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileMenuOpen]);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await api.get('/api/auth/current_user');
                setUser(data);
            } catch (error) {
                console.log("Not authenticated or session expired");
                setUser(null);
            } finally {
                setLoadingUser(false);
            }
        };
        fetchUser();
    }, []); // Remove location.pathname dependency - only fetch once on mount

    const handleLogout = async () => {
        try {
            await api.get('/api/auth/logout');
            setUser(null);
            window.location.href = '/';
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false); // Close mobile menu on link click
    };


    return (
        <div>
            {loadingUser ? (
                <nav className="navbar-container">Loading User...</nav>
            ) : (
                <nav className="navbar-container">
                    <Link to="/" className="navbar-brand" onClick={handleLinkClick}>
                        CodeIIEST Backend
                    </Link>

                    {/* Desktop Navigation - Render ONLY if it's desktop view and mobile menu is NOT open */}
                    {isDesktopView && !isMobileMenuOpen && (
                        <ul className="nav-links">
                            {user ? (
                                <>
                                    <li><NavLink to="/dashboard" onClick={handleLinkClick}>Profile</NavLink></li>
                                    {user.role === 'admin' && (
                                        <>
                                            <li><NavLink to="/admin/events" onClick={handleLinkClick}>Manage Events</NavLink></li>
                                            <li><NavLink to="/admin/team-members" onClick={handleLinkClick}>Manage Team Members</NavLink></li>
                                            <li><NavLink to="/admin/chapters" onClick={handleLinkClick}>Manage Chapters</NavLink></li>
                                        </>
                                    )}
                                    <li><button onClick={handleLogout}>Logout</button></li>
                                </>
                            ) : (
                                <li><NavLink to="/login" onClick={handleLinkClick}>Login</NavLink></li>
                            )}
                        </ul>
                    )}

                    {/* Mobile Menu Button - Render ONLY if NOT desktop view */}
                    {!isDesktopView && (
                        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
                            ☰
                        </button>
                    )}

                    {/* Mobile Menu Overlay - Render ONLY if mobile menu is open */}
                    {isMobileMenuOpen && (
                        <div className="mobile-menu-overlay">
                            <button className="close-button" onClick={toggleMobileMenu}>✕</button>
                            <ul className="mobile-nav-links">
                                {user ? (
                                    <>
                                        <li><NavLink to="/dashboard" onClick={handleLinkClick}>Profile</NavLink></li>
                                        {user.role === 'admin' && (
                                            <>
                                                <li><NavLink to="/admin/events" onClick={handleLinkClick}>Manage Events</NavLink></li>
                                                <li><NavLink to="/admin/team-members" onClick={handleLinkClick}>Manage Team Members</NavLink></li>
                                                <li><NavLink to="/admin/chapters" onClick={handleLinkClick}>Manage Chapters</NavLink></li>
                                            </>
                                        )}
                                        <li><button onClick={() => { handleLogout(); handleLinkClick(); }}>Logout</button></li>
                                    </>
                                ) : (
                                    <li><NavLink to="/login" onClick={handleLinkClick}>Login</NavLink></li>
                                )}
                            </ul>
                        </div>
                    )}
                </nav>
            )}

            <main>{children}</main>
        </div>
    );
};

export default Layout;