import { UserButton } from "../UserButton/UserButton";
import {
  Divider,
  Group,
  Paper,
  PaperProps,
  Text,
  Container,
  Center,
} from "@mantine/core";
import { ContinueButton } from "./GoogleButton";
import { ServiceCard } from "./ImageCheckboxes/ImageCheckboxes";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfessional } from "../../store/slices/professionalSlice"; // Adjust path
import { RootState, AppDispatch } from "../../store/store";
import { setService, setFees, setDuration } from "../../store/slices/appointmentSlice";

// Define the type for the service
interface Service {
  price: number;
  duration: string;
  serviceTitle: string;
  serviceDescription: string;
}

export function Services(props: PaperProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  const { data: professional, status, error } = useSelector(
    (state: RootState) => state.professional
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProfessional(id));
    }
  }, [dispatch, id]);

  const handleServiceSelection = (serviceTitle: string) => {
    setSelectedService((prev) => (prev === serviceTitle ? null : serviceTitle));
  };

  const handleContinue = () => {
    if (selectedService) {
      const selectedServiceDetails = servicesData.find(service => service.serviceTitle === selectedService);
      
      if (selectedServiceDetails) {
        dispatch(setService(selectedServiceDetails.serviceTitle));
        dispatch(setFees(selectedServiceDetails.price));
        dispatch(setDuration(Number(selectedServiceDetails.duration)));  // Ensure duration is a number
      }
      
      navigate(`/calender/${id}`);
    } else {
      alert("Please select a service before continuing.");
    }
  };

  // Extract services data
  const servicesData: Service[] = professional?.services || [];
  console.log(servicesData)
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
              Select a service
            </Text>
          </Center>

          <Divider my="lg" />

          {status === "loading" ? (
            <Text>Loading services...</Text>
          ) : status === "failed" ? (
            <Text>Error: {error}</Text>
          ) : servicesData.length > 0 ? (
            servicesData.map((service) => (
              <ServiceCard
                key={service.serviceTitle}
                service={{
                  name: service.serviceTitle, // Map to expected prop
                  description: service.serviceDescription, // Map to expected prop
                  price: service.price,
                  duration: service.duration,
                }}
                selected={selectedService === service.serviceTitle}
                onChange={() => handleServiceSelection(service.serviceTitle)}
              />
            ))
          ) : (
            <Text>No services available.</Text>
          )}

          <Divider my="lg" />

          <Group grow mb="md" mt="md">
            <ContinueButton radius="xl" onClick={handleContinue}>
              Continue
            </ContinueButton>
          </Group>
          <Group grow mb="md" mt="md">
            <ContinueButton radius="xl" onClick={() => navigate(-1)}>
              Back
            </ContinueButton>
          </Group>
        </Paper>
      </Center>
    </Container>
  );
}
