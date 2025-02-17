import { useState } from 'react';
import { Calendar } from '@mantine/dates';
import '@mantine/dates/styles.css';
import dayjs from 'dayjs';

interface DemoProps {
  availability: { [key: string]: string };
  onDateSelect: (date: Date | null) => void;
}

export function Demo({ availability, onDateSelect }: DemoProps) {
  const [selected, setSelected] = useState<Date | null>(null);
  const today = new Date();

  const handleSelect = (date: Date) => {
    if (dayjs(date).isBefore(today, 'date')) return; // Prevent selecting past dates

    const isSelected = selected && dayjs(date).isSame(selected, 'date');
    if (isSelected) {
      setSelected(null);
      onDateSelect(null);
    } else {
      setSelected(date);
      onDateSelect(date);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <Calendar
        className="w-full h-full"
        getDayProps={(date) => {
          const isToday = dayjs(date).isSame(today, 'date');
          const isSelected = selected ? dayjs(date).isSame(selected, 'date') : false;

          return {
            selected: isSelected,
            onClick: () => handleSelect(date),
            disabled: dayjs(date).isBefore(today, 'date'), // Disable past dates
            style: {
              backgroundColor: isToday ? '#ffcc00' : isSelected ? '#4299e1' : 'transparent',
              color: isToday || isSelected ? '#000' : 'inherit',
              cursor: dayjs(date).isBefore(today, 'date') ? 'not-allowed' : 'pointer',
            },
          };
        }}
      />
    </div>
  );
}
