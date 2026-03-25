import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from '../../service/ApiService';

const AdminPage = () => {
    const [adminName, setAdminName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminName = async () => {
            try {
                const resp = await ApiService.myProfile();
                setAdminName(resp.user.firstName);
            } catch (error) { console.log(error.message); }
        };
        fetchAdminName();
    }, []);

    return (
        <div className="admin-page">
            <h1 className="welcome-message">Welcome back, {adminName} 👋</h1>
            <p className="admin-subtitle">Manage your hotel rooms and bookings from here.</p>

            <div className="admin-actions">
                <button className="admin-button" onClick={() => navigate('/admin/manage-rooms')}>
                    🛏️ Manage Rooms
                    <p style={{ fontSize: 13, fontWeight: 400, color: 'var(--grey)', marginTop: 8 }}>Add, edit, or remove hotel rooms</p>
                </button>
                <button className="admin-button" onClick={() => navigate('/admin/manage-bookings')}>
                    📋 Manage Bookings
                    <p style={{ fontSize: 13, fontWeight: 400, color: 'var(--grey)', marginTop: 8 }}>View and update guest reservations</p>
                </button>
            </div>
        </div>
    );
};

export default AdminPage;