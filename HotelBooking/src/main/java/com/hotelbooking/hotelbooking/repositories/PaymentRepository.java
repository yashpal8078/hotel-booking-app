package com.hotelbooking.hotelbooking.repositories;

import com.hotelbooking.hotelbooking.entities.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {
}