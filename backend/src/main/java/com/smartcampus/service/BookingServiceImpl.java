package com.smartcampus.service;

import com.smartcampus.dto.BookingDto;
import com.smartcampus.model.Booking;
import com.smartcampus.model.BookingStatus;
import com.smartcampus.model.User;
import com.smartcampus.repository.BookingRepository;
import com.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    public Booking createBooking(BookingDto bookingDto, String userEmail) {
        // Fetch user info
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check for overlaps
        List<Booking> existingBookings = bookingRepository.findByResourceIdAndDateAndStatusIn(
                bookingDto.getResourceId(),
                bookingDto.getDate(),
                List.of(BookingStatus.PENDING, BookingStatus.APPROVED)
        );

        for (Booking existing : existingBookings) {
            if (isOverlapping(bookingDto.getTimeRange(), existing.getTimeRange())) {
                if (existing.getStatus() == BookingStatus.APPROVED) {
                    throw new RuntimeException("Can't book at this time");
                } else {
                    throw new RuntimeException("A reservation request for this time is already under review.");
                }
            }
        }

        Booking booking = Booking.builder()
                .userEmail(userEmail)
                .userName(user.getName())
                .resourceId(bookingDto.getResourceId())
                .resourceName(bookingDto.getResourceName())
                .date(bookingDto.getDate())
                .timeRange(bookingDto.getTimeRange())
                .purpose(bookingDto.getPurpose())
                .phoneNumber(bookingDto.getPhoneNumber())
                .status(BookingStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
        Booking savedBooking = bookingRepository.save(booking);

        // 1. Notify user
        notificationService.notify(
                userEmail,
                "Booking Request Submitted",
                "Your request for " + bookingDto.getResourceName() + " on " + bookingDto.getDate() + " is pending approval.",
                "BOOKING_CREATED"
        );

        // 2. Notify all admins
        notificationService.notifyAllByRole(
                "ADMIN",
                "New Booking Request",
                user.getName() + " requested " + bookingDto.getResourceName() + " for " + bookingDto.getDate(),
                "BOOKING_CREATED"
        );

        // 3. Notify all technicians
        notificationService.notifyAllByRole(
                "TECHNICIAN",
                "New Booking Request",
                user.getName() + " requested " + bookingDto.getResourceName() + " for " + bookingDto.getDate(),
                "BOOKING_CREATED"
        );

        return savedBooking;
    }

    private boolean isOverlapping(String newRange, String existingRange) {
        try {
            String[] newTimes = newRange.split(" - ");
            String[] existingTimes = existingRange.split(" - ");
            
            int newStart = parseTime(newTimes[0]);
            int newEnd = parseTime(newTimes[1]);
            int existingStart = parseTime(existingTimes[0]);
            int existingEnd = parseTime(existingTimes[1]);
            
            return (newStart < existingEnd) && (existingStart < newEnd);
        } catch (Exception e) {
            return false;
        }
    }

    private int parseTime(String time) {
        String[] parts = time.trim().split(":");
        int hours = Integer.parseInt(parts[0]);
        int minutes = Integer.parseInt(parts[1].split(" ")[0]); // Handle AM/PM if present, though current frontend uses 24h format "08:00"
        return hours * 60 + minutes;
    }

    @Override
    public List<Booking> getMyBookings(String userEmail) {
        return bookingRepository.findByUserEmail(userEmail);
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }


    

    @Override
    public Booking updateBookingStatus(String id, BookingStatus status, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        booking.setReason(reason);
        Booking savedBooking = bookingRepository.save(booking);

        // Notify user of status change
        notificationService.notify(
                booking.getUserEmail(),
                "Booking " + status,
                "Your booking for " + booking.getResourceName() + " on " + booking.getDate() + " is now " + status + (reason != null ? ". Reason: " + reason : ""),
                "BOOKING_UPDATED"
        );

        return savedBooking;
    }
}
