import { useEffect, useState } from "react";

import {
  createBooking,
  createService,
  deleteServiceById,
  getServices,
} from "../services/api";
import popup, { showLoading } from "../utils/notifications";

import "../styles/services.css";

import acImage from "../images/ac.jpg";
import bikeImage from "../images/bike.jpg";
import carImage from "../images/car.jpg";
import cctvImage from "../images/cctv.jpg";
import laptopImage from "../images/laptop.jpg";
import refrigeratorImage from "../images/refrigerator.jpg";
import tvImage from "../images/tv.jpg";
import washingImage from "../images/washing.jpg";
import waterImage from "../images/water.jpg";

function Services() {
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = loggedUser?.role === "admin";

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bookingServiceId, setBookingServiceId] = useState(null);

  const [bookingData, setBookingData] = useState({
    phone: "",
    booking_date: "",
    booking_time: "",
  });

  const [serviceData, setServiceData] = useState({
    service_name: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);

    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      popup.fire({
        icon: "error",
        title: "Services Unavailable",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const getImage = (serviceName) => {
    if (serviceName.includes("AC")) return acImage;
    if (serviceName.includes("Bike")) return bikeImage;
    if (serviceName.includes("Car")) return carImage;
    if (serviceName.includes("CCTV")) return cctvImage;
    if (serviceName.includes("Laptop")) return laptopImage;
    if (serviceName.includes("Refrigerator")) return refrigeratorImage;
    if (serviceName.includes("TV")) return tvImage;
    if (serviceName.includes("Washing")) return washingImage;
    if (serviceName.includes("Water")) return waterImage;

    return acImage;
  };

  const handleBooking = async (serviceId) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      popup.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login before booking a service.",
      });
      return;
    }

    const trimmedPhone = bookingData.phone.trim();

    if (!trimmedPhone || !bookingData.booking_date || !bookingData.booking_time) {
      popup.fire({
        icon: "warning",
        title: "Missing Booking Details",
        text: "Please enter your phone number, booking date, and booking time.",
      });
      return;
    }

    if (!/^[0-9]{10}$/.test(trimmedPhone)) {
      popup.fire({
        icon: "warning",
        title: "Invalid Phone Number",
        text: "Please enter a valid 10-digit phone number.",
      });
      return;
    }

    const finalBooking = {
      user_id: user.id,
      service_id: serviceId,
      phone: trimmedPhone,
      booking_date: bookingData.booking_date,
      booking_time: bookingData.booking_time,
    };

    setBookingServiceId(serviceId);
    showLoading("Booking Service", "Please wait while we confirm your booking.");

    try {
      const result = await createBooking(finalBooking);

      await popup.fire({
        icon: "success",
        title: "Booking Successful",
        text: result.message || "Your service has been booked successfully.",
      });

      setBookingData({
        phone: "",
        booking_date: "",
        booking_time: "",
      });
    } catch (error) {
      popup.fire({
        icon: "error",
        title: "Booking Failed",
        text: error.message || "Unable to book this service right now.",
      });
    } finally {
      setBookingServiceId(null);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();

    try {
      const result = await createService({
        ...serviceData,
        price: Number(serviceData.price),
      });

      setServiceData({
        service_name: "",
        description: "",
        price: "",
      });

      fetchServices();

      popup.fire({
        icon: "success",
        title: "Service Added",
        text: result.message || "Service added successfully.",
      });
    } catch (error) {
      popup.fire({
        icon: "error",
        title: "Service Not Added",
        text: error.message,
      });
    }
  };

  const deleteService = async (serviceId) => {
    const confirmDelete = await popup.fire({
      icon: "warning",
      title: "Delete Service?",
      text: "This service will be removed from the list.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirmDelete.isConfirmed) {
      return;
    }

    try {
      const result = await deleteServiceById(serviceId);

      fetchServices();

      popup.fire({
        icon: "success",
        title: "Service Deleted",
        text: result.message || "Service deleted successfully.",
      });
    } catch (error) {
      popup.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.message,
      });
    }
  };

  const filteredServices = services.filter((service) =>
    service.service_name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="services-container">
      <h2>Available Services</h2>

      {isAdmin && (
        <form className="add-service-form" onSubmit={handleAddService}>
          <h3>Add Service</h3>

          <input
            type="text"
            placeholder="Service Name"
            value={serviceData.service_name}
            onChange={(e) =>
              setServiceData({
                ...serviceData,
                service_name: e.target.value,
              })
            }
            required
          />

          <input
            type="text"
            placeholder="Description"
            value={serviceData.description}
            onChange={(e) =>
              setServiceData({
                ...serviceData,
                description: e.target.value,
              })
            }
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={serviceData.price}
            onChange={(e) =>
              setServiceData({
                ...serviceData,
                price: e.target.value,
              })
            }
            required
          />

          <button type="submit">Add Service</button>
        </form>
      )}

      <input
        type="text"
        placeholder="Search Services..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "20px"
        }}
      />

      {!isAdmin && (
        <div className="booking-inputs">
          <input
            type="text"
            placeholder="Enter Phone Number"
            value={bookingData.phone}
            onChange={(e) =>
              setBookingData({
                ...bookingData,
                phone: e.target.value,
              })
            }
          />

          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={bookingData.booking_date}
            onChange={(e) =>
              setBookingData({
                ...bookingData,
                booking_date: e.target.value,
              })
            }
          />

          <input
            type="time"
            value={bookingData.booking_time}
            onChange={(e) =>
              setBookingData({
                ...bookingData,
                booking_time: e.target.value,
              })
            }
          />
        </div>
      )}

      <br />

      {loading ? (
        <h3>Loading services...</h3>
      ) : filteredServices.length === 0 ? (
        <h3>No services found</h3>
      ) : (
        filteredServices.map((service) => (
          <div className="service-card" key={service.id}>
            <img
              src={getImage(service.service_name)}
              alt="service"
              width="250"
              style={{
                borderRadius: "10px",
                marginBottom: "10px"
              }}
            />

            <h3>{service.service_name}</h3>

            <p>{service.description}</p>

            <h4>Rs. {service.price}</h4>

            {!isAdmin && (
              <button
                type="button"
                onClick={() => handleBooking(service.id)}
                disabled={bookingServiceId !== null}
              >
                {bookingServiceId === service.id ? "Booking..." : "Book Service"}
              </button>
            )}

            {isAdmin && (
              <button
                type="button"
                onClick={() =>
                  deleteService(service.id)
                }
              >
                Delete
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Services;
