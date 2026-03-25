package com.hotelbooking.hotelbooking.services;

import com.hotelbooking.hotelbooking.dtos.NotificationDTO;

public interface NotificationService {

    void sendEmail(NotificationDTO notificationDTO);

    void sendSms();

    void sendWhatsapp();
}