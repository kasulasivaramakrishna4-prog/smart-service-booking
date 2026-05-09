const BASE_URL = "http://127.0.0.1:8000";

export async function signupUser(userData) {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  console.log("Signup response:", data);
  return data;
}

export async function loginUser(userData) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  console.log("Login response:", data);

  if (!response.ok) {
    return {
      message: data.detail || "Login failed",
    };
  }

  return data;
}

export async function getServices() {
  const response = await fetch(`${BASE_URL}/services`);
  const data = await response.json();
  console.log("Services response:", data);
  return data;
}

export async function createBooking(bookingData) {
  const response = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  const data = await response.json();
  console.log("Booking response:", data);
  return data;
}
