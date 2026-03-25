import React, { useState } from 'react';
import ApiService from '../../service/ApiService';

const FindBookingPage = () => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!confirmationCode.trim()) {
            setError("Please enter a booking confirmation code");
            setTimeout(() => setError(''), 5000);
            return;
        }
        setLoading(true);
        setBookingDetails(null);
        try {
            const response = await ApiService.getBookingByReference(confirmationCode);
            setBookingDetails(response.booking);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || "No booking found with that code.");
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const statusColor = (status) => {
        if (!status) return '#717171';
        const s = status.toLowerCase();
        if (s.includes('confirm') || s.includes('paid') || s.includes('success')) return '#1a7a43';
        if (s.includes('cancel') || s.includes('fail')) return '#c13515';
        return '#b45309';
    };

    const displayBookingStatus = () => {
        if (!bookingDetails.paymentStatus || bookingDetails.paymentStatus.toLowerCase().includes('pending')) {
            return 'PENDING PAYMENT';
        }
        return bookingDetails.bookingStatus;
    };

    return (
        <div className="find-booking-wrapper">

            {/* ── HERO ─────────────────────────────── */}
            <div className="find-booking-hero">
                <span className="find-booking-hero-icon">🔍</span>
                <h1>Find Your Booking</h1>
                <p>Enter your confirmation code to view your reservation details</p>

                {/* Search Bar */}
                <div className="find-booking-search-bar">
                    <span className="fbs-icon">🎫</span>
                    <input
                        type="text"
                        placeholder="e.g. BKG-2024-XXXXXX"
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="fbs-input"
                    />
                    <button
                        className="fbs-btn"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        {loading ? "Searching…" : "Find Booking"}
                    </button>
                </div>

                {error && <p className="error-message fbs-error">{error}</p>}
            </div>

            {/* ── RESULT ───────────────────────────── */}
            {bookingDetails && (
                <div className="fb-result-wrap">

                    {/* Status Badge */}
                    <div className="fb-status-badge">
                        <span className="fb-status-icon">✅</span>
                        <div>
                            <p className="fb-status-label">Booking Found</p>
                            <p className="fb-ref-code">{bookingDetails.bookingReference}</p>
                        </div>
                        <span
                            className="fb-status-pill"
                            style={{ background: statusColor(displayBookingStatus()) + '22', color: statusColor(displayBookingStatus()) }}
                        >
                            {displayBookingStatus()}
                        </span>
                    </div>

                    <div className="fb-cards-grid">

                        {/* Booking Info Card */}
                        <div className="fb-card">
                            <h3 className="fb-card-title">📅 Booking Details</h3>
                            <div className="fb-info-list">
                                <div className="fb-info-row">
                                    <span>Confirmation Code</span>
                                    <strong>{bookingDetails.bookingReference}</strong>
                                </div>
                                <div className="fb-info-row">
                                    <span>Check-in</span>
                                    <strong>{bookingDetails.checkInDate}</strong>
                                </div>
                                <div className="fb-info-row">
                                    <span>Check-out</span>
                                    <strong>{bookingDetails.checkOutDate}</strong>
                                </div>
                                <div className="fb-info-row">
                                    <span>Total Amount</span>
                                    <strong className="fb-price">₹{bookingDetails.totalPrice}</strong>
                                </div>
                                <div className="fb-info-row">
                                    <span>Payment Status</span>
                                    <strong style={{ color: statusColor(bookingDetails.paymentStatus) }}>
                                        {bookingDetails.paymentStatus || 'PENDING'}
                                    </strong>
                                </div>
                                <div className="fb-info-row">
                                    <span>Booking Status</span>
                                    <strong style={{ color: statusColor(displayBookingStatus()) }}>
                                        {displayBookingStatus()}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* Guest Info Card */}
                        <div className="fb-card">
                            <h3 className="fb-card-title">👤 Guest Information</h3>
                            <div className="fb-guest-avatar">
                                {bookingDetails.user?.firstName?.[0]}{bookingDetails.user?.lastName?.[0]}
                            </div>
                            <div className="fb-info-list" style={{ marginTop: 16 }}>
                                <div className="fb-info-row">
                                    <span>First Name</span>
                                    <strong>{bookingDetails.user?.firstName}</strong>
                                </div>
                                <div className="fb-info-row">
                                    <span>Last Name</span>
                                    <strong>{bookingDetails.user?.lastName}</strong>
                                </div>
                                <div className="fb-info-row">
                                    <span>Email</span>
                                    <strong>{bookingDetails.user?.email}</strong>
                                </div>
                                <div className="fb-info-row">
                                    <span>Phone</span>
                                    <strong>{bookingDetails.user?.phoneNumber}</strong>
                                </div>
                            </div>
                        </div>

                        {/* Room Info Card */}
                        <div className="fb-card fb-room-card">
                            <h3 className="fb-card-title">🛏️ Room Details</h3>
                            {bookingDetails.room?.imageUrl && (
                                <img
                                    src={bookingDetails.room.imageUrl}
                                    alt={bookingDetails.room.type}
                                    className="fb-room-img"
                                />
                            )}
                            <div className="fb-info-list">
                                <div className="fb-info-row">
                                    <span>Room Number</span>
                                    <strong>{bookingDetails.room?.roomNumber}</strong>
                                </div>
                                <div className="fb-info-row">
                                    <span>Room Type</span>
                                    <strong>{bookingDetails.room?.type}</strong>
                                </div>
                                <div className="fb-info-row">
                                    <span>Capacity</span>
                                    <strong>Up to {bookingDetails.room?.capacity} guests</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── EMPTY STATE (no search yet) ──────── */}
            {!bookingDetails && !loading && !error && (
                <div className="fb-empty-state">
                    <div className="fb-empty-steps">
                        <div className="fb-empty-step">
                            <span className="fb-step-icon">📧</span>
                            <p>Check your email for the booking confirmation code</p>
                        </div>
                        <div className="fb-empty-step-divider">→</div>
                        <div className="fb-empty-step">
                            <span className="fb-step-icon">📋</span>
                            <p>Enter the code in the search bar above</p>
                        </div>
                        <div className="fb-empty-step-divider">→</div>
                        <div className="fb-empty-step">
                            <span className="fb-step-icon">✅</span>
                            <p>View all your booking & guest details instantly</p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default FindBookingPage;
