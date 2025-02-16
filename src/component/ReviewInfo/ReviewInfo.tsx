import { UserButton } from '../UserButton/UserButton';
import { Divider, Group, Paper, PaperProps, Text, Container, Center } from '@mantine/core';
// import { ButtonProgress } from './ButtonProgress';
import { SwitchesCard } from './SwitchesCard';

export function ReviewInfo(props: PaperProps) {
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

          {/* Centered 'Contact Information' */}
          <Center>
            <Text size="xl" fw={500}>
              Review appointment details
            </Text>
          </Center>

          <Divider my="lg" />

          <SwitchesCard />

          {/* Centered GoogleButton
          <Group grow mb="md" mt="md">
            <ButtonProgress />
          </Group> */}
        </Paper>
      </Center>
    </Container>
  );
}