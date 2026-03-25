package com.hotelbooking.hotelbooking.repositories;

import com.hotelbooking.hotelbooking.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}