package com.smartcampus.dto;

import com.smartcampus.model.TicketCategory;
import com.smartcampus.model.TicketPriority;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class TicketRequestDto {
    private String title;
    private String description;
    private TicketCategory category;
    private TicketPriority priority;
    private String resourceId;
    private String location;
    private String preferredContact;
    private List<String> attachmentUrls = new ArrayList<>();
}
