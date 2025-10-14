// In /client/src/components/CreateChapterForm.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const CreateChapterForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        byline: '',
        leads: [], // Array of TeamMember IDs
        coreMembers: [], // Array of TeamMember IDs
        events: [], // JSON string for complex objects
        iconset: [], // JSON string for complex objects
        title: '',
        highlight: {}, // JSON string for complex objects
    });
    const [allTeamMembers, setAllTeamMembers] = useState([]); // All available team members
    const [loadingMembers, setLoadingMembers] = useState(true);
    const [membersError, setMembersError] = useState(null);

    // Fetch all team members for selection
    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const { data } = await apiClient.get('/api/team-members');
                setAllTeamMembers(data);
            } catch (err) {
                console.error("Error fetching team members:", err);
                setMembersError("Failed to load team members for selection.");
            } finally {
                setLoadingMembers(false);
            }
        };
        fetchTeamMembers();
    }, []);

    const handleChange = (e) => {
        const { name, value, options } = e.target;
        if (name === 'leads' || name === 'coreMembers') {
            // Handle multi-select for leads/coreMembers
            const selectedOptions = Array.from(options)
                .filter(option => option.selected)
                .map(option => option.value);
            setFormData(prevData => ({ ...prevData, [name]: selectedOptions }));
        } else {
            setFormData(prevData => ({ ...prevData, [name]: value }));
        }
    };

    const handleComplexJsonChange = (name, value) => {
        try {
            setFormData(prevData => ({ ...prevData, [name]: JSON.parse(value) }));
        } catch (e) {
            // console.error(`Invalid JSON for ${name}:`, e);
            // Optionally, handle error by not updating state or showing user feedback
            setFormData(prevData => ({ ...prevData, [name]: value })); // Keep as raw string if invalid JSON
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (loadingMembers) return <div>Loading team members for chapter creation...</div>;
    if (membersError) return <div style={{color: 'red'}}>Error: {membersError}</div>;

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '600px', margin: '20px auto', gap: '10px' }}>
            <h2 style={{ textAlign: 'center' }}>Create Chapter</h2>

            <label>Chapter Name (e.g., 'Development'):</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />

            <label>Description:</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" />

            <label>Byline:</label>
            <input type="text" name="byline" value={formData.byline} onChange={handleChange} />

            <h4 style={{ marginTop: '15px' }}>Leads (select multiple):</h4>
            <select multiple name="leads" value={formData.leads} onChange={handleChange} size="5" style={{ height: 'auto' }}>
                {allTeamMembers.map(member => (
                    <option key={member._id} value={member._id}>
                        {member.name} ({member.codeiiest || 'N/A'})
                    </option>
                ))}
            </select>

            <h4 style={{ marginTop: '15px' }}>Core Members (select multiple):</h4>
            <select multiple name="coreMembers" value={formData.coreMembers} onChange={handleChange} size="5" style={{ height: 'auto' }}>
                {allTeamMembers.map(member => (
                    <option key={member._id} value={member._id}>
                        {member.name} ({member.codeiiest || 'N/A'})
                    </option>
                ))}
            </select>

            <h4 style={{ marginTop: '15px' }}>Chapter Title (e.g., "DEV DYNAMITES"):</h4>
            <input type="text" name="title" value={formData.title} onChange={handleChange} />

            <h4 style={{ marginTop: '15px' }}>Events (JSON Array String):</h4>
            <textarea
                name="events"
                value={JSON.stringify(formData.events, null, 2)}
                onChange={(e) => handleComplexJsonChange('events', e.target.value)}
                rows="8"
                placeholder='e.g., [{"eventName": "Webgame Challenge", "date": "2024-06-15", ...}]'
            />

            <h4 style={{ marginTop: '15px' }}>Icon Set (JSON Array String):</h4>
            <textarea
                name="iconset"
                value={JSON.stringify(formData.iconset, null, 2)}
                onChange={(e) => handleComplexJsonChange('iconset', e.target.value)}
                rows="8"
                placeholder='e.g., [{"icon": "Voice", "byline": "Talks in HTML"}, ...]'
            />

            <h4 style={{ marginTop: '15px' }}>Highlight (JSON Object String):</h4>
            <textarea
                name="highlight"
                value={JSON.stringify(formData.highlight, null, 2)}
                onChange={(e) => handleComplexJsonChange('highlight', e.target.value)}
                rows="8"
                placeholder='e.g., {"heading": "AIM", "byline": "Building the future...", ...}'
            />


            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', background: 'green', color: 'white' }}>
                    Create Chapter
                </button>
                <button type="button" onClick={onCancel} style={{ padding: '10px 20px', cursor: 'pointer', background: 'gray', color: 'white' }}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default CreateChapterForm;