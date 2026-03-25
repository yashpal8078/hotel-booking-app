package com.hotelbooking.hotelbooking.payments.razorpay;

import com.hotelbooking.hotelbooking.payments.razorpay.dto.PaymentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/pay")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentRequest paymentRequest){
        return ResponseEntity.ok(paymentService.createPaymentOrder(paymentRequest));
    }

    @PutMapping("/update")
    public void updatePaymentBooking(@RequestBody PaymentRequest paymentRequest){
        paymentService.updatePaymentBooking(paymentRequest);
    }
}