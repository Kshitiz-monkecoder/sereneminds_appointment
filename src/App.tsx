import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { theme } from "./theme";
import { AuthenticationForm } from "./component/AuthenticationForm/AuthenticationForm";
import { Services } from "./component/Servicesoff/Services";
import { Calendar } from "./component/Calendar/Calendar";
import { Contact } from "./component/Contactinfo/Contact";
import { ReviewInfo } from "./component/ReviewInfo/ReviewInfo";
import { ServerError } from "./component/ServerError/ServerError"; 
import { AppointmentSuccess } from "./component/appointmentsuccess/AppointmentSuccess";
import ProfessionalDetails from "./component/ProfessionalDetails";
import PaymentComponent from "./component/Payment/Payment";
import Hello from "./Hello";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Router>
        <Routes>
          {/* Define routes for each page */}
          <Route path="/" element={<Hello />} />
          <Route path="/:id" element={<AuthenticationForm  />} />
          <Route path="/services/:id" element={<Services />} />
          <Route path="/calender/:id" element={<Calendar />} />
          <Route path="/contact/:id" element={<Contact />} />
          <Route path="/review/:id" element={<ReviewInfo />} />
          <Route path="/appointmentdetails/:id" element={<ReviewInfo />} />
          <Route path="/appointmentsuccess/:id" element={<AppointmentSuccess />} />
          <Route path="/servererror/:id" element={<ServerError />} />
          <Route path="/professional/:id" element={<ProfessionalDetails />} />
          <Route path="/payment/process" element={<PaymentComponent />} />

        </Routes>
      </Router>
    </MantineProvider>
  );
}
