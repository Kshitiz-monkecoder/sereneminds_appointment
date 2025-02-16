import { UserButton } from "../UserButton/UserButton";
import {
  Divider,
  Group,
  Paper,
  PaperProps,
  Text,
  Container,
  Center,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ContinueButton } from "./GoogleButton";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProfessional } from "../../store/slices/professionalSlice"; // Adjust path
import { setClientPhone, setClientDescription } from "../../store/slices/clientSlice"; // Import actions
import { useParams } from 'react-router-dom';

export function Contact(props: PaperProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  
    useEffect(() => {
      if (id) {
        dispatch(fetchProfessional(id));
      }
    }, [dispatch, id]);

  // Initialize the form
  const form = useForm({
    initialValues: {
      phone: "",
      message: "",
    },
    validate: {
      phone: (value) =>
        /^\d{10}$/.test(value) ? null : "Please enter a valid 10-digit phone number",
    },
  });

  const handleContinue = () => {
    if (!form.isValid()) return;

    const { phone, message } = form.values;

    // Dispatch values to Redux
    dispatch(setClientPhone(phone));
    dispatch(setClientDescription(message));

    navigate(`/review/${id}`); // Navigate on success
  };

  return (
    <Container h="90vh">
      <Center h="120%">
        <Paper
          radius="md"
          p="md"
          withBorder
          {...props}
          style={{
            minWidth: 300,
            maxWidth: 600,
            width: "100%",
          }}
        >
          <Center>
            <UserButton />
          </Center>

          <Center>
            <Text size="xl" fw={500}>
              Contact Information
            </Text>
          </Center>

          <Divider my="lg" />

          <form onSubmit={form.onSubmit(() => handleContinue())}>
            <TextInput
              required
              variant="filled"
              label="WhatsApp Phone Number"
              placeholder="Enter your 10-digit WhatsApp phone number"
              {...form.getInputProps("phone")}
              mb="md"
            />

            <Textarea
              label="Message (Optional)"
              variant="filled"
              placeholder="Add any additional notes"
              {...form.getInputProps("message")}
              minRows={4}
              mb="lg"
            />

            <Divider my="lg" />

            <Group grow mb="md" mt="md">
              <ContinueButton radius="xl" type="submit">
                Continue
              </ContinueButton>
            </Group>
          </form>
        </Paper>
      </Center>
    </Container>
  );
}