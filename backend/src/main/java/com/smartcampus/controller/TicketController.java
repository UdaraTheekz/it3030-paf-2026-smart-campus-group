package com.smartcampus.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcampus.dto.TicketRequestDto;
import com.smartcampus.dto.TicketResponseDto;
import com.smartcampus.model.TicketComment;
import com.smartcampus.model.TicketStatus;
import com.smartcampus.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final ObjectMapper objectMapper;

    @PostMapping(consumes = {"application/json"})
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TicketResponseDto> createTicket(
            @RequestBody TicketRequestDto requestDto,
            Authentication authentication) {
        return ResponseEntity.ok(ticketService.createTicket(requestDto, authentication.getName()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<TicketResponseDto>> getMyTickets(Authentication authentication) {
        return ResponseEntity.ok(ticketService.getMyTickets(authentication.getName()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TicketResponseDto>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/assigned")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<List<TicketResponseDto>> getAssignedTickets(Authentication authentication) {
        return ResponseEntity.ok(ticketService.getAssignedTickets(authentication.getName()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketResponseDto> getTicketById(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponseDto> assignTechnician(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(ticketService.assignTechnician(id, payload.get("technicianId")));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'ADMIN')")
    public ResponseEntity<TicketResponseDto> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> payload,
            Authentication authentication) {
        TicketStatus status = TicketStatus.valueOf(payload.get("status"));
        String notes = payload.get("notes");
        return ResponseEntity.ok(ticketService.updateStatus(id, status, notes, authentication.getName()));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponseDto> rejectTicket(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(ticketService.rejectTicket(id, payload.get("reason")));
    }

    @PostMapping("/{id}/comments")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketComment> addComment(
            @PathVariable String id,
            @RequestBody Map<String, String> payload,
            Authentication authentication) {
        return ResponseEntity.ok(ticketService.addComment(id, payload.get("message"), authentication.getName()));
    }

    @GetMapping("/{id}/comments")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<List<TicketComment>> getComments(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getComments(id));
    }
}
