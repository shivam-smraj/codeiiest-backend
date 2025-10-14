// In /client/src/pages/admin/EditEvent.jsx (Updated)

import React from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import EditEventForm from '../../components/EditEventForm'; // Import the new component

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const EditEvent = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // EditEventForm will fetch its own data now, but we still pass ID to onUpdate

    const handleUpdate = async (eventId, formData) => { // Modified handleSubmit to handleUpdate
        try {
            await apiClient.put(`/api/events/${eventId}`, formData);
            alert('Event updated successfully!');
            navigate('/admin/events');
        } catch (err) {
            alert('Failed to update event. Check console for details.');
            console.error('Error updating event:', err);
        }
    };

    const handleCancel = () => {
        navigate('/admin/events');
    };

    return (
        <div style={{ padding: '20px' }}>
            {/* EditEventForm now handles its own data fetching based on ID */}
            <EditEventForm onUpdate={handleUpdate} onCancel={handleCancel} />
        </div>
    );
};

export default EditEvent;