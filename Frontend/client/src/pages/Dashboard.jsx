import { useEffect, useState } from "react";
import { getServices } from "../services/api";
import "../styles/dashboard.css";

function Dashboard() {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const servicesData = await getServices();

    const bookingsResponse = await fetch("http://127.0.0.1:8000/bookings");
    const bookingsData = await bookingsResponse.json();

    setServices(servicesData);
    setBookings(bookingsData);
  };

  const pending = bookings.filter((b) => b.status === "Pending").length;
  const completed = bookings.filter((b) => b.status === "Completed").length;

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Services</h3>
          <p>{services.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Bookings</h3>
          <p>{bookings.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Pending Bookings</h3>
          <p>{pending}</p>
        </div>

        <div className="dashboard-card">
          <h3>Completed Bookings</h3>
          <p>{completed}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
