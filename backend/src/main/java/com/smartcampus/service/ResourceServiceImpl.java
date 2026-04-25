package com.smartcampus.service;

import com.smartcampus.dto.ResourceDto;
import com.smartcampus.model.Resource;
import com.smartcampus.model.ResourceType;
import com.smartcampus.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    private static final Map<ResourceType, String> PREFIX_MAP = Map.ofEntries(
            Map.entry(ResourceType.LECTURE_HALL, "LH"),
            Map.entry(ResourceType.COMPUTER_LAB, "CL"),
            Map.entry(ResourceType.MEETING_ROOM, "MR"),
            Map.entry(ResourceType.AUDITORIUM, "AD"),
            Map.entry(ResourceType.SEMINAR_HALL, "SH"),
            Map.entry(ResourceType.SPORTS_GROUND, "SG"),
            Map.entry(ResourceType.CONFERENCE_ROOM, "CR"),
            Map.entry(ResourceType.LIBRARY_ROOM, "LR"),
            Map.entry(ResourceType.PROJECTOR, "PR"),
            Map.entry(ResourceType.CAMERA_EQUIPMENT, "CAM"),
            Map.entry(ResourceType.SOUND_SYSTEM, "SS"),
            Map.entry(ResourceType.LABORATORY_EQUIPMENT, "LE")
    );

    @Override
    public Resource createResource(ResourceDto resourceDto, String adminEmail) {
        if (resourceDto.getCapacity() <= 0) {
            throw new IllegalArgumentException("Capacity must be greater than zero");
        }

        String resourceCode = generateResourceCode(resourceDto.getResourceType());

        Resource resource = Resource.builder()
                .resourceName(resourceDto.getResourceName())
                .resourceCode(resourceCode)
                .resourceType(resourceDto.getResourceType())
                .description(resourceDto.getDescription())
                .building(resourceDto.getBuilding())
                .floor(resourceDto.getFloor())
                .roomNumber(resourceDto.getRoomNumber())
                .capacity(resourceDto.getCapacity())
                .status(resourceDto.getStatus())
                .imageUrl(resourceDto.getImageUrl())
                .createdAt(LocalDateTime.now())
                .createdBy(adminEmail)
                .build();

        return resourceRepository.save(resource);
    }

    @Override
    public java.util.List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    @Override
    public Resource getResourceById(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
    }




    @Override
    public Resource updateResource(String id, ResourceDto resourceDto) {
        Resource existingResource = getResourceById(id);
        
        existingResource.setResourceName(resourceDto.getResourceName());
        existingResource.setResourceType(resourceDto.getResourceType());
        existingResource.setDescription(resourceDto.getDescription());
        existingResource.setBuilding(resourceDto.getBuilding());
        existingResource.setFloor(resourceDto.getFloor());
        existingResource.setRoomNumber(resourceDto.getRoomNumber());
        existingResource.setCapacity(resourceDto.getCapacity());
        existingResource.setStatus(resourceDto.getStatus());
        existingResource.setImageUrl(resourceDto.getImageUrl());
        
        return resourceRepository.save(existingResource);
    }

    @Override
    public void deleteResource(String id) {
        if (!resourceRepository.existsById(id)) {
            throw new RuntimeException("Resource not found with id: " + id);
        }
        resourceRepository.deleteById(id);
    }

    private String generateResourceCode(ResourceType type) {
        String prefix = PREFIX_MAP.getOrDefault(type, "RES");
        long count = resourceRepository.countByResourceType(type);
        return String.format("%s-%03d", prefix, count + 1);
    }


    
}
