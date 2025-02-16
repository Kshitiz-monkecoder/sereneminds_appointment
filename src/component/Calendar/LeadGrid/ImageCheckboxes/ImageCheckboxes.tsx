import { Text, UnstyledButton } from '@mantine/core';
import classes from './ImageCheckboxes.module.css';

interface ServiceData {
  name: string;
  description: string;
  duration: string;
  price: string;
  image?: string;
}

interface ServiceCardProps {
  selected?: boolean;
  onChange?: (selected: boolean) => void;
  service: ServiceData;
}

export function ServiceCard({ selected, onChange, service }: ServiceCardProps) {
  return (
    <UnstyledButton
      className={classes.button}
      onClick={() => onChange && onChange(!selected)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '13px',
        borderRadius: '8px',
        border: selected ? '2px solid #228BE6' : '1px solid #ddd',
        marginBottom: '15px',
        backgroundColor: selected ? '#E8F0FE' : '#fff',
        cursor: 'pointer',
        width: '100%',
      }}
    >
      {/* Top Row: Title (left) and Price (right) */}
      <div className={classes.row}>
        <Text size="sm" fw={500} className={classes.left}>
          {service.name}
        </Text>
        <Text size="sm" fw={500} className={classes.right}>
          {service.price}
        </Text>
      </div>

      {/* Bottom Row: Description (left) and Duration (right) */}
      <div className={classes.row}>
        <Text size="xs" color="dimmed" className={classes.left}>
          {service.description}
        </Text>
        <Text size="xs" color="dimmed" className={classes.right}>
          {service.duration}
        </Text>
      </div>
    </UnstyledButton>
  );
}
