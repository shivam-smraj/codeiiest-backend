// In /client/src/pages/admin/CreateEvent.jsx

import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateEventForm from '../../components/CreateEventForm';


const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const CreateEvent = () => {
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        try {
            await api.post('/api/events', formData);
            alert('Event created successfully!');
            navigate('/admin/events');
        } catch (err) {
            alert('Failed to create event. Check console for details.');
            console.error('Error creating event:', err);
        }
    };

    const handleCancel = () => {
        navigate('/admin/events');
    };

    return (
        <div style={{ padding: '20px' }}>
            <CreateEventForm onSubmit={handleSubmit} onCancel={handleCancel} /> {/* Use the new component */}
        </div>
    );
};
export default CreateEvent;