package com.smartcampus.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private String title;
    private String description;
    private TicketCategory category;
    private TicketPriority priority;
    
    @Builder.Default
    private TicketStatus status = TicketStatus.OPEN;
    
    private String resourceId; // Optional link to a specific resource
    private String location;   // Manual location if resourceId is missing
    
    private String reportedBy; // User ID
    private String assignedTo; // Technician User ID
    
    private String preferredContact; // Contact details (Phone, Email, etc.)
    
    @Builder.Default
    private List<String> attachmentUrls = new ArrayList<>();
    
    private String rejectionReason;
    private String resolutionNotes;
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
