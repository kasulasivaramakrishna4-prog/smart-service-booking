export const BASE_URL = "https://smart-service-booking-pvje.onrender.com";

async function parseResponse(response, fallbackMessage) {
  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.detail || data.message || fallbackMessage);
  }

  return data;
}

export async function signupUser(userData) {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return parseResponse(response, "Signup failed");
}

export async function loginUser(userData) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return parseResponse(response, "Login failed");
}

export async function getServices() {
  const response = await fetch(`${BASE_URL}/services`);
  return parseResponse(response, "Unable to load services");
}

export async function createBooking(bookingData) {
  const response = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  return parseResponse(response, "Booking failed");
}

export async function createService(serviceData) {
  const response = await fetch(`${BASE_URL}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  });

  return parseResponse(response, "Service could not be added");
}

export async function deleteServiceById(serviceId) {
  const response = await fetch(`${BASE_URL}/services/${serviceId}`, {
    method: "DELETE",
  });

  return parseResponse(response, "Service could not be deleted");
}

export async function getBookings() {
  const response = await fetch(`${BASE_URL}/bookings`);
  return parseResponse(response, "Unable to load bookings");
}

export async function getUserBookings(userId) {
  const response = await fetch(`${BASE_URL}/bookings/user/${userId}`);
  return parseResponse(response, "Unable to load your bookings");
}

export async function updateBookingStatus(bookingId, status) {
  const response = await fetch(`${BASE_URL}/bookings/${bookingId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return parseResponse(response, "Booking status could not be updated");
}

export async function deleteBookingById(bookingId) {
  const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
    method: "DELETE",
  });

  return parseResponse(response, "Booking could not be deleted");
}
