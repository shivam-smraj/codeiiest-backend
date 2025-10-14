// In /client/src/components/EditEventForm.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const EditEventForm = ({ onUpdate, onCancel }) => {
    const { id } = useParams(); // Get event ID from URL
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        miniTitle: '',
        description: '',
        imageVariant: '',
        AvatarSampleData: [],
        TagsList: [],
        sideDetails1: { text1: '', text2: '', text3: '' },
        sideDetails2: { text1: '', text2: '', text3: '' },
        completionStatus: 0,
        moreInfo: '',
    });

    // Effect to fetch event data when component mounts or ID changes
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError(null);
                const { data } = await apiClient.get(`/api/events/${id}`);
                setFormData({
                    title: data.title || '',
                    miniTitle: data.miniTitle || '',
                    description: data.description || '',
                    imageVariant: data.imageVariant || '',
                    AvatarSampleData: data.AvatarSampleData || [],
                    TagsList: data.TagsList || [],
                    sideDetails1: data.sideDetails1 || { text1: '', text2: '', text3: '' },
                    sideDetails2: data.sideDetails2 || { text1: '', text2: '', text3: '' },
                    completionStatus: data.completionStatus || 0,
                    moreInfo: data.moreInfo || '',
                });
            } catch (err) {
                console.error("Error fetching event for editing:", err);
                setError('Failed to load event for editing. Check event ID or permissions.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]); // Re-fetch if ID changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => {
            if (name.startsWith('sideDetails1.') || name.startsWith('sideDetails2.')) {
                const [parent, child] = name.split('.');
                return {
                    ...prevData,
                    [parent]: {
                        ...prevData[parent],
                        [child]: value
                    }
                };
            }
            if (name === 'completionStatus') {
                return { ...prevData, [name]: Number(value) };
            }
            return { ...prevData, [name]: value };
        });
    };

    const handleTagsChange = (e) => {
        setFormData(prevData => ({
            ...prevData,
            TagsList: e.target.value.split(',').map(item => item.trim()).filter(item => item !== '')
        }));
    };

    const handleAvatarSampleDataChange = (e) => {
        const value = e.target.value;
        const parsed = value.split(';').map(item => {
            const parts = item.split(',');
            if (parts.length === 2) {
                return { name: parts[0].trim(), img: parts[1].trim() };
            }
            return null;
        }).filter(item => item !== null);
        setFormData(prevData => ({ ...prevData, AvatarSampleData: parsed }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call the onUpdate prop with the current form data and the event ID
        onUpdate(id, formData);
    };

    if (loading) return <div>Loading event data...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px', margin: '20px auto', gap: '10px' }}>
            <h2 style={{ textAlign: 'center' }}>Edit Event</h2>

            <label>Title:</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />

            <label>Mini Title:</label>
            <input type="text" name="miniTitle" value={formData.miniTitle} onChange={handleChange} required />

            <label>Description:</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" />

            <label>Image Variant (filename without extension, e.g., 'cpdsa'):</label>
            <input type="text" name="imageVariant" value={formData.imageVariant} onChange={handleChange} />

            <label>Avatar Sample Data (comma-separated 'name,img.webp;name2,img2.webp'):</label>
            <input
                type="text"
                name="AvatarSampleData"
                value={formData.AvatarSampleData.map(a => `${a.name},${a.img}`).join('; ')}
                onChange={handleAvatarSampleDataChange}
            />

            <label>Tags (comma-separated):</label>
            <input
                type="text"
                name="TagsList"
                value={formData.TagsList.join(', ')}
                onChange={handleTagsChange}
            />

            <h4 style={{ marginTop: '15px' }}>Side Details 1:</h4>
            <label>Text 1:</label>
            <input type="text" name="sideDetails1.text1" value={formData.sideDetails1.text1} onChange={handleChange} />
            <label>Text 2:</label>
            <input type="text" name="sideDetails1.text2" value={formData.sideDetails1.text2} onChange={handleChange} />
            <label>Text 3:</label>
            <input type="text" name="sideDetails1.text3" value={formData.sideDetails1.text3} onChange={handleChange} />

            <h4 style={{ marginTop: '15px' }}>Side Details 2:</h4>
            <label>Text 1:</label>
            <input type="text" name="sideDetails2.text1" value={formData.sideDetails2.text1} onChange={handleChange} />
            <label>Text 2:</label>
            <input type="text" name="sideDetails2.text2" value={formData.sideDetails2.text2} onChange={handleChange} />
            <label>Text 3:</label>
            <input type="text" name="sideDetails2.text3" value={formData.sideDetails2.text3} onChange={handleChange} />

            <label>Completion Status (0-100):</label>
            <input type="number" name="completionStatus" value={formData.completionStatus} onChange={handleChange} min="0" max="100" />

            <label>More Info URL:</label>
            <input type="text" name="moreInfo" value={formData.moreInfo} onChange={handleChange} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', background: 'green', color: 'white' }}>
                    Update Event
                </button>
                <button type="button" onClick={onCancel} style={{ padding: '10px 20px', cursor: 'pointer', background: 'gray', color: 'white' }}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default EditEventForm;