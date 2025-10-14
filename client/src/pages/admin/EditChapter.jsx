// In /client/src/pages/admin/EditChapter.jsx

import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditChapterForm from '../../components/EditChapterForm';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const EditChapter = () => {
    const navigate = useNavigate();

    const handleUpdate = async (id, formData) => {
        try {
            await apiClient.put(`/api/chapters/${id}`, formData);
            alert('Chapter updated successfully!');
            navigate('/admin/chapters');
        } catch (err) {
            alert('Failed to update chapter. Check console for details.');
            console.error('Error updating chapter:', err);
        }
    };

    const handleCancel = () => {
        navigate('/admin/chapters');
    };

    return (
        <div style={{ padding: '20px' }}>
            <EditChapterForm onUpdate={handleUpdate} onCancel={handleCancel} />
        </div>
    );
};

export default EditChapter;