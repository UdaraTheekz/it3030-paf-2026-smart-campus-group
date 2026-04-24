package com.smartcampus.service;

import com.smartcampus.model.Notification;

import java.util.List;

public interface NotificationService {
    // Internal triggers
    void notify(String recipientEmail, String title, String message, String type);
    void notifyAllByRole(String role, String title, String message, String type);

    // API-facing
    List<Notification> getNotificationsForUser(String userEmail);
    void markRead(String notificationId, String userEmail);
    void markAllRead(String userEmail);

    // Custom send (admin / technician)
    void sendCustom(String senderEmail, String senderName, String recipientRole, String message);
}
