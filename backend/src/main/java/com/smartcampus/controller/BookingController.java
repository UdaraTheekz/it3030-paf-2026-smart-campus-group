package com.smartcampus.controller;

import com.smartcampus.dto.BookingDto;
import com.smartcampus.model.Booking;
import com.smartcampus.model.BookingStatus;
import com.smartcampus.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'TECHNICIAN', 'ADMIN')")
    public ResponseEntity<Booking> createBooking(@RequestBody BookingDto bookingDto, Authentication authentication) {
        String userEmail = authentication.getName();
        return new ResponseEntity<>(bookingService.createBooking(bookingDto, userEmail), HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'TECHNICIAN', 'ADMIN')")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(bookingService.getMyBookings(userEmail));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable String id,
            @RequestParam BookingStatus status,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status, reason));
    }
}
