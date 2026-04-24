package com.smartcampus.service;

import com.smartcampus.dto.BookingDto;
import com.smartcampus.model.Booking;
import com.smartcampus.model.BookingStatus;

import java.util.List;

public interface BookingService {
    Booking createBooking(BookingDto bookingDto, String userEmail);
    List<Booking> getMyBookings(String userEmail);
    List<Booking> getAllBookings();
    Booking updateBookingStatus(String id, BookingStatus status, String reason);
}
