package com.smartcampus.repository;

import com.smartcampus.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(String recipientEmail);
    long countByRecipientEmailAndReadFalse(String recipientEmail);
}
