import { Card, Group, Text } from '@mantine/core';
import classes from './SwitchesCard.module.css';
import { useSelector } from 'react-redux';
import { Divider } from '@mantine/core';
import { RootState } from '../../store/store'; // Adjust the import according to your store setup
import { useNavigate } from 'react-router-dom';
import { ButtonProgress } from './ButtonProgress'; // Import the ButtonProgress component
import { useParams } from 'react-router-dom';
import { useState } from 'react';

export function SwitchesCard() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  // Fetch data from the Redux store
  const clientState = useSelector((state: RootState) => state.client);
  const appointmentState = useSelector((state: RootState) => state.appointments);
  const { id } = useParams();

  // Map the Redux state to the data structure expected by the component
  const data = [
    { title: appointmentState.service, description: 'A one-on-one session for emotional and mental health support.' },
    { title: appointmentState.date, description: `Duration: ${appointmentState.duration} minutes` },
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

  const handleSubmit = async () => {
    if (appointmentState.clientId) {
      // Parse the date and time into a Date object
      const [year, month, day] = appointmentState.date.split("-");
      const [startTime, endTime] = appointmentState.time.split(" - ");
      const [hour, minute] = startTime.split(":");

      // Create a new Date object with adjusted time
      const appointmentDate = new Date(year, month - 1, day, hour, minute);

      // Format the new date in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)
      const appointmentTime = appointmentDate.toISOString();

      const appointmentDetails = {
        client_id: appointmentState.clientId,
        professional_id: id,
        appointment_time: appointmentTime,
        duration: appointmentState.duration,
        fee: appointmentState.fees,
        message: `Hi, My name is ${clientState.name}, ${clientState.description}`,
        status: "Upcoming",
      };

      navigate("/payment/process", { state: { appointmentDetails } });
    } else {
      setError('Client ID is missing. Please ensure your details are complete.');
    }
  };

  return (
    <Card withBorder radius="md" p="xl" className={classes.card}>
      <Text fz="lg" className={classes.title} fw={500}>
        Appointment summary
      </Text>
      <Text fz="xs" c="dimmed" mt={3} mb="xl">
        Please review all the details before paying fee.
      </Text>
      {items}

      <Divider my="lg" />
      {/* Replace the Button with ButtonProgress */}
      <ButtonProgress onComplete={handleSubmit} />
      {error && <Text color="red">{error}</Text>}
    </Card>
  );
}