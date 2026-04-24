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
@Document(collection = "resources")
public class Resource {
    @Id
    private String id;
    private String resourceName;
    private String resourceCode; // e.g., LH-001
    private ResourceType resourceType;
    private String description;
    private String building;
    private String floor;
    private String roomNumber;
    private Integer capacity;
    private ResourceStatus status;
    private String imageUrl;
    private LocalDateTime createdAt;
    private String createdBy;
}
