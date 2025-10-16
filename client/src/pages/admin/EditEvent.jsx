// In /client/src/pages/admin/EditEvent.jsx (Updated)

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import EditEventForm from '../../components/EditEventForm'; // Import the new component

const EditEvent = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // EditEventForm will fetch its own data now, but we still pass ID to onUpdate

    const handleUpdate = async (eventId, formData) => { // Modified handleSubmit to handleUpdate
        try {
            await api.put(`/api/events/${eventId}`, formData);
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