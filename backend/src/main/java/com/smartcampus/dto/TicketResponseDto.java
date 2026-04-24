package com.smartcampus.dto;

import com.smartcampus.model.TicketCategory;
import com.smartcampus.model.TicketPriority;
import com.smartcampus.model.TicketStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TicketResponseDto {
    private String id;
    private String title;
    private String description;
    private TicketCategory category;
    private TicketPriority priority;
    private TicketStatus status;
    private String resourceId;
    private String resourceName; // Joined from Resource
    private String location;
    private String reportedBy;
    private String reporterName; // Joined from User
    private String assignedTo;
    private String technicianName; // Joined from User
    private String preferredContact;
    private List<String> attachmentUrls;
    private String rejectionReason;
    private String resolutionNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
