package com.smartcampus.service;

import com.smartcampus.dto.ResourceDto;
import com.smartcampus.model.Resource;

import java.util.List;

public interface ResourceService {
    Resource createResource(ResourceDto resourceDto, String adminEmail);
    List<Resource> getAllResources();
    Resource getResourceById(String id);
    Resource updateResource(String id, ResourceDto resourceDto);
    void deleteResource(String id);
}
