// In /client/src/components/EditTeamMemberForm.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const EditTeamMemberForm = ({ onUpdate, onCancel }) => {
    const { id } = useParams(); // Get team member ID from URL
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]); // State to hold available users
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [usersError, setUsersError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        profilepic: '',
        description: '',
        website: '',
        codeiiest: '',
        gdg: '',
        userId: '',
    });

    // Fetch existing team member data AND all users for linking
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch team member data
                const { data: memberData } = await apiClient.get(`/api/team-members/${id}`);
                setFormData({
                    name: memberData.name || '',
                    profilepic: memberData.profilepic || '',
                    description: memberData.description || '',
                    website: memberData.website || '',
                    codeiiest: memberData.codeiiest || '',
                    gdg: memberData.gdg || '',
                    userId: memberData.user ? memberData.user._id : '', // Pre-select linked user
                });

                // Fetch all users
                const { data: usersData } = await apiClient.get('/api/users');
                setUsers(usersData);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError('Failed to load team member or users for editing. Check ID or permissions.');
            } finally {
                setLoading(false);
                setLoadingUsers(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(id, formData);
    };

    if (loading || loadingUsers) return <div>Loading team member data...</div>;
    if (error || usersError) return <div style={{ color: 'red' }}>Error: {error || usersError}</div>;

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px', margin: '20px auto', gap: '10px' }}>
            <h2 style={{ textAlign: 'center' }}>Edit Team Member</h2>

            <label>Name (required):</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />

            <label>Profile Picture URL/Filename:</label>
            <input type="text" name="profilepic" value={formData.profilepic} onChange={handleChange} />

            <label>Description (quote/tagline):</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />

            <label>Website/LinkedIn URL:</label>
            <input type="text" name="website" value={formData.website} onChange={handleChange} />

            <label>CodeIIEST Role (e.g., "CP Lead"):</label>
            <input type="text" name="codeiiest" value={formData.codeiiest} onChange={handleChange} />

            <label>GDG Role (e.g., "Dev Core Member"):</label>
            <input type="text" name="gdg" value={formData.gdg} onChange={handleChange} />

            <h4 style={{ marginTop: '15px' }}>Link to existing User (optional):</h4>
            <select name="userId" value={formData.userId} onChange={handleChange}>
                <option value="">-- Select a User --</option>
                {users.map(user => (
                    <option key={user._id} value={user._id}>
                        {user.displayName} ({user.email || user.enrollmentNo})
                    </option>
                ))}
            </select>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', background: 'green', color: 'white' }}>
                    Update Team Member
                </button>
                <button type="button" onClick={onCancel} style={{ padding: '10px 20px', cursor: 'pointer', background: 'gray', color: 'white' }}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default EditTeamMemberForm;