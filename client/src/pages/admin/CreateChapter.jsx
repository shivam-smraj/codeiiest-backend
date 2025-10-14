// In /client/src/pages/admin/CreateChapter.jsx

import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateChapterForm from '../../components/CreateChapterForm';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const CreateChapter = () => {
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        try {
            await apiClient.post('/api/chapters', formData);
            alert('Chapter created successfully!');
            navigate('/admin/chapters');
        } catch (err) {
            alert('Failed to create chapter. Check console for details.');
            console.error('Error creating chapter:', err);
        }
    };

    const handleCancel = () => {
        navigate('/admin/chapters');
    };

    return (
        <div style={{ padding: '20px' }}>
            <CreateChapterForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
    );
};

export default CreateChapter;