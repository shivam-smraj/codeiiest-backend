// In /client/src/pages/admin/EditTeamMember.jsx

import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditTeamMemberForm from '../../components/EditTeamMemberForm';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const EditTeamMember = () => {
    const navigate = useNavigate();

    const handleUpdate = async (id, formData) => {
        try {
            await apiClient.put(`/api/team-members/${id}`, formData);
            alert('Team member updated successfully!');
            navigate('/admin/team-members');
        } catch (err) {
            alert('Failed to update team member. Check console for details.');
            console.error('Error updating team member:', err);
        }
    };

    const handleCancel = () => {
        navigate('/admin/team-members');
    };

    return (
        <div style={{ padding: '20px' }}>
            <EditTeamMemberForm onUpdate={handleUpdate} onCancel={handleCancel} />
        </div>
    );
};

export default EditTeamMember;