// In /codeiiest-backend/client/src/components/UserProfileForm.jsx (Updated with CSS classes)

import React, { useState, useEffect } from 'react';
import './UserProfileForm.css'; // Import the new CSS file

const UserProfileForm = ({ user, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        enrollmentNo: '',
        githubId: '',
        leetcodeId: '',
        codechefId: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                enrollmentNo: user.enrollmentNo || '',
                githubId: user.githubId || '',
                leetcodeId: user.leetcodeId || '',
                codechefId: user.codechefId || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { enrollmentNo, githubId, leetcodeId, codechefId } = formData;
        onSubmit({ enrollmentNo, githubId, leetcodeId, codechefId });
    };

    const handleVerifyCodeforces = () => {
        window.location.href =  `${import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000'}/api/auth/codeforces`;
    };

    return (
        <form onSubmit={handleSubmit} className="user-profile-form-container"> {/* Use main container class */}
            <h2>Edit Your Profile</h2>

            <div>
                <label htmlFor="enrollmentNo">Enrollment Number:</label>
                <input type="text" id="enrollmentNo" name="enrollmentNo" value={formData.enrollmentNo} onChange={handleChange} />
            </div>

            <div>
                <label htmlFor="githubId">GitHub ID:</label>
                <input type="text" id="githubId" name="githubId" value={formData.githubId} onChange={handleChange} />
            </div>

            {/* Codeforces Integration */}
            <div className="codeforces-section"> {/* Use Codeforces section class */}
                <label style={{ marginBottom: '0.8rem' }}>Codeforces Handle:</label>
                {user && user.codeforcesId ? (
                    <div className="codeforces-display-row"> {/* Use display row class */}
                        <span className="codeforces-handle-text">{user.codeforcesId}</span>
                        <button type="button" onClick={handleVerifyCodeforces} className="secondary">
                            Edit/Re-verify Handle
                        </button>
                    </div>
                ) : (
                    <button type="button" onClick={handleVerifyCodeforces} className="primary">
                        Verify Your Codeforces Handle
                    </button>
                )}
            </div>

            <div>
                <label htmlFor="leetcodeId">LeetCode ID:</label>
                <input type="text" id="leetcodeId" name="leetcodeId" value={formData.leetcodeId} onChange={handleChange} />
            </div>

            <div>
                <label htmlFor="codechefId">CodeChef ID:</label>
                <input type="text" id="codechefId" name="codechefId" value={formData.codechefId} onChange={handleChange} />
            </div>

            <div className="form-actions"> {/* Use form actions class */}
                <button type="submit" className="primary">
                    Save Changes
                </button>
                <button type="button" onClick={onCancel} className="secondary">
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default UserProfileForm;