import { useEffect, useState } from "react";
import { getBookings, getServices } from "../services/api";
import popup from "../utils/notifications";
import "../styles/dashboard.css";

function Dashboard() {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [servicesData, bookingsData] = await Promise.all([
        getServices(),
        getBookings(),
      ]);

      setServices(servicesData);
      setBookings(bookingsData);
    } catch (error) {
      popup.fire({
        icon: "error",
        title: "Dashboard Unavailable",
        text: error.message,
      });
    }
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
