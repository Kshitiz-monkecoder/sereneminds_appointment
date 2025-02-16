import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the state type
interface AppointmentState {
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:MM
  service: string;
  clientId: string;
  professionalId: string;
  fees: number;
  duration: number; // Duration in minutes
}

// Initial state
const initialState: AppointmentState = {
  date: "",
  time: "",
  service: "",
  clientId: "",
  professionalId: "",
  fees: 0,
  duration: 0,
};


// Create slice
const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    setDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
      console.log("date :", action.payload)
    },
    setTime: (state, action: PayloadAction<string>) => {
      state.time = action.payload;
      console.log("time :", action.payload)
    },
    setService: (state, action: PayloadAction<string>) => {
      state.service = action.payload;
      console.log("Service :", action.payload)
    },
    setClientId: (state, action: PayloadAction<string>) => {
      state.clientId = action.payload;
      console.log("clientId :", action.payload)
    },
    setProfessionalId: (state, action: PayloadAction<string>) => {
      state.professionalId = action.payload;
      console.log("professional id: ", action.payload)
    },
    setFees: (state, action: PayloadAction<number>) => {
      state.fees = action.payload;
      console.log("fees :", action.payload)
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
      console.log("Duration :", action.payload)
    },
    resetAppointment: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setDate,
  setTime,
  setService,
  setClientId,
  setProfessionalId,
  setFees,
  setDuration,
  resetAppointment,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
