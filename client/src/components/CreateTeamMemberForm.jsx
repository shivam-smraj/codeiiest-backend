// In /client/src/components/CreateTeamMemberForm.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiClient = axios.create({
  //   baseURL: 'http://localhost:5000',
   baseURL: 'https://codeiiest-backend.vercel.app',

  withCredentials: true,
});

const CreateTeamMemberForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        profilepic: '',
        description: '',
        website: '',
        codeiiest: '',
        gdg: '',
        userId: '', // To link to an existing User
    });
    const [users, setUsers] = useState([]); // State to hold available users
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [usersError, setUsersError] = useState(null);

    // Fetch all users to populate the dropdown for linking
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await apiClient.get('/api/users'); // Assuming this API exists and is public
                setUsers(data);
            } catch (err) {
                console.error("Error fetching users:", err);
                setUsersError("Failed to load users for linking.");
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (loadingUsers) return <div>Loading users for linking...</div>;
    if (usersError) return <div style={{color: 'red'}}>Error: {usersError}</div>;


    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px', margin: '20px auto', gap: '10px' }}>
            <h2 style={{ textAlign: 'center' }}>Create Team Member</h2>

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
                    Create Team Member
                </button>
                <button type="button" onClick={onCancel} style={{ padding: '10px 20px', cursor: 'pointer', background: 'gray', color: 'white' }}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default CreateTeamMemberForm;