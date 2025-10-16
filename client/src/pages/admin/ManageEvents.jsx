// In /codeiiest-backend/client/src/pages/admin/ManageEvents.jsx (Updated with CSS classes)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './AdminTables.css'; // Import the new CSS file

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchEvents = async () => {
        try {
            const { data } = await api.get('/api/events');
            setEvents(data);
        } catch (err) {
            setError('Failed to fetch events. You might not have admin access or the server is down.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/api/events/${id}`);
                setEvents(events.filter(event => event._id !== id));
                alert('Event deleted successfully!');
            } catch (err) {
                setError('Failed to delete event. Check admin permissions.');
                console.error(err);
            }
        }
    };

    if (loading) return <div className="admin-table-container" style={{textAlign: 'center'}}>Loading events...</div>;
    if (error) return <div className="admin-table-container" style={{ color: 'red', textAlign: 'center' }}>Error: {error}</div>;

    return (
        <div className="admin-table-container">
            <h1 className="admin-table-header">Manage Events</h1>
            <button
                onClick={() => navigate('/admin/events/create')}
                className="primary admin-table-actions"
            >
                Create New Event
            </button>

            {events.length === 0 ? (
                <p>No events found. Create one!</p>
            ) : (
                <div className="admin-table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Mini Title</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event._id}>
                                    <td data-label="Title">{event.title}</td>{/* No space before <td data-label="Mini Title"> */}
                                    <td data-label="Mini Title">{event.miniTitle}</td>{/* No space before <td data-label="Date"> */}
                                    <td data-label="Date">{event.sideDetails1?.text2 || 'N/A'}</td>{/* No space before <td data-label="Actions" */}
                                    <td data-label="Actions" className="actions-cell">
                                        <button
                                            onClick={() => navigate(`/admin/events/edit/${event._id}`)}
                                            className="secondary"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event._id)}
                                            className="danger"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageEvents;