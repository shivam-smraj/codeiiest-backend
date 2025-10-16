// In /client/src/pages/admin/CreateTeamMember.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import CreateTeamMemberForm from '../../components/CreateTeamMemberForm.jsx';

const CreateTeamMember = () => {
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        try {
            await api.post('/api/team-members', formData);
            alert('Team member created successfully!');
            navigate('/admin/team-members');
        } catch (err) {
            alert('Failed to create team member. Check console for details.');
            console.error('Error creating team member:', err);
        }
    };

    const handleCancel = () => {
        navigate('/admin/team-members');
    };

    return (
        <div style={{ padding: '20px' }}>
            <CreateTeamMemberForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
    );
};

export default CreateTeamMember;