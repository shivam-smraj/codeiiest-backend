// In /client/src/components/EditChapterForm.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const EditChapterForm = ({ onUpdate, onCancel }) => {
    const { id } = useParams(); // Get chapter ID from URL
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allTeamMembers, setAllTeamMembers] = useState([]); // All available team members
    const [loadingMembers, setLoadingMembers] = useState(true);
    const [membersError, setMembersError] = useState(null);


    const [formData, setFormData] = useState({
        name: '',
        description: '',
        byline: '',
        leads: [],
        coreMembers: [],
        events: [],
        iconset: [],
        title: '',
        highlight: {},
    });

    // Fetch existing chapter data AND all team members for linking
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch chapter data
                const { data: chapterData } = await apiClient.get(`/api/chapters/${id}`);
                setFormData({
                    name: chapterData.name || '',
                    description: chapterData.description || '',
                    byline: chapterData.byline || '',
                    leads: chapterData.leads.map(member => member._id) || [], // Map to IDs
                    coreMembers: chapterData.coreMembers.map(member => member._id) || [], // Map to IDs
                    events: chapterData.events || [],
                    iconset: chapterData.iconset || [],
                    title: chapterData.title || '',
                    highlight: chapterData.highlight || {},
                });

                // Fetch all team members
                const { data: teamMembersData } = await apiClient.get('/api/team-members');
                setAllTeamMembers(teamMembersData);

            } catch (err) {
                console.error("Error fetching data for chapter editing:", err);
                setError('Failed to load chapter or team members for editing. Check ID or permissions.');
            } finally {
                setLoading(false);
                setLoadingMembers(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, options } = e.target;
        if (name === 'leads' || name === 'coreMembers') {
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
            setFormData(prevData => ({ ...prevData, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(id, formData);
    };

    if (loading || loadingMembers) return <div>Loading chapter data...</div>;
    if (error || membersError) return <div style={{ color: 'red' }}>Error: {error || membersError}</div>;

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '600px', margin: '20px auto', gap: '10px' }}>
            <h2 style={{ textAlign: 'center' }}>Edit Chapter</h2>

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
                    Update Chapter
                </button>
                <button type="button" onClick={onCancel} style={{ padding: '10px 20px', cursor: 'pointer', background: 'gray', color: 'white' }}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default EditChapterForm;