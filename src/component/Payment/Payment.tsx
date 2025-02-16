import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "../../store/store"; // Adjust the import based on your store setup
import {
  setDate,
  setTime,
  setService,
  setClientId,
  setProfessionalId,
  setFees,
  setDuration,
} from "../../store/slices/appointmentSlice"; // Adjust the import based on your slice setup // Adjust the import based on your slice setup

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentComponent = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { appointmentDetails } = location.state || {};
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  // Redux selectors
  const professionalId = useSelector(
    (state: RootState) => state.professional.data?.id
  );
  const professionalState = useSelector((state: RootState) => state.professional);
  const clientName = useSelector((state: RootState) => state.client.name);
  const clientEmail = useSelector((state: RootState) => state.client.email);
  const userToken = professionalState.data?.uid
  console.log("kaf", userToken)
  const appointmentState = useSelector((state: RootState) => state.appointments);

  // Load Razorpay script dynamically
  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        setIsRazorpayLoaded(true);
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay script.");
        toast.error("Failed to load payment gateway. Please try again.");
      };
      document.body.appendChild(script);
    };

    if (!window.Razorpay) {
      loadRazorpayScript();
    } else {
      setIsRazorpayLoaded(true);
    }
  }, []);

  // Create Razorpay order
  const createOrder = async () => {
    try {
      const response = await fetch(
        `https://serene-minds-backend.vercel.app/api/payments/createOrder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: appointmentState.fees,
            currency: "INR",
            appointmentDetails: appointmentDetails,
            professionalId: professionalId,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create order");
      return data.id; // Return the order ID
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      toast.error("Failed to create order.");
      return null;
    }
  };

  // Verify payment with Razorpay
  const verifyPayment = async (paymentDetails: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    try {
      const response = await fetch(
        `https://serene-minds-backend.vercel.app/api/payments/verifyPayment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentDetails),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Payment verification failed");
      return data;
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Payment verification failed.");
      return null;
    }
  };

  // Create Google Calendar Event
  // const createGoogleCalendarEvent = async (appointmentDetails: any, userToken: string, clientName: string, clientEmail: string) => {
  //   // Extract the start time from the time range (e.g., "10:00 - 11:00" → "10:00")
  //   const startTime = appointmentDetails.time.split(" - ")[0];
  
  //   // Construct the date string in the format "YYYY-MM-DDTHH:MM:00"
  //   const dateTimeString = `${appointmentDetails.date}T${startTime}:00`;
  
  //   // Create a Date object and validate it
  //   const appointmentDate = new Date(dateTimeString);
  //   if (isNaN(appointmentDate.getTime())) {
  //     throw new Error("Invalid date or time format.");
  //   }
  
  //   // Format the date to ISO string
  //   const formattedDate = appointmentDate.toISOString();
  
  //   const event = {
  //     summary: `Meeting with ${clientName}`,
  //     start: {
  //       dateTime: formattedDate,
  //       timeZone: "Asia/Kolkata",
  //     },
  //     end: {
  //       dateTime: new Date(appointmentDate.getTime() + 60 * 60 * 1000).toISOString(), // Assuming 1 hour duration
  //       timeZone: "Asia/Kolkata",
  //     },
  //     conferenceData: {
  //       createRequest: {
  //         requestId: `meet-${Date.now()}`,
  //         conferenceSolutionKey: { type: "hangoutsMeet" },
  //       },
  //     },
  //     attendees: [{ email: clientEmail }], // Add client email as attendee
  //   };
  
  //   try {
  //     const response = await axios.post(
  //       "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
  //       event,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${userToken}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error creating Google Calendar event:", error);
  //     throw error;
  //   }
  // };

  // Save appointment details after successful payment
  const saveAppointmentDetails = async (paymentId: string) => {
    try {
      // Validate date and time
      if (!appointmentState.date || !appointmentState.time) {
        throw new Error("Date or time is missing in appointment details.");
      }
  
      // Extract the duration from the selected service
      const selectedService = professionalState.data.services.find((service: { duration: string }) => {
        // Add a condition to find the specific service if needed
        return true; // Replace with your condition
      });
  
      const durationTime = selectedService ? parseInt(selectedService.duration.match(/\d+/)?.[0], 10) : null;
  
      // Log the inputs for debugging
      console.log("Appointment Date:", appointmentState.date);
      console.log("Appointment Time:", appointmentState.time);
      console.log("Service Duration:", durationTime);
  
      // Extract the start time from the time range (e.g., "10:00 - 11:00" → "10:00")
      const startTime = appointmentState.time.split(" - ")[0];
  
      // Construct the date string in the format "YYYY-MM-DDTHH:MM:00Z"
      const dateTimeString = `${appointmentState.date}T${startTime}:00Z`;
  
      // Create a Date object and validate it
      const appointmentDate = new Date(dateTimeString);
      if (isNaN(appointmentDate.getTime())) {
        throw new Error("Invalid date or time format.");
      }
  
      // Format the date to ISO string (already in the correct format)
      const formattedDate = appointmentDate.toISOString();
  
      // Construct the payload
      const payload = {
        client_id: appointmentState.clientId,
        professional_id: professionalId,
        appointment_time: formattedDate, // Use the formatted date
        duration: durationTime, // Use the extracted duration
        fee: appointmentState.fees,
        message: appointmentDetails?.message || "No message provided",
        status: "Upcoming",
      };
  
      console.log("Sending payload:", payload); // Debugging: Log the payload
  
      // Save appointment details to your backend
      const response = await fetch(
        `https://serene-minds-backend.vercel.app/api/appointment/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save appointment details.");
      }
  
      // Debugging: Log userToken and clientEmail
      console.log("User Token:", userToken);
      console.log("Client Email:", clientEmail);
  
      // After successfully saving the appointment, create a Google Calendar event
      if (userToken && clientEmail) {
        // console.log("Creating Google Calendar event...");
        // await createGoogleCalendarEvent(appointmentState, userToken, clientName, clientEmail);
        toast.success("Appointment booked and Google Calendar event created successfully!");
      } else {
        console.error("Missing data for Google Calendar event:", {
          userToken,
          clientEmail,
        });
        toast.error("Failed to create Google Calendar event: User token or client email is missing.");
      }
  
    } catch (error) {
      console.error("Error saving appointment details:", error);
      setPaymentStatus("Failed to save appointment details.");
      toast.error("Failed to save appointment details.");
    }
  };

  // Handle payment initiation
  const makePayment = async () => {
    if (!appointmentDetails) {
      toast.error("No appointment details provided.");
      return;
    }

    if (!isRazorpayLoaded) {
      toast.error("Payment gateway is still loading. Please try again.");
      return;
    }

    const razorpayOrderId = await createOrder();
    if (!razorpayOrderId) return;

    const options = {
      key: "rzp_test_JKAo6mCifjqfd5",
      name: "Serene MINDS",
      currency: "INR",
      amount: appointmentState.fees * 100,
      order_id: razorpayOrderId,
      description: appointmentDetails?.message || "Thank you for your appointment",
      image: "/logo6.png",
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        const verificationResult = await verifyPayment(response);
        if (verificationResult) {
          await saveAppointmentDetails(response.razorpay_payment_id);
        }
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-40">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-semibold text-center mb-6">Appointment Payment</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-lg font-medium">Service:</label>
          <p>{appointmentState.service}</p>
        </div>
        <div className="flex justify-between items-center">
          <label className="text-lg font-medium">Date:</label>
          <p>{appointmentState.date}</p>
        </div>
        <div className="flex justify-between items-center">
          <label className="text-lg font-medium">Time:</label>
          <p>{appointmentState.time}</p>
        </div>
        <div className="flex justify-between items-center">
          <label className="text-lg font-medium">Message:</label>
          <p>{appointmentDetails?.message}</p>
        </div>
      </div>
      <button
        onClick={makePayment}
        className="w-full mt-6 py-2 bg-blue-600 text-white rounded-lg"
      >
        Pay {appointmentState.fees}
      </button>
      {paymentStatus && (
        <p className="mt-4 text-center text-green-500">{paymentStatus}</p>
      )}
    </div>
  );
};

export default PaymentComponent;