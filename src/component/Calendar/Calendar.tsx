import { UserButton } from '../UserButton/UserButton';
import {
  Divider,
  Group,
  Paper,
  PaperProps,
  Text,
  Container,
  Center,
} from '@mantine/core';
import { ContinueButton } from './GoogleButton';
import { LeadGrid } from './LeadGrid/LeadGrid';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export function Calendar(props: PaperProps) {
  const navigate = useNavigate(); // Initialize navigation function
  const { id } = useParams(); // Get professional ID from URL params

  const handleContinue = () => {
    navigate(`/contact/${id}`); // Navigate to /contact
  };

  return (
    <Container h="90vh">
      <Center h="120%">
        {/* Paper component */}
        <Paper
          radius="md"
          p="md"
          withBorder
          {...props}
          style={{
            maxWidth: 600, // Maximum width for desktop
            width: '100%', // Responsive width
          }}
          
        >
          <Center>
            <UserButton />
          </Center>

          {/* Centered 'Select date and time' */}
          <Center>
            <Text size="xl" fw={500}>
              Select date and time
            </Text>
          </Center>

          <Divider my="lg" />

          {/* Place the LeadGrid inside the Paper */}
          <LeadGrid />

          <Divider my="lg" />

          {/* Centered ContinueButton */}
          <Group grow mb="md" mt="md">
            <ContinueButton radius="xl" onClick={handleContinue}>
              Continue
            </ContinueButton>
          </Group>
        </Paper>
      </Center>
    </Container>
  );
}
