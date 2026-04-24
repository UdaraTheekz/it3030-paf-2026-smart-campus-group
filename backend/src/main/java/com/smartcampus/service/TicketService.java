package com.smartcampus.service;

import com.smartcampus.dto.TicketRequestDto;
import com.smartcampus.dto.TicketResponseDto;
import com.smartcampus.model.TicketComment;
import com.smartcampus.model.TicketStatus;

import java.util.List;

public interface TicketService {
    TicketResponseDto createTicket(TicketRequestDto request, String userEmail);
    List<TicketResponseDto> getMyTickets(String userEmail);
    List<TicketResponseDto> getAllTickets();
    List<TicketResponseDto> getAssignedTickets(String technicianEmail);
    TicketResponseDto getTicketById(String id);
    
    TicketResponseDto assignTechnician(String ticketId, String technicianId);
    TicketResponseDto updateStatus(String ticketId, TicketStatus status, String notes, String userEmail);
    TicketResponseDto rejectTicket(String ticketId, String reason);
    
    TicketComment addComment(String ticketId, String message, String userEmail);
    List<TicketComment> getComments(String ticketId);
}
