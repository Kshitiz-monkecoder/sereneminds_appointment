import { UserButton } from '../UserButton/UserButton';
import {
  Divider,
  Paper,
  PaperProps,
  Text,
  Container,
  Center,
  Group,
} from '@mantine/core';
import { SwitchesCard } from './SwitchesCard';

export function AppointmentSuccess(props: PaperProps) {
  return (
    <Container h="90vh">
      <Center h="120%">
        {/* Paper component with dynamic size */}
        <Paper
          radius="md"
          p="md"
          withBorder
          {...props}
          style={{
            minWidth: 300, // Minimum width to prevent it from becoming too narrow
            maxWidth: 600, // Maximum width to prevent it from becoming too wide
            width: '100%', // Allow it to grow responsively
          }}
        >
          <Center>
            <UserButton />
          </Center>

          {/* Centered 'Your appointment is scheduled' with an icon */}
          <Center>
            <Group > {/* Reduced spacing */}
              <Text size="xl" fw={500}>
                Your appointment is scheduled
              </Text>
            </Group>
          </Center>

          <Divider my="lg" />

          <SwitchesCard />

          <Divider my="lg" />

          {/* Centered Branding Text */}
          <Center>
            <Text size="xs" c="dimmed" fw={500}>
              Serene MINDS
            </Text>
          </Center>
        </Paper>
      </Center>
    </Container>
  );
}
