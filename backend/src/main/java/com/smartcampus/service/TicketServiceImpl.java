package com.smartcampus.service;

import com.smartcampus.dto.TicketRequestDto;
import com.smartcampus.dto.TicketResponseDto;
import com.smartcampus.model.*;
import com.smartcampus.repository.ResourceRepository;
import com.smartcampus.repository.TicketCommentRepository;
import com.smartcampus.repository.TicketRepository;
import com.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final TicketCommentRepository commentRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;

    @Override
    public TicketResponseDto createTicket(TicketRequestDto request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Attachment URLs come directly from the frontend (uploaded to Supabase)
        List<String> attachmentUrls = (request.getAttachmentUrls() != null)
                ? request.getAttachmentUrls()
                : java.util.Collections.emptyList();

        Ticket ticket = Ticket.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .priority(request.getPriority())
                .status(TicketStatus.OPEN)
                .resourceId(request.getResourceId() != null && !request.getResourceId().isEmpty() ? request.getResourceId() : null)
                .location(request.getLocation())
                .reportedBy(user.getId())
                .preferredContact(request.getPreferredContact())
                .attachmentUrls(attachmentUrls)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Ticket savedTicket = ticketRepository.save(ticket);

        // Notify user of creation
        notificationService.notify(
                user.getEmail(),
                "Incident Reported Successfully",
                "Your ticket '" + ticket.getTitle() + "' has been submitted and is currently " + ticket.getStatus() + ".",
                "TICKET_CREATED"
        );

        return mapToResponseDto(savedTicket);
    }

    @Override
    public List<TicketResponseDto> getMyTickets(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ticketRepository.findByReportedBy(user.getId()).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketResponseDto> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketResponseDto> getAssignedTickets(String technicianEmail) {
        User tech = userRepository.findByEmail(technicianEmail)
                .orElseThrow(() -> new RuntimeException("Technician not found"));
        return ticketRepository.findByAssignedTo(tech.getId()).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public TicketResponseDto getTicketById(String id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        return mapToResponseDto(ticket);
    }

    @Override
    public TicketResponseDto assignTechnician(String ticketId, String technicianId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        userRepository.findById(technicianId)
                .filter(u -> u.getRole() == Role.TECHNICIAN)
                .orElseThrow(() -> new RuntimeException("Valid technician not found"));

        ticket.setAssignedTo(technicianId);
        ticket.setUpdatedAt(LocalDateTime.now());
        Ticket savedTicket = ticketRepository.save(ticket);

        // Notify the assigned technician
        User technician = userRepository.findById(technicianId).get();
        notificationService.notify(
                technician.getEmail(),
                "New Ticket Assigned",
                "You have been assigned to ticket: '" + ticket.getTitle() + "'. Priority: " + ticket.getPriority(),
                "TICKET_ASSIGNED"
        );

        return mapToResponseDto(savedTicket);
    }

    @Override
    public TicketResponseDto updateStatus(String ticketId, TicketStatus status, String notes, String userEmail) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        ticket.setStatus(status);
        if (notes != null && !notes.isEmpty()) {
            ticket.setResolutionNotes(notes);
        }
        ticket.setUpdatedAt(LocalDateTime.now());
        
        // Add a system comment about the status change
        User user = userRepository.findByEmail(userEmail).orElse(null);
        String userName = user != null ? user.getName() : "System";
        
        TicketComment comment = TicketComment.builder()
                .ticketId(ticketId)
                .userId(user != null ? user.getId() : "system")
                .userName(userName)
                .message("Status updated to " + status + (notes != null ? ": " + notes : ""))
                .timestamp(LocalDateTime.now())
                .build();
        commentRepository.save(comment);

        Ticket savedTicket = ticketRepository.save(ticket);

        // Notify the user who reported the ticket
        userRepository.findById(ticket.getReportedBy()).ifPresent(reporter -> {
            notificationService.notify(
                    reporter.getEmail(),
                    "Ticket Status Updated",
                    "Your ticket '" + ticket.getTitle() + "' is now " + status + ".",
                    "TICKET_UPDATED"
            );
        });

        return mapToResponseDto(savedTicket);
    }

    @Override
    public TicketResponseDto rejectTicket(String ticketId, String reason) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        ticket.setStatus(TicketStatus.REJECTED);
        ticket.setRejectionReason(reason);
        ticket.setUpdatedAt(LocalDateTime.now());
        Ticket savedTicket = ticketRepository.save(ticket);

        userRepository.findById(ticket.getReportedBy()).ifPresent(reporter -> {
            notificationService.notify(
                    reporter.getEmail(),
                    "Ticket Rejected",
                    "Your ticket '" + ticket.getTitle() + "' was rejected. Reason: " + reason,
                    "TICKET_UPDATED"
            );
        });

        return mapToResponseDto(savedTicket);
    }

    @Override
    public TicketComment addComment(String ticketId, String message, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        TicketComment comment = TicketComment.builder()
                .ticketId(ticketId)
                .userId(user.getId())
                .userName(user.getName())
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
        
        return commentRepository.save(comment);
    }

    @Override
    public List<TicketComment> getComments(String ticketId) {
        return commentRepository.findByTicketIdOrderByTimestampAsc(ticketId);
    }

    private TicketResponseDto mapToResponseDto(Ticket ticket) {
        String reporterName = userRepository.findById(ticket.getReportedBy())
                .map(User::getName).orElse("Unknown");
        
        String techName = ticket.getAssignedTo() != null ? 
                userRepository.findById(ticket.getAssignedTo()).map(User::getName).orElse("Unassigned") : "Unassigned";
        
        String resourceName = ticket.getResourceId() != null ?
                resourceRepository.findById(ticket.getResourceId()).map(Resource::getResourceName).orElse("N/A") : "N/A";

        return TicketResponseDto.builder()
                .id(ticket.getId())
                .title(ticket.getTitle())
                .description(ticket.getDescription())
                .category(ticket.getCategory())
                .priority(ticket.getPriority())
                .status(ticket.getStatus())
                .resourceId(ticket.getResourceId())
                .resourceName(resourceName)
                .location(ticket.getLocation())
                .reportedBy(ticket.getReportedBy())
                .reporterName(reporterName)
                .assignedTo(ticket.getAssignedTo())
                .technicianName(techName)
                .preferredContact(ticket.getPreferredContact())
                .attachmentUrls(ticket.getAttachmentUrls())
                .rejectionReason(ticket.getRejectionReason())
                .resolutionNotes(ticket.getResolutionNotes())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }
}
