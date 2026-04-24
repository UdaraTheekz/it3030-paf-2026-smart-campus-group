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
@Document(collection = "ticket_comments")
public class TicketComment {
    @Id
    private String id;
    private String ticketId;
    private String userId;
    private String userName; // Denormalized for easy display
    private String message;
    
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
