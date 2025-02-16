import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface ProfessionalState {
  data: any | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProfessionalState = {
  data: null,
  status: "idle",
  error: null,
};

// Async thunk to fetch professional data
export const fetchProfessional = createAsyncThunk(
  "professional/fetchProfessional",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://serene-minds-backend.vercel.app/api/professionals/${id}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const professionalSlice = createSlice({
  name: "professional",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfessional.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfessional.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchProfessional.rejected, (state, action: PayloadAction<any>) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default professionalSlice.reducer;
