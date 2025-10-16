import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './AdminTables.css';

const ManageChapters = () => {
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchChapters = async () => {
        try {
            const { data } = await api.get('/api/chapters');
            setChapters(data);
        } catch (err) {
            setError('Failed to fetch chapters. You might not have admin access or the server is down.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChapters();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this chapter?')) {
            try {
                await api.delete(`/api/chapters/${id}`);
                setChapters(chapters.filter(chapter => chapter._id !== id));
                alert('Chapter deleted successfully!');
            } catch (err) {
                setError('Failed to delete chapter. Check admin permissions.');
                console.error(err);
            }
        }
    };

    if (loading) return <div className="admin-table-container" style={{ textAlign: 'center' }}>Loading chapters...</div>;
    if (error) return <div className="admin-table-container" style={{ color: 'red', textAlign: 'center' }}>Error: {error}</div>;

    return (
        <div className="admin-table-container">
            <h1 className="admin-table-header">Manage Chapters</h1>
            <button
                onClick={() => navigate('/admin/chapters/create')}
                className="primary admin-table-actions"
            >
                Create New Chapter
            </button>

            {chapters.length === 0 ? (
                <p>No chapters found. Create one!</p>
            ) : (
                <div className="admin-table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Leads</th>
                                <th>Core Members</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chapters.map((chapter) => (
                                <tr key={chapter._id}>
                                    <td data-label="Name">{chapter.name}</td>{/* No space */}
                                    <td data-label="Leads">
                                        {chapter.leads.map(lead => lead.name).join(', ') || 'None'}
                                    </td>{/* No space */}
                                    <td data-label="Core Members">
                                        {chapter.coreMembers.map(member => member.name).join(', ') || 'None'}
                                    </td>{/* No space */}
                                    <td data-label="Actions" className="actions-cell">
                                        <button
                                            onClick={() => navigate(`/admin/chapters/edit/${chapter._id}`)}
                                            className="secondary"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(chapter._id)}
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

export default ManageChapters;