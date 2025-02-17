import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "../../store/store"; // Adjust the import based on your store setup
import { Card, Text, Button, Group, Loader, Container, Title, Paper } from '@mantine/core';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentComponent = () => {
  const location = useLocation();
  const { appointmentDetails } = location.state || {};
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redux selectors
  const professionalId = useSelector(
    (state: RootState) => state.professional.data?.id
  );
  const professionalState = useSelector((state: RootState) => state.professional);
  const clientEmail = useSelector((state: RootState) => state.client.email);
  const userToken = professionalState.data?.uid;
  const appointmentState = useSelector((state: RootState) => state.appointments);

  // Load Razorpay script dynamically
  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        setIsRazorpayLoaded(true);
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay script.");
        toast.error("Failed to load payment gateway. Please try again.");
      };
      document.body.appendChild(script);
    };

    if (!window.Razorpay) {
      loadRazorpayScript();
    } else {
      setIsRazorpayLoaded(true);
    }
  }, []);

  // Create Razorpay order
  const createOrder = async () => {
    try {
      const response = await fetch(
        `https://serene-minds-backend.vercel.app/api/payments/createOrder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: appointmentState.fees,
            currency: "INR",
            appointmentDetails: appointmentDetails,
            professionalId: professionalId,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create order");
      return data.id; // Return the order ID
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      toast.error("Failed to create order.");
      return null;
    }
  };

  // Verify payment with Razorpay
  const verifyPayment = async (paymentDetails: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    try {
      const response = await fetch(
        `https://serene-minds-backend.vercel.app/api/payments/verifyPayment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentDetails),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Payment verification failed");
      return data;
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Payment verification failed.");
      return null;
    }
  };

  // Save appointment details after successful payment
  const saveAppointmentDetails = async () => {
    try {
      // Validate date and time
      if (!appointmentState.date || !appointmentState.time) {
        throw new Error("Date or time is missing in appointment details.");
      }

      // Extract the duration from the selected service
      const selectedService = professionalState.data.services.find((_service: { duration: string }) => {
        return true; // Replace with your condition
      });

      const durationTime = selectedService ? parseInt(selectedService.duration.match(/\d+/)?.[0], 10) : null;

      // Extract the start time from the time range (e.g., "10:00 - 11:00" → "10:00")
      const startTime = appointmentState.time.split(" - ")[0];

      // Construct the date string in the format "YYYY-MM-DDTHH:MM:00Z"
      const dateTimeString = `${appointmentState.date}T${startTime}:00Z`;

      // Create a Date object and validate it
      const appointmentDate = new Date(dateTimeString);
      if (isNaN(appointmentDate.getTime())) {
        throw new Error("Invalid date or time format.");
      }

      // Format the date to ISO string (already in the correct format)
      const formattedDate = appointmentDate.toISOString();

      // Construct the payload
      const payload = {
        client_id: appointmentState.clientId,
        professional_id: professionalId,
        appointment_time: formattedDate, // Use the formatted date
        duration: durationTime, // Use the extracted duration
        fee: appointmentState.fees,
        message: appointmentDetails?.message || "No message provided",
        status: "Upcoming",
      };

      // Save appointment details to your backend
      const response = await fetch(
        `https://serene-minds-backend.vercel.app/api/appointment/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save appointment details.");
      }

      // After successfully saving the appointment, create a Google Calendar event
      if (userToken && clientEmail) {
        toast.success("Appointment booked and Google Calendar event created successfully!");
      } else {
        console.error("Missing data for Google Calendar event:", {
          userToken,
          clientEmail,
        });
        toast.error("Failed to create Google Calendar event: User token or client email is missing.");
      }

    } catch (error) {
      console.error("Error saving appointment details:", error);
      setPaymentStatus("Failed to save appointment details.");
      toast.error("Failed to save appointment details.");
    }
  };

  // Handle payment initiation
  const makePayment = async () => {
    if (!appointmentDetails) {
      toast.error("No appointment details provided.");
      return;
    }

    if (!isRazorpayLoaded) {
      toast.error("Payment gateway is still loading. Please try again.");
      return;
    }

    setIsLoading(true);
    const razorpayOrderId = await createOrder();
    if (!razorpayOrderId) {
      setIsLoading(false);
      return;
    }

    const options = {
      key: "rzp_test_JKAo6mCifjqfd5",
      name: "Serene MINDS",
      currency: "INR",
      amount: appointmentState.fees * 100,
      order_id: razorpayOrderId,
      description: appointmentDetails?.message || "Thank you for your appointment",
      image: "/logo6.png",
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        const verificationResult = await verifyPayment(response);
        if (verificationResult) {
          await saveAppointmentDetails();
        }
        setIsLoading(false);
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <Container size="sm" py="xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Card shadow="lg" padding="xl" radius="lg" withBorder style={{ width: '100%', maxWidth: '500px' }}>
        <Title order={2} ta="center" mb="lg" fw={600} style={{ color: '#4a4a4a' }}>
          Appointment Payment
        </Title>
        <Paper p="md" shadow="sm" radius="md" style={{ backgroundColor: '#f9fafb' }}>
          <Group justify="space-between" mb="sm">
            <Text size="lg" fw={500} style={{ color: '#333' }}>Service:</Text>
            <Text size="lg" style={{ color: '#555' }}>{appointmentState.service}</Text>
          </Group>
          <Group justify="space-between" mb="sm">
            <Text size="lg" fw={500} style={{ color: '#333' }}>Date:</Text>
            <Text size="lg" style={{ color: '#555' }}>{appointmentState.date}</Text>
          </Group>
          <Group justify="space-between" mb="sm">
            <Text size="lg" fw={500} style={{ color: '#333' }}>Time:</Text>
            <Text size="lg" style={{ color: '#555' }}>{appointmentState.time}</Text>
          </Group>
          <Group justify="space-between" mb="sm">
            <Text size="lg" fw={500} style={{ color: '#333' }}>Message:</Text>
            <Text size="lg" style={{ color: '#555' }}>{appointmentDetails?.message}</Text>
          </Group>
        </Paper>
        <Button
          fullWidth
          mt="xl"
          size="lg"
          onClick={makePayment}
          disabled={isLoading}
          style={{ backgroundColor: '#4c6ef5', color: '#fff', fontWeight: 600 }}
        >
          {isLoading ? <Loader size="sm" color="#fff" /> : `Pay ₹${appointmentState.fees}`}
        </Button>
        {paymentStatus && (
          <Text c="green" ta="center" mt="md" style={{ fontWeight: 500 }}>
            {paymentStatus}
          </Text>
        )}
      </Card>
    </Container>
  );
};

export default PaymentComponent;