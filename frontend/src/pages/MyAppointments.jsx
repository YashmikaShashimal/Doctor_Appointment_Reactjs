import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [authToken, setAuthToken] = useState(token || localStorage.getItem('token')); // Ensure token is consistently retrieved
  const months = [" ", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const initializePayHere = () => {
    let retryCount = 0;
    const maxRetries = 10;
    const retryInterval = setInterval(() => {
      if (window.payhere && typeof window.payhere.init === "function") {
        window.payhere.init(import.meta.env.VITE_PAYHERE_KEY_ID, "SANDBOX");
        console.log("PayHere SDK initialized successfully.");
        clearInterval(retryInterval);
      } else if (++retryCount >= maxRetries) {
        console.error("PayHere SDK failed to load after multiple attempts.");
        clearInterval(retryInterval);
        toast.error("Payment system is currently unavailable. Please try again later.");
      }
    }, 500);
  };

  useEffect(() => {
    initializePayHere();
    if (authToken) {
      getUserAppointments();
    } else {
      toast.error("Session expired. Please log in again.");
    }
  }, [authToken]);

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/my-appointments`, { headers: { token: authToken } });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error.response || error.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (!authToken) {
      toast.error("Session expired. Please log in again.");
      return;
    }
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId }, { headers: { token: authToken } });
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
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
    if (!window.payhere || typeof window.payhere.startPayment !== "function") {
      toast.error("Payment system is currently unavailable.");
      return;
    }
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/payment-payhere`, { appointmentId }, { headers: { token: authToken } });
      if (data.success) {
        const paymentDetails = data.paymentDetails;

        window.payhere.onCompleted = (orderId) => {
          toast.success(`Payment completed! Order ID: ${orderId}`);
          getUserAppointments();
        };

        window.payhere.onDismissed = () => {
          toast.info('Payment dismissed!');
        };

        window.payhere.onError = (error) => {
          toast.error(`Payment error: ${error}`);
        };

        window.payhere.startPayment(paymentDetails);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error initiating payment:", error.response || error.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (!appointments) {
    return <p>Loading appointments...</p>;
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
