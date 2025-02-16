import { Text, UnstyledButton, Center } from '@mantine/core';
import classes from './ImageCheckboxes/ImageCheckboxes.module.css';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useDispatch } from "react-redux";
import { setTime } from "../../../store/slices/appointmentSlice"; // Adjust path as needed



interface TimeSlotSelectionProps {
  availability: { [key: string]: string };
  selectedDate: Date | null;
}

export function TimeSlotSelection({ availability, selectedDate }: TimeSlotSelectionProps) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const dispatch = useDispatch();
  const handleTimeSlotSelection = (timeSlot: string) => {
    setSelectedTimeSlot((prev) => (prev === timeSlot ? null : timeSlot));
    dispatch(setTime(timeSlot));
  };

  const getTimeSlots = () => {
    if (!selectedDate) {
      console.log('No date selected');
      return [];
    }

    const dayOfWeek = dayjs(selectedDate).format('dddd');
    console.log('Selected Day:', dayOfWeek);

    const availableHours = availability[dayOfWeek];
    console.log('Available Hours:', availableHours);

    if (!availableHours) {
      console.log('No availability for this day');
      return [];
    }

    const [start, end] = availableHours.split('-');
    const startHour = parseInt(start.split(':')[0], 10);
    const endHour = parseInt(end.split(':')[0], 10);

    const timeSlots: string[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
      timeSlots.push(`${hour}:00 - ${hour + 1}:00`);
    }

    console.log('Generated Time Slots:', timeSlots);
    return timeSlots;
  };

  const timeSlots = getTimeSlots();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
      }}
    >
      {timeSlots.map((timeSlot) => (
        <UnstyledButton
          key={timeSlot}
          className={classes.button}
          onClick={() => handleTimeSlotSelection(timeSlot)}
          style={{
            padding: '7px',
            borderRadius: '8px',
            border: selectedTimeSlot === timeSlot ? '2px solid #228BE6' : '1px solid #ddd',
            backgroundColor: selectedTimeSlot === timeSlot ? '#E8F0FE' : '#fff',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          <Center>
            <Text size="sm" fw={400} color={selectedTimeSlot === timeSlot ? 'blue' : 'black'}>
              {timeSlot}
            </Text>
          </Center>
        </UnstyledButton>
      ))}
    </div>
  );
}