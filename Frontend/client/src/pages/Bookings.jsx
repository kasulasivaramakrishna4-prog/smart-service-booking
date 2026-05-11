import { useEffect, useState } from "react";
import "../styles/bookings.css";

const BASE_URL = "https://smart-service-booking-pvje.onrender.com";

function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    fetch(`${BASE_URL}/bookings`)
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((error) => console.log("Bookings error:", error));
  };

  const updateStatus = async (bookingId, status) => {
    await fetch(`${BASE_URL}/bookings/${bookingId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: status,
      }),
    });

    alert("Status updated successfully");

    fetchBookings();
  };

  const deleteBooking = async (bookingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) {
      return;
    }

    const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    alert(result.message || "Booking deleted successfully");

    fetchBookings();
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