import { Card, Group, Text } from '@mantine/core';
import classes from './SwitchesCard.module.css';
import { useSelector } from 'react-redux';
import { Divider } from '@mantine/core';
import { RootState } from '../../store/store'; // Adjust the import according to your store setup
import { useNavigate } from 'react-router-dom';
import { ButtonProgress } from './ButtonProgress'; // Import the ButtonProgress component
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function SwitchesCard() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [isAppointmentBooked, setIsAppointmentBooked] = useState(false);

  // Fetch data from the Redux store
  const clientState = useSelector((state: RootState) => state.client);
  const appointmentState = useSelector((state: RootState) => state.appointments);
  const professionalState = useSelector((state: RootState) => state.professional);
  const { id } = useParams();

  // Load Razorpay script dynamically
  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        setIsRazorpayLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script.');
        toast.error('Failed to load payment gateway. Please try again.');
      };
      document.body.appendChild(script);
    };

    if (!window.Razorpay) {
      loadRazorpayScript(); // Ensure this function is called
    } else {
      setIsRazorpayLoaded(true);
    }
  }, []); // Empty dependency array ensures this runs only once

  // Create Razorpay order
  const createOrder = async () => {
    try {
      const response = await fetch(
        `https://serene-minds-backend.vercel.app/api/payments/createOrder`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: appointmentState.fees,
            currency: 'INR',
            appointmentDetails: appointmentState,
            professionalId: id,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create order');
      return data.id; // Return the order ID
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      toast.error('Failed to create order.');
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
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentDetails),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Payment verification failed');
      return data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Payment verification failed.');
      return null;
    }
  };

  // Save appointment details after successful payment
  const saveAppointmentDetails = async (paymentId: string) => {
    try {
      // Validate date and time
      if (!appointmentState.date || !appointmentState.time) {
        throw new Error('Date or time is missing in appointment details.');
      }

      // Extract the duration from the selected service
      const selectedService = professionalState.data.services.find(
        (service: { duration: string }) => true // Replace with your condition
      );
      const durationTime = selectedService ? parseInt(selectedService.duration.match(/\d+/)?.[0], 10) : null;

      // Extract the start time from the time range (e.g., "10:00 - 11:00" → "10:00")
      const startTime = appointmentState.time.split(' - ')[0];

      // Construct the date string in the format "YYYY-MM-DDTHH:MM:00Z"
      const dateTimeString = `${appointmentState.date}T${startTime}:00Z`;

      // Create a Date object and validate it
      const appointmentDate = new Date(dateTimeString);
      if (isNaN(appointmentDate.getTime())) {
        throw new Error('Invalid date or time format.');
      }

      // Format the date to ISO string
      const formattedDate = appointmentDate.toISOString();

      // Construct the payload
      const payload = {
        client_id: appointmentState.clientId,
        professional_id: id,
        appointment_time: formattedDate,
        duration: durationTime,
        fee: appointmentState.fees,
        message: `Hi, My name is ${clientState.name}, ${clientState.description}`,
        status: 'Upcoming',
      };

      // Save appointment details to your backend
      const response = await fetch(
        `https://serene-minds-backend.vercel.app/api/appointment/create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save appointment details.');
      }

      // Mark appointment as booked
      setIsAppointmentBooked(true);
      toast.success('Appointment booked successfully!');
    } catch (error) {
      console.error('Error saving appointment details:', error);
      toast.error('Failed to save appointment details.');
    }
  };

  // Handle payment initiation
  const handlePayment = async () => {
    if (!isRazorpayLoaded) {
      toast.error('Payment gateway is still loading. Please try again.');
      return;
    }

    const razorpayOrderId = await createOrder();
    if (!razorpayOrderId) return;

    const options = {
      key: 'rzp_test_JKAo6mCifjqfd5', // Replace with your Razorpay key
      amount: appointmentState.fees * 100,
      currency: 'INR',
      order_id: razorpayOrderId,
      name: 'Serene MINDS',
      description: 'Appointment Booking',
      image: '/logo6.png',
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        const verificationResult = await verifyPayment(response);
        if (verificationResult) {
          await saveAppointmentDetails(response.razorpay_payment_id);
        }
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  // Map the Redux state to the data structure expected by the component
  const data = [
    { title: appointmentState.service, description: 'A one-on-one session for emotional and mental health support.' },
    { title: `${appointmentState.date} ${appointmentState.time}`, description: `Duration: ${appointmentState.duration} minutes` },
    { title: `₹${appointmentState.fees}`, description: '2.1% of the fee will be charged by payment service provider' },
    {
      title: clientState.phone,
      description: `Message: Hi, My name is ${clientState.name}, ${clientState.description}`,
    },
  ];

  const items = data.map((item) => (
    <Group justify="space-between" className={classes.item} wrap="nowrap" gap="xl" key={item.title}>
      <div>
        <Text>{item.title}</Text>
        <Text size="xs" c="dimmed">
          {item.description}
        </Text>
      </div>
    </Group>
  ));

  return (
    <Card withBorder radius="md" p="xl" className={classes.card}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Text fz="lg" className={classes.title} fw={500}>
        Appointment summary
      </Text>
      <Text fz="xs" c="dimmed" mt={3} mb="xl">
        Please review all the details before paying fee.
      </Text>
      {items}

      <Divider my="lg" />
      <ButtonProgress
        onComplete={handlePayment}
        isAppointmentBooked={isAppointmentBooked}
      />
      {error && <Text color="red">{error}</Text>}
    </Card>
  );
}