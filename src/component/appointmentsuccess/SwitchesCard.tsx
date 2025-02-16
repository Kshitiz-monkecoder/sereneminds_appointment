import { Card, Group, Text } from '@mantine/core';
import classes from './SwitchesCard.module.css';

const data = [
  { title: 'Psychotherapy Session', description: 'A one-on-one session for emotional and mental health support.' },
  {title: '15 Feb 2025', description: 'Duration: 50 minutes' },
  { title: '₹1,500', description: '2.1% of the fee will be charged by payment service provider' },
  {
    title: '+918957276641',
    description: 'Message: Hi, My name is Anshuman Mishra, for past few days I feel like I have been suffering from depression.',
  },
];

export function SwitchesCard() {
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
      <Text fz="lg" className={classes.title} fw={500}>
        Appointment summary
      </Text>
      <Text fz="xs" c="dimmed" mt={3} mb="xl">
        Your fee has been paid.
      </Text>
      {items}
    </Card>
  );
}
