import { Container, Grid } from "@mantine/core"; 
import { Demo } from "./Cal";
import { TimeSlotSelection } from "./TimeSlotGrid";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store";
import { fetchProfessional } from "../../../store/slices/professionalSlice";
import { setDate, setTime } from "../../../store/slices/appointmentSlice"; // Import Redux actions

const PRIMARY_COL_HEIGHT = "300px";

export function LeadGrid() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { id } = useParams(); // Get professional ID from URL params
  const dispatch = useDispatch<AppDispatch>();

  // Fetch professional data from Redux store
  const { data: professional, status, error } = useSelector(
    (state: RootState) => state.professional
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProfessional(id));
    }
  }, [dispatch, id]);

  // Extract availability
  const availability = professional?.availability || {};

  // Function to handle date selection and store it in Redux
  const handleDateSelection = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
    dispatch(setDate(formattedDate));
  };

  // Function to handle time selection and store it in Redux
  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
    dispatch(setTime(time));
  };

  return (
    <Container my="md">
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 7 }}>
          <div
            style={{
              height: PRIMARY_COL_HEIGHT,
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              padding: "16px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {status === "loading" ? (
              <p>Loading availability...</p>
            ) : status === "failed" ? (
              <p>Error: {error}</p>
            ) : (
              <Demo availability={availability} onDateSelect={handleDateSelection} />
            )}
          </div>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <div
            style={{
              height: PRIMARY_COL_HEIGHT,
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              padding: "16px",
            }}
          >
            <TimeSlotSelection 
              availability={availability} 
              selectedDate={selectedDate} 
              onTimeSelect={handleTimeSelection} 
            />
          </div>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
