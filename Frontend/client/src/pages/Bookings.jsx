import { useEffect, useState } from "react";
import {
  deleteBookingById,
  getBookings,
  updateBookingStatus,
} from "../services/api";
import popup, { showLoading } from "../utils/notifications";
import "../styles/bookings.css";

function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      popup.fire({
        icon: "error",
        title: "Bookings Unavailable",
        text: error.message,
      });
    }
  };

  const updateStatus = async (bookingId, status) => {
    showLoading("Updating Booking", "Please wait while the status is saved.");

    try {
      await updateBookingStatus(bookingId, status);

      await popup.fire({
        icon: "success",
        title: "Status Updated",
        text: "Booking status updated successfully.",
      });

      fetchBookings();
    } catch (error) {
      popup.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message,
      });
    }
  };

  const deleteBooking = async (bookingId) => {
    const confirmDelete = await popup.fire({
      icon: "warning",
      title: "Delete Booking?",
      text: "This booking will be permanently removed.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirmDelete.isConfirmed) {
      return;
    }

    showLoading("Deleting Booking", "Please wait while the booking is removed.");

    try {
      const result = await deleteBookingById(bookingId);

      await popup.fire({
        icon: "success",
        title: "Booking Deleted",
        text: result.message || "Booking deleted successfully.",
      });

      fetchBookings();
    } catch (error) {
      popup.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.message,
      });
    }
  };

  return (
    <div className="bookings-container">
      <h2>All Bookings</h2>

      {bookings.map((booking) => (
        <div className="booking-card" key={booking.id}>
          <p>User Name: {booking.user_name}</p>
          <p>Phone: {booking.phone}</p>
          <p>Service Name: {booking.service_name}</p>
          <p>Date: {booking.booking_date}</p>
          <p>Time: {booking.booking_time}</p>
          <p>Status: {booking.status}</p>

          <button onClick={() => updateStatus(booking.id, "Accepted")}>
            Accept
          </button>

          <button onClick={() => updateStatus(booking.id, "Completed")}>
            Complete
          </button>

          <button onClick={() => updateStatus(booking.id, "Cancelled")}>
            Cancel
          </button>

          <button onClick={() => deleteBooking(booking.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Bookings;
