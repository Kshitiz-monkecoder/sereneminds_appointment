import { configureStore, combineReducers } from "@reduxjs/toolkit";
import appointmentsReducer from "./slices/appointmentSlice";
import professionalReducer from "./slices/professionalSlice";
import clientReducer from "./slices/clientSlice"; // Import the new client reducer

// Define RootState type for type safety
export type RootState = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
  appointments: appointmentsReducer,
  professional: professionalReducer,
  client: clientReducer, // Add client reducer
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
export type AppDispatch = typeof store.dispatch;
