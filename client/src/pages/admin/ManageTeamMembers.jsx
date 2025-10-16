import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './AdminTables.css';

const ManageTeamMembers = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchTeamMembers = async () => {
        try {
            const { data } = await api.get('/api/team-members');
            setTeamMembers(data);
        } catch (err) {
            setError('Failed to fetch team members. You might not have admin access or the server is down.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this team member?')) {
            try {
                await api.delete(`/api/team-members/${id}`);
                setTeamMembers(teamMembers.filter(member => member._id !== id));
                alert('Team member deleted successfully!');
            } catch (err) {
                setError('Failed to delete team member. Check admin permissions.');
                console.error(err);
            }
        }
    };

    if (loading) return <div className="admin-table-container" style={{ textAlign: 'center' }}>Loading team members...</div>;
    if (error) return <div className="admin-table-container" style={{ color: 'red', textAlign: 'center' }}>Error: {error}</div>;

    return (
        <div className="admin-table-container">
            <h1 className="admin-table-header">Manage Team Members</h1>
            <button
                onClick={() => navigate('/admin/team-members/create')}
                className="primary admin-table-actions"
            >
                Create New Team Member
            </button>

            {teamMembers.length === 0 ? (
                <p>No team members found. Create one!</p>
            ) : (
                <div className="admin-table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role (CodeIIEST)</th>
                                <th>Linked User</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamMembers.map((member) => (
                                <tr key={member._id}>
                                    <td data-label="Name">{member.name}</td>{/* No space */}
                                    <td data-label="Role (CodeIIEST)">{member.codeiiest || 'N/A'}</td>{/* No space */}
                                    <td data-label="Linked User">
                                        {member.user ? `${member.user.displayName} (${member.user.email})` : 'None'}
                                    </td>{/* No space */}
                                    <td data-label="Actions" className="actions-cell">
                                        <button
                                            onClick={() => navigate(`/admin/team-members/edit/${member._id}`)}
                                            className="secondary"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(member._id)}
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

export default ManageTeamMembers;