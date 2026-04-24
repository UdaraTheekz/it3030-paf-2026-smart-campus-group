package com.smartcampus.service;

import com.smartcampus.model.Role;
import com.smartcampus.model.User;
import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    User updateUserStatus(String id, Boolean active, Role role);
}
