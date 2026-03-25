package com.hotelbooking.hotelbooking.payments.razorpay;

import com.hotelbooking.hotelbooking.dtos.NotificationDTO;
import com.hotelbooking.hotelbooking.entities.Booking;
import com.hotelbooking.hotelbooking.entities.PaymentEntity;
import com.hotelbooking.hotelbooking.enums.NotificationType;
import com.hotelbooking.hotelbooking.enums.PaymentGateway;
import com.hotelbooking.hotelbooking.enums.PaymentStatus;
import com.hotelbooking.hotelbooking.exceptions.NotFoundException;
import com.hotelbooking.hotelbooking.payments.razorpay.dto.PaymentRequest;
import com.hotelbooking.hotelbooking.repositories.BookingRepository;
import com.hotelbooking.hotelbooking.repositories.PaymentRepository;
import com.hotelbooking.hotelbooking.services.NotificationService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationService notificationService;

    @Value("${razorpay.api.key.id}")
    private String keyId;

    @Value("${razorpay.api.key.secret}")
    private String secretKey;


    // CREATE RAZORPAY ORDER
    public String createPaymentOrder(PaymentRequest paymentRequest) {

        log.info("Inside createPaymentOrder()");

        String bookingReference = paymentRequest.getBookingReference();

        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new NotFoundException("Booking Not Found"));

        if (booking.getPaymentStatus() == PaymentStatus.COMPLETED) {
            throw new RuntimeException("Payment already made for this booking");
        }

        try {
            RazorpayClient razorpay = new RazorpayClient(keyId, secretKey);

            JSONObject options = new JSONObject();

            // Razorpay expects amount in paisa
            options.put("amount", paymentRequest.getAmount().multiply(BigDecimal.valueOf(100)).intValue());
            options.put("currency", "INR");
            options.put("receipt", bookingReference);

            Order order = razorpay.orders.create(options);

            log.info("Razorpay Order Created: {}", order);

            return order.toString(); // send to frontend

        } catch (Exception e) {
            log.error("Error creating Razorpay order", e);
            throw new RuntimeException("Error creating Razorpay order");
        }
    }


    // UPDATE PAYMENT STATUS
    public void updatePaymentBooking(PaymentRequest paymentRequest) {

        log.info("Inside updatePaymentBooking()");

        String bookingReference = paymentRequest.getBookingReference();

        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new NotFoundException("Booking Not Found"));

        // Create Payment Entry
        PaymentEntity payment = new PaymentEntity();
        payment.setPaymentGateway(PaymentGateway.RAZORPAY);
        payment.setAmount(paymentRequest.getAmount());
        payment.setTransactionId(paymentRequest.getTransactionId()); // razorpay_payment_id
        payment.setPaymentStatus(paymentRequest.isSuccess() ? PaymentStatus.COMPLETED : PaymentStatus.FAILED);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setBookingReference(bookingReference);
        payment.setUser(booking.getUser());

        if (!paymentRequest.isSuccess()) {
            payment.setFailureReason(paymentRequest.getFailureReason());
        }

        paymentRepository.save(payment);

        // Prepare Notification
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .recipient(booking.getUser().getEmail())
                .type(NotificationType.EMAIL)
                .bookingReference(bookingReference)
                .build();

        if (paymentRequest.isSuccess()) {

            booking.setPaymentStatus(PaymentStatus.COMPLETED);
            bookingRepository.save(booking);

            notificationDTO.setSubject("Booking Payment Successful");
            notificationDTO.setBody(
                    "Congratulations!! Your payment for booking reference: "
                            + bookingReference + " is successful."
            );

            notificationService.sendEmail(notificationDTO);

        } else {

            booking.setPaymentStatus(PaymentStatus.FAILED);
            bookingRepository.save(booking);

            notificationDTO.setSubject("Booking Payment Failed");
            notificationDTO.setBody(
                    "Your payment for booking reference: "
                            + bookingReference + " failed. Reason: "
                            + paymentRequest.getFailureReason()
            );

            notificationService.sendEmail(notificationDTO);
        }
    }
}