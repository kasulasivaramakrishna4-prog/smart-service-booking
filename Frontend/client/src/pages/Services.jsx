import { useEffect, useState } from "react";

import { getServices, createBooking } from "../services/api";

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

    const data = await getServices();

    setServices(data);
    setLoading(false);
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
    alert("Book button clicked");

    const user = JSON.parse(localStorage.getItem("user"));

    console.log("Logged user:", user);
    console.log("Booking data:", bookingData);

    if (!user) {
      alert("Please login first");
      return;
    }

    if (
      !bookingData.phone ||
      !bookingData.booking_date ||
      !bookingData.booking_time
    ) {
      alert("Please enter phone number, date and time");
      return;
    }

    const finalBooking = {
      user_id: user.id,
      service_id: serviceId,
      phone: bookingData.phone,
      booking_date: bookingData.booking_date,
      booking_time: bookingData.booking_time,
    };

    console.log("Final booking:", finalBooking);

    const result = await createBooking(finalBooking);

    console.log("Booking response:", result);

    alert(result.message || JSON.stringify(result));

    setBookingData({
      phone: "",
      booking_date: "",
      booking_time: "",
    });
  };

  const handleAddService = async (e) => {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...serviceData,
        price: Number(serviceData.price),
      }),
    });

    const result = await response.json();

    alert(result.message || result.detail || "Service added successfully");

    if (response.ok) {
      setServiceData({
        service_name: "",
        description: "",
        price: "",
      });

      fetchServices();
    }
  };

  const deleteService = async (serviceId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmDelete) {
      return;
    }

    const response = await fetch(
      `http://127.0.0.1:8000/services/${serviceId}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    alert(result.message || result.detail || "Service deleted successfully");

    if (response.ok) {
      fetchServices();
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
              <button type="button" onClick={() => handleBooking(service.id)}>
                Book Service
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
