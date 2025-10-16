// In /codeiiest-backend/client/src/pages/EditProfilePage.jsx (Minimal changes, rely on CSS)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import UserProfileForm from '../components/UserProfileForm';

const EditProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await api.get('/api/auth/current_user');
                setUser(data);
            } catch (err) {
                console.error("Error fetching user for edit profile:", err);
                setError("Failed to load user profile. Please log in.");
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleProfileSubmit = async (formData) => {
        try {
            await api.put('/api/users/me', formData);
            alert('Profile updated successfully!');
            navigate('/dashboard');
        } catch (err) {
            console.error("Failed to update profile", err);
            alert('Failed to update profile. Check console for details.');
        }
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', minHeight: 'calc(100vh - 80px)' }}>
                Loading profile for editing...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', color: 'red', minHeight: 'calc(100vh - 80px)' }}>
                Error: {error}
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ textAlign: 'center', color: 'red', minHeight: 'calc(100vh - 80px)' }}>
                No user data available.
            </div>
        );
    }

    return (
        <div /* Removed explicit style, relying on global main padding and form's max-width/margin */>
            <UserProfileForm
                user={user}
                onSubmit={handleProfileSubmit}
                onCancel={handleCancel}
            />
        </div>
    );
};

export default EditProfilePage;