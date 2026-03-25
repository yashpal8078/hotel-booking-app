import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const myProfileResponse = await ApiService.myProfile();
                setUser(myProfileResponse.user);
                const myBookingResponse = await ApiService.myBookings();
                setBookings(myBookingResponse.bookings);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        };
        fetchUserProfile();
    }, []);

    const handleLogout = () => { ApiService.logout(); navigate('/home'); };
    const handleEditProfile = () => navigate('/edit-profile');

    const initials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() : "?";

    return (
        <div className="profile-page">
            {error && <p className="error-message">{error}</p>}

            {/* Profile Header */}
            {user && (
                <div className="profile-header">
                    <div className="profile-avatar">{initials}</div>
                    <div className="profile-header-info">
                        <h2>Welcome, {user.firstName} {user.lastName}</h2>
                        <p>StaySync Hotel guest</p>
                    </div>
                </div>
            )}

            <div className="profile-actions">
                <button className="edit-profile-button" onClick={handleEditProfile}>Edit Profile</button>
                <button className="logout-button" onClick={handleLogout}>Log out</button>
            </div>

            {/* Profile Details */}
            {user && (
                <div className="profile-details">
                    <h3>Personal information</h3>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
                </div>
            )}

            {/* Booking History */}
            <div className="bookings-section">
                <h3>Booking History</h3>
                <div className="booking-list">
                    {bookings && bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <div key={booking.id} className="booking-item">
                                {booking.room?.imageUrl && (
                                    <img src={booking.room.imageUrl} alt="Room" className="room-photo" />
                                )}
                                <div>
                                    <p><strong>Room:</strong> {booking.room?.type} — #{booking.room?.roomNumber}</p>
                                    <p><strong>Booking Code:</strong> {booking.bookingReference}</p>
                                    <p><strong>Check-in:</strong> {booking.checkInDate}</p>
                                    <p><strong>Check-out:</strong> {booking.checkOutDate}</p>
                                    <p><strong>Amount:</strong> ₹{booking.totalPrice}</p>
                                    <p><strong>Status:</strong> {booking.bookingStatus} · {booking.paymentStatus}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: 'var(--grey)', fontSize: 15 }}>No bookings found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
