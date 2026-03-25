package com.hotelbooking.hotelbooking;

import com.hotelbooking.hotelbooking.dtos.NotificationDTO;
import com.hotelbooking.hotelbooking.services.NotificationService;
import jakarta.annotation.PostConstruct;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.bind.annotation.RequestMapping;

@SpringBootApplication
@EnableAsync
@RequestMapping
public class HotelBookingApplication {



    public static void main(String[] args) {
        SpringApplication.run(HotelBookingApplication.class, args);
    }

}
