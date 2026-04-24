package com.smartcampus.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;
    
    private String userEmail;
    private String userName;
    private String resourceId;
    private String resourceName;
    private String date;
    private String timeRange;
    private String purpose;
    private String phoneNumber;
    
    private BookingStatus status;
    private String reason; // Rejection reason
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
