package com.smartcampus.controller;

import com.smartcampus.model.Notification;
import com.smartcampus.model.Role;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.service.NotificationService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(Authentication authentication) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(authentication.getName()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable String id, Authentication authentication) {
        notificationService.markRead(id, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllRead(Authentication authentication) {
        notificationService.markAllRead(authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendCustomNotification(@RequestBody CustomNotificationRequest request, Authentication authentication) {
        User sender = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only ADMIN or TECHNICIAN can send custom notifications
        if (sender.getRole() == Role.USER) {
            return ResponseEntity.status(403).body("Unauthorized to send notifications");
        }

        // Technicians can only send to users
        String recipientRole = request.getRecipientRole();
        if (sender.getRole() == Role.TECHNICIAN && !("USER".equals(recipientRole))) {
            return ResponseEntity.status(403).body("Technicians can only notify users");
        }

        notificationService.sendCustom(sender.getEmail(), sender.getName(), recipientRole, request.getMessage());
        return ResponseEntity.ok().build();
    }
}

@Data
class CustomNotificationRequest {
    private String recipientRole; // "USER", "TECHNICIAN", or "BOTH"
    private String message;
}
