import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Services from "./pages/Services";
import Bookings from "./pages/Bookings";
import MyBookings from "./pages/MyBookings";

import "./styles/app.css";

const getStoredUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getDefaultPage = (user) => {
  if (!user) return "login";
  if (user.role === "admin") return "bookings";
  return "services";
};

function App() {
  const [user, setUser] = useState(getStoredUser);
  const [page, setPage] = useState(() => getDefaultPage(getStoredUser()));

  useEffect(() => {
    setPage(getDefaultPage(user));
  }, [user]);

  const handleLogin = () => {
    setUser(getStoredUser());
  };

  return (
    <div>
      <Navbar />

      <div className="nav-buttons">
        {!user && (
          <>
            <button onClick={() => setPage("signup")}>Signup</button>
            <button onClick={() => setPage("login")}>Login</button>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <button onClick={() => setPage("services")}>Services</button>
            <button onClick={() => setPage("bookings")}>Bookings</button>
          </>
        )}

        {user?.role === "user" && (
          <>
            <button onClick={() => setPage("services")}>Services</button>
            <button onClick={() => setPage("my-bookings")}>My Bookings</button>
          </>
        )}
      </div>

      {page === "signup" && <Signup />}
      {page === "login" && <Login onLogin={handleLogin} />}
      {page === "services" && <Services />}
      {page === "bookings" && user?.role === "admin" && <Bookings />}
      {page === "my-bookings" && user?.role === "user" && <MyBookings />}

      <Footer />
    </div>
  );
}

export default App;
