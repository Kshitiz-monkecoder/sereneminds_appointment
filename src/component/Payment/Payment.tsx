import { Card, Text, Group, Button } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Divider } from '@mantine/core';
import classes from './PaymentPage.module.css'; // Assuming you have a CSS module for styling

export function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(''); // To track payment status
  const [error, setError] = useState('');

  // Retrieve appointment details passed from the SwitchesCard component
  const appointmentDetails = location.state?.appointmentDetails;

  const handlePayment = async () => {
    try {
      // Simulate a payment process (replace with actual payment API call)
      setPaymentStatus('Processing...');
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call delay

      // If payment is successful
      setPaymentStatus('Payment Successful!');
      setTimeout(() => {
        navigate('/confirmation'); // Navigate to a confirmation page
      }, 2000);
    } catch (err) {
      setPaymentStatus('Payment Failed');
      setError('An error occurred during payment. Please try again.');
    }
  };

  if (!appointmentDetails) {
    return (
      <Card withBorder radius="md" p="xl" className={classes.card}>
        <Text fz="lg" className={classes.title} fw={500}>
          Error
        </Text>
        <Text fz="sm" c="dimmed" mt={3}>
          No appointment details found. Please start the booking process again.
        </Text>
        <Button mt="md" onClick={() => navigate('/')}>
          Go Back
        </Button>
      </Card>
    );
  }

  return (
    <Card withBorder radius="md" p="xl" className={classes.card}>
      <Text fz="lg" className={classes.title} fw={500}>
        Payment Details
      </Text>
      <Text fz="xs" c="dimmed" mt={3} mb="xl">
        Please complete the payment to confirm your appointment.
      </Text>

      {/* Display appointment details */}
      <Group justify="space-between" className={classes.item} wrap="nowrap" gap="xl">
        <div>
          <Text>Service: {appointmentDetails.service}</Text>
          <Text size="xs" c="dimmed">
            {appointmentDetails.description}
          </Text>
        </div>
      </Group>

      <Group justify="space-between" className={classes.item} wrap="nowrap" gap="xl">
        <div>
          <Text>Date: {new Date(appointmentDetails.appointment_time).toLocaleDateString()}</Text>
          <Text size="xs" c="dimmed">
            Duration: {appointmentDetails.duration} minutes
          </Text>
        </div>
      </Group>

      <Group justify="space-between" className={classes.item} wrap="nowrap" gap="xl">
        <div>
          <Text>Fee: ₹{appointmentDetails.fee}</Text>
          <Text size="xs" c="dimmed">
            2.1% of the fee will be charged by the payment service provider.
          </Text>
        </div>
      </Group>

      <Divider my="lg" />

      {/* Payment button */}
      <Button fullWidth onClick={handlePayment} disabled={paymentStatus === 'Processing...'}>
        {paymentStatus || 'Pay Now'}
      </Button>

      {/* Display error message if payment fails */}
      {error && <Text color="red" mt="md">{error}</Text>}
    </Card>
  );
}