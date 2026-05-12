import { useEffect, useState } from "react";
import { deleteBookingById, getUserBookings } from "../services/api";
import popup, { showLoading } from "../utils/notifications";
import "../styles/bookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await getUserBookings(user.id);
      setBookings(data);
    } catch (error) {
      popup.fire({
        icon: "error",
        title: "Bookings Unavailable",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (bookingId) => {
    const confirmDelete = await popup.fire({
      icon: "warning",
      title: "Cancel Booking?",
      text: "This booking will be removed from your bookings.",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "Keep Booking",
    });

    if (!confirmDelete.isConfirmed) {
      return;
    }

    showLoading("Cancelling Booking", "Please wait while we update your bookings.");

    try {
      const result = await deleteBookingById(bookingId);

      await popup.fire({
        icon: "success",
        title: "Booking Cancelled",
        text: result.message || "Your booking has been cancelled successfully.",
      });

      fetchMyBookings();
    } catch (error) {
      popup.fire({
        icon: "error",
        title: "Cancel Failed",
        text: error.message,
      });
    }
  };

  if (!user) {
    return (
      <div className="bookings-container">
        <h2>My Bookings</h2>
        <h3>Please login to view your bookings</h3>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <h2>My Bookings</h2>

      {loading ? (
        <h3>Loading bookings...</h3>
      ) : bookings.length === 0 ? (
        <h3>No bookings found</h3>
      ) : (
        bookings.map((booking) => (
          <div className="booking-card" key={booking.id}>
            <p>Service Name: {booking.service_name}</p>
            <p>Phone: {booking.phone}</p>
            <p>Date: {booking.booking_date}</p>
            <p>Time: {booking.booking_time}</p>
            <p>Status: {booking.status}</p>

            <button type="button" onClick={() => deleteBooking(booking.id)}>
              Cancel/Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default MyBookings;
