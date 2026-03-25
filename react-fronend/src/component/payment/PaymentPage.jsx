import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const PaymentPage = () => {
    const { bookingReference, amount } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
    const [autoOpenAttempted, setAutoOpenAttempted] = useState(false);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const paymentData = { bookingReference, amount };
                const response = await ApiService.proceedForPayment(paymentData);
                setOrderDetails(response);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        };
        fetchOrderDetails();
    }, [bookingReference, amount]);

    // Timer logic
    useEffect(() => {
        const timerKey = `payment_timer_${bookingReference}`;
        let endTime = localStorage.getItem(timerKey);

        if (!endTime) {
            endTime = Date.now() + 30 * 60 * 1000;
            localStorage.setItem(timerKey, endTime);
        }

        const interval = setInterval(() => {
            const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeLeft(remaining);
            if (remaining === 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [bookingReference]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const handlePaymentStatus = async (paymentStatus, transactionId = "", failureReason = "") => {
        try {
            const paymentData = {
                bookingReference,
                amount,
                transactionId,
                success: paymentStatus === "succeeded",
                failureReason
            };
            await ApiService.updateBookingPaymeent(paymentData);
        } catch (error) {
            console.log(error.message);
        }
    };

    const handlePayment = async () => {
        setProcessing(true);
        const res = await loadRazorpayScript();

        if (!res) {
            setError("Razorpay SDK failed to load. Are you online?");
            setProcessing(false);
            return;
        }

        if (!orderDetails) {
            setError("Order details missing.");
            setProcessing(false);
            return;
        }

        // Setup Razorpay options
        const options = {
            key: orderDetails.key || "rzp_test_SUMWgcBTyaeYpB",
            amount: orderDetails.amount || Math.round(parseFloat(amount) * 100),
            currency: orderDetails.currency || "INR",
            name: "StaySync Hotel",
            description: "Room Booking Payment",
            order_id: orderDetails.id || orderDetails.orderId || orderDetails.razorpayOrderId,
            handler: async function (response) {
                // Success handler
                await handlePaymentStatus("succeeded", response.razorpay_payment_id);
                navigate(`/payment-success/${bookingReference}`);
            },
            prefill: {
                name: "Customer",
                email: "customer@staysynchotel.com"
            },
            theme: {
                color: "#FF385C"
            },
            modal: {
                ondismiss: function () {
                    setProcessing(false);
                }
            }
        };


        if (!options.order_id) {
            setError(`Missing Order ID! Your backend did not return a valid Razorpay order ID. Backend returned: ${JSON.stringify(orderDetails)}`);
            setProcessing(false);
            return;
        }

        console.log("Opening Razorpay with options:", options);
        const rzp1 = new window.Razorpay(options);

        rzp1.on("payment.failed", async function (response) {
            await handlePaymentStatus("failed", "", response.error.description);
            navigate(`/payment-failed/${bookingReference}`);
        });

        rzp1.open();
        // Wait for modal dismiss state or success
    };

    // Auto-open logic
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get("autoOpen") === "true" && orderDetails && !autoOpenAttempted && timeLeft > 0) {
            setAutoOpenAttempted(true);
            handlePayment();
        }
    }, [orderDetails, location.search, autoOpenAttempted, timeLeft]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="payment-page" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div className="payment-container" style={{ width: '100%', maxWidth: '450px', background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-card)' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: 'var(--dark)' }}>Review & Pay</h2>
                <p style={{ color: 'var(--grey)', fontSize: '15px', marginBottom: '16px' }}>Booking Ref: {bookingReference}</p>

                {/* --- 30 Min Timer Display --- */}
                <div style={{ background: timeLeft > 0 ? '#f0f9ff' : '#fef2f2', padding: '12px', borderRadius: '8px', marginBottom: '24px', border: `1px solid ${timeLeft > 0 ? '#bae6fd' : '#fecaca'}` }}>
                    {timeLeft > 0 ? (
                        <>
                            <span style={{ fontSize: '14px', color: '#0369a1', display: 'block', fontWeight: '600' }}>Payment Time Remaining</span>
                            <span style={{ fontSize: '24px', color: '#0369a1', fontWeight: '800', fontFamily: 'monospace' }}>{formatTime(timeLeft)}</span>
                        </>
                    ) : (
                        <p style={{ color: '#b91c1c', fontWeight: 'bold', margin: 0, fontSize: '14px' }}>
                            Time expired. This booking will be automatically cancelled.
                        </p>
                    )}
                </div>

                <div className="amount-display" style={{ padding: '20px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--dark)' }}>Total</span>
                    <strong style={{ fontSize: '24px', color: 'var(--primary)', fontWeight: '800' }}>₹{parseFloat(amount).toFixed(2)}</strong>
                </div>

                <button
                    className="airbnb-btn"
                    onClick={handlePayment}
                    disabled={processing || !orderDetails || timeLeft === 0}
                    style={{ width: '100%', padding: '16px', fontSize: '16px', opacity: (processing || !orderDetails || timeLeft === 0) ? 0.6 : 1 }}
                >
                    {processing ? "Loading Payment Securely..." : (!orderDetails ? "Initializing Order..." : (timeLeft === 0 ? "Expired" : "Checkout with Razorpay"))}
                </button>
                
                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--grey)' }}>
                    Don't want to pay now? You can safely close this page. A secure payment link has been sent to your email valid for 30 minutes!
                </p>
            </div>
        </div>
    );
};

export default PaymentPage;