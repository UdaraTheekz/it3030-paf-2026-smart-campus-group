package com.smartcampus.service;

import com.smartcampus.model.Notification;
import com.smartcampus.model.Role;
import com.smartcampus.model.User;
import com.smartcampus.repository.NotificationRepository;
import com.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // ── Internal: send to one specific email ────────────────────────────
    @Override
    public void notify(String recipientEmail, String title, String message, String type) {
        notificationRepository.save(Notification.builder()
                .recipientEmail(recipientEmail)
                .senderName("System")
                .title(title)
                .message(message)
                .type(type)
                .createdAt(LocalDateTime.now())
                .build());
    }

    // ── Internal: broadcast to all users of a given role ────────────────
    @Override
    public void notifyAllByRole(String role, String title, String message, String type) {
        Role roleEnum;
        try { roleEnum = Role.valueOf(role); } catch (Exception e) { return; }
        List<User> recipients = userRepository.findAll().stream()
                .filter(u -> u.getRole() == roleEnum)
                .collect(Collectors.toList());
        for (User u : recipients) {
            notify(u.getEmail(), title, message, type);
        }
    }

    // ── API: get all notifications for logged-in user ────────────────────
    @Override
    public List<Notification> getNotificationsForUser(String userEmail) {
        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(userEmail);
    }

    // ── API: mark single notification as read ────────────────────────────
    @Override
    public void markRead(String notificationId, String userEmail) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (n.getRecipientEmail().equals(userEmail)) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        });
    }

    // ── API: mark all as read for a user ─────────────────────────────────
    @Override
    public void markAllRead(String userEmail) {
        List<Notification> unread = notificationRepository
                .findByRecipientEmailOrderByCreatedAtDesc(userEmail)
                .stream()
                .filter(n -> !n.isRead())
                .collect(Collectors.toList());
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    // ── API: admin/technician sends custom notification ───────────────────
    @Override
    public void sendCustom(String senderEmail, String senderName, String recipientRole, String message) {
        List<String> targetEmails = new ArrayList<>();

        if ("USER".equals(recipientRole) || "BOTH".equals(recipientRole)) {
            userRepository.findAll().stream()
                    .filter(u -> u.getRole() == Role.USER)
                    .map(User::getEmail)
                    .forEach(targetEmails::add);
        }
        if ("TECHNICIAN".equals(recipientRole) || "BOTH".equals(recipientRole)) {
            userRepository.findAll().stream()
                    .filter(u -> u.getRole() == Role.TECHNICIAN)
                    .map(User::getEmail)
                    .forEach(targetEmails::add);
        }

        for (String email : targetEmails) {
            notificationRepository.save(Notification.builder()
                    .recipientEmail(email)
                    .senderName(senderName)
                    .title("Message from " + senderName)
                    .message(message)
                    .type("CUSTOM")
                    .createdAt(LocalDateTime.now())
                    .build());
        }
    }
}
