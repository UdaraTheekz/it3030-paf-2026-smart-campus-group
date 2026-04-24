package com.smartcampus.dto;

import com.smartcampus.model.ResourceStatus;
import com.smartcampus.model.ResourceType;
import lombok.Data;

@Data
public class ResourceDto {
    private String resourceName;
    private ResourceType resourceType;
    private String description;
    private String building;
    private String floor;
    private String roomNumber;
    private Integer capacity;
    private ResourceStatus status;
    private String imageUrl;
}
