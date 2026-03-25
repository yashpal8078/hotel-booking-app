package com.hotelbooking.hotelbooking.services;


import com.hotelbooking.hotelbooking.dtos.BookingDTO;
import com.hotelbooking.hotelbooking.dtos.Response;

public interface BookingService {

    Response getAllBookings();

    Response createBooking(BookingDTO bookingDTO);

    Response findBookingByReferenceNo(String bookingReference);

    Response updateBooking(BookingDTO bookingDTO);
}