import { toast } from "../utils/notifications";
import "../styles/navbar.css";

function Navbar() {

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {

    localStorage.removeItem("user");

    toast.fire({
      icon: "success",
      title: "Logged out successfully",
    });

    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (

    <div className="navbar">

      <h2>SMART SERVICE BOOKING</h2>

      {user ? (

        <div>

          <span>
            Welcome, {user.name}
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      ) : (

        <p>Please login to book a service</p>

      )}

    </div>
  );
}

export default Navbar;
