import React, { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token')); // Initialize from localStorage
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState(null); // Track errors
  const months = [" ", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const payHereInitialized = useRef(false); // Track PayHere initialization

  // Synchronize authToken with token from context
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  const initializePayHere = () => {
    if (payHereInitialized.current) return;
    payHereInitialized.current = true;

    console.log("Initializing PayHere SDK...");

    const interval = setInterval(() => {
      if (window.payhere && typeof window.payhere.init === "function") {
        try {
          window.payhere.init(import.meta.env.VITE_PAYHERE_KEY_ID, "SANDBOX");
          console.log("PayHere SDK initialized successfully.");
          clearInterval(interval);
        } catch (error) {
          console.error("Error initializing PayHere SDK:", error);
          toast.error("Failed to initialize the payment system. Please try again later.");
          clearInterval(interval);
        }
      }
    }, 500);

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(interval);
      if (!window.payhere) {
        console.error("PayHere SDK failed to load.");
        toast.error("Payment system failed to load. Please check your network or try again later.");
      }
    }, 5000);
  };

  useEffect(() => {
    console.log("Fetching appointments...");
    if (!authToken) {
      toast.error("Session expired. Please log in again.");
      setLoading(false); // Stop loading if no token
      return;
    }

    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/my-appointments`, { headers: { token: authToken } });
        console.log("Appointments fetched:", data);
        if (data.success) {
          setAppointments(data.appointments.reverse());
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error.response || error.message);
        setError("Failed to load appointments. Please try again later.");
      } finally {
        setLoading(false); // Stop loading after fetching data
      }
    };

    initializePayHere(); // Initialize PayHere only once
    fetchAppointments();
  }, [authToken, backendUrl]);

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  const cancelAppointment = async (appointmentId) => {
    if (!authToken) {
      toast.error("Session expired. Please log in again.");
      return;
    }
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId }, { headers: { token: authToken } });
      console.log("Cancel appointment response:", data);
      if (data.success) {
        toast.success(data.message);
        setAppointments((prev) => prev.filter((item) => item._id !== appointmentId)); // Update state locally
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error canceling appointment:", error.response || error.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const appointmentPayHere = async (appointmentId) => {
    if (!authToken) {
      toast.error("Session expired. Please log in again.");
      return;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/initiate-payhere`,
        { appointmentId },
        { headers: { token: authToken } }
      );
      console.log("Initiate PayHere response:", data);
      if (data.success) {
        const paymentDetails = data.paymentDetails;

        // Ensure the currency is valid
        if (!paymentDetails.currency || paymentDetails.currency !== "USD") {
          console.error("Invalid currency parameter:", paymentDetails.currency);
          toast.error("Invalid currency parameter. Please contact support.");
          return;
        }

        console.log("Payment Details:", paymentDetails); // Debugging log

        // Ensure PayHere handlers are set up before starting the payment
        window.payhere.onCompleted = (orderId) => {
          console.log("Payment Completed:", orderId); // Debugging log
          toast.success(`Payment completed! Order ID: ${orderId}`);
          setAppointments((prev) =>
            prev.map((item) =>
              item._id === appointmentId ? { ...item, payment: true } : item
            )
          ); // Update state locally
        };

        window.payhere.onDismissed = () => {
          console.log("Payment Dismissed"); // Debugging log
          toast.info('Payment dismissed!');
        };

        window.payhere.onError = (error) => {
          console.error("Payment Error:", error); // Debugging log
          toast.error("Unable to initialize the payment at the moment.");
        };

        // Start the payment process
        console.log("Starting payment process..."); // Debugging log
        window.payhere.startPayment(paymentDetails);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error initiating payment:", error.response || error.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (loading) {
    return <p>Loading appointments...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (appointments.length === 0) {
    return <p>No appointments found.</p>;
  }

  return (
    <div>
      <p className="pb-3 mt-12 font-medium border-b text-zinc-700">My Appointments</p>
      <div>
        {appointments.map((item, index) => (
          <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b" key={index}>
            <div>
              <img className="w-32 bg-indigo-50" src={item.docData.image} alt="Doctor" />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="font-semibold text-neutral-800">{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className="mt-1 font-medium text-zinc-700">Address:</p>
              <p className="text-xs">{item.docData.address.line1}</p>
              <p className="text-xs">{item.docData.address.line2}</p>
              <p className="mt-1 text-xs">
                <span className="text-sm font-medium text-neutral-700">Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div className="flex flex-col justify-end gap-2">
              {!item.cancelled && (
                <>
                  <button
                    onClick={() => appointmentPayHere(item._id)}
                    className="py-2 text-sm text-center transition-all duration-300 border rounded text-stone-500 sm:min-w-48 hover:bg-primary hover:text-white"
                  >
                    Pay Online
                  </button>
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="py-2 text-sm text-center transition-all duration-300 border rounded text-stone-500 sm:min-w-48 hover:bg-red-600 hover:text-white"
                  >
                    Cancel Appointment
                  </button>
                </>
              )}
              {item.cancelled && (
                <button className="py-2 border border-red-500 rounded sm:min-w-48">Appointment Cancelled</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
