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
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProfessional } from '../../store/slices/professionalSlice'; // Adjust path
import { setClientName, setClientEmail } from '../../store/slices/clientSlice';
import { setClientId } from '../../store/slices/appointmentSlice';
import { useParams } from 'react-router-dom';
import type { AppDispatch } from '../../store/store';

export function AuthenticationForm(props: PaperProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>(); // Ensure dispatch is properly typed
  const { id } = useParams();
  
  useEffect(() => {
    if (id) {
      dispatch(fetchProfessional(id)); // Now correctly typed
    }
  }, [dispatch, id]);
  

  const checkIfClientExists = async (email: string) => {
    try {
      const response = await fetch(`https://serene-minds-backend.vercel.app/api/clients2/email/${email}`);
      if (!response.ok) {
        throw new Error('Failed to check client existence');
      }
      const data = await response.json();
      return data; // Assuming the backend returns the client data if exists
    } catch (err) {
      console.error('Error checking client existence:', err);
      return null;
    }
  };

  const createClient = async (name: string, email: string) => {
    try {
      const response = await fetch('https://serene-minds-backend.vercel.app/api/clients2/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        throw new Error('Failed to create client');
      }

      const data = await response.json();
      console.log("client :", data.id)
      return data.id; // Assuming the backend returns the client ID
    } catch (err) {
      console.error('Error creating client:', err);
      return null;
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    const decodedToken: any = jwtDecode(response.credential);
    console.log('User Info:', decodedToken);
  
    const { name, email } = decodedToken;
    const accessToken = response.credential; // The JWT token received
  
    console.log('Access Token:', accessToken); // Log the access token
  
    // Dispatch client details to Redux store
    dispatch(setClientName(name));
    dispatch(setClientEmail(email));
  
    // Check if client already exists
    const clientData = await checkIfClientExists(email);
  
    if (clientData) {
      console.log('Client already exists');
      dispatch(setClientId(clientData.id));
    } else {
      console.log('Creating new client');
      const clientId = await createClient(name, email);
      if (clientId) {
        dispatch(setClientId(clientId));
      }
    }
  
    // Navigate to the services page
    navigate(`/services/${id}`);
  };
  

  const handleGoogleFailure = () => {
    console.log('Google login failed');
  };

  return (
    <GoogleOAuthProvider clientId="377310889998-8f647bntlnk6u0d7m1665ci6lkm7f7em.apps.googleusercontent.com">
      <Container h="90vh">
        <Center h="100%">
          <Paper radius="md" p="xl" withBorder {...props} style={{ width: 500 }}>
            <Center>
              <UserButton />
            </Center>

            <Center>
              <Text size="xl" fw={500}>
                Book your appointment
              </Text>
            </Center>

            <Center>
              <Text size="sm" color="dimmed" mt="sm">
                Please sign in with Google to book your appointment.
              </Text>
            </Center>

            <Divider label="Login with Google" labelPosition="center" my="lg" />

            <Group justify="center" grow mb="md" mt="md">
              <Center mb="md" mt="md">
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
              </Center>
            </Group>

            <Center>
              <Text size="xs" color="dimmed" mt="sm">
                By signing in with Google, you accept our{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  Terms and Conditions
                </a>
                .
              </Text>
            </Center>
          </Paper>
        </Center>
      </Container>
    </GoogleOAuthProvider>
  );
}