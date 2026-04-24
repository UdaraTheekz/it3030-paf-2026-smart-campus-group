package com.smartcampus.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;

    private String recipientEmail; // specific user, or "ALL_USERS" / "ALL_TECHNICIANS" / "ALL_ADMINS"
    private String senderName;
    private String title;
    private String message;
    private String type; // BOOKING_CREATED, BOOKING_UPDATED, TICKET_CREATED, TICKET_ASSIGNED, TICKET_UPDATED, CUSTOM

    @Builder.Default
    private boolean read = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
