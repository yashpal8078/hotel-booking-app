import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import Pagination from '../common/Pagination';

const ManageBookingsPage = () => {
  // State to store all bookings fetched from the API
  const [bookings, setBookings] = useState([]);

  // State to hold the current search term entered by the user
  const [searchTerm, setSearchTerm] = useState('');

  // State to track the current page for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Number of bookings to display per page
  const bookingsPerPage = 10;

  // Hook to navigate between pages
  const navigate = useNavigate();

  // Fetch bookings when the component is mounted
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // API call to fetch all bookings
        const response = await ApiService.getAllBookings();
        setBookings(response.bookings || []); // Set bookings or an empty array if no data
      } catch (error) {
        console.error('Error fetching bookings:', error.message);
      }
    };

    fetchBookings();
  }, []);

  /**
   * useMemo is used to memoize filtered bookings.
   * - Filters bookings based on the search term (case-insensitive).
   * - Updates only when `searchTerm` or `bookings` change.
   */
  const filteredBookings = useMemo(() => {
    if (!searchTerm) return bookings; // If no search term, show all bookings
    return bookings.filter((booking) =>
      booking.bookingReference?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, bookings]);

  /**
   * Calculate the bookings to display on the current page.
   * - Updates when `currentPage`, `filteredBookings`, or `bookingsPerPage` changes.
   */
  const currentBookings = useMemo(() => {
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    return filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  }, [currentPage, filteredBookings, bookingsPerPage]);

  // Update search term when user types in the input field
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Manage Bookings</h2>
      </div>

      <div className="admin-filter-bar">
        <div className="filter-group">
          <label>Search by Booking Code:</label>
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="e.g. BKG-1234..."
              className="filter-input"
            />
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="booking-list-grid">
          {currentBookings.map((booking) => (
            <div key={booking.id} className="admin-booking-card">
              <div className="booking-card-header">
                <span className="booking-code">{booking.bookingReference}</span>
                <span className="booking-status-badge" data-status={booking.bookingStatus}>
                  {booking.bookingStatus}
                </span>
              </div>
              <div className="booking-card-body">
                <div className="info-row">
                  <span>Check-in:</span>
                  <strong>{booking.checkInDate}</strong>
                </div>
                <div className="info-row">
                  <span>Check-out:</span>
                  <strong>{booking.checkOutDate}</strong>
                </div>
                <div className="info-row">
                  <span>Total Price:</span>
                  <strong className="coral-text">₹{booking.totalPrice}</strong>
                </div>
                <div className="info-row">
                  <span>Payment:</span>
                  <strong>{booking.paymentStatus}</strong>
                </div>
              </div>
              <div className="booking-card-footer">
                <button
                  className="airbnb-btn outline"
                  onClick={() => navigate(`/admin/edit-booking/${booking.bookingReference}`)}
                >
                  Manage Reservation
                </button>
              </div>
            </div>
          ))}
        </div>

        {currentBookings.length === 0 && (
          <div className="empty-state">No bookings found matching your search.</div>
        )}

        <Pagination
          roomPerPage={bookingsPerPage}
          totalRooms={filteredBookings.length}
          currentPage={currentPage}
          paginate={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ManageBookingsPage;

