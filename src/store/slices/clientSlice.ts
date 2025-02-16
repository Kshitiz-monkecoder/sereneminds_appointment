import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the state type
interface ClientState {
  clientId: string;
  name: string;
  email: string;
  phone: string;
  description?: string; // Optional field
}

// Initial state
const initialState: ClientState = {
  clientId: "",
  name: "",
  email: "",
  phone: "",
  description: "",
};

// Create slice
const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setClientId: (state, action: PayloadAction<string>) => {
      state.clientId = action.payload;
      console.log(action.payload)
    },
    setClientName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setClientEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setClientPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
      console.log(action.payload)
    },
    setClientDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
      console.log(action.payload)
    },
    resetClient: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setClientId,
  setClientName,
  setClientEmail,
  setClientPhone,
  setClientDescription,
  resetClient,
} = clientSlice.actions;

export default clientSlice.reducer;
