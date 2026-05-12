import { useState } from "react";
import { loginUser } from "../services/api";
import popup, { showLoading } from "../utils/notifications";
import "../styles/form.css";

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    showLoading("Signing In", "Checking your account details.");

    try {
      const result = await loginUser(formData);

      await popup.fire({
        icon: "success",
        title: "Login Successful",
        text: result.message || "Welcome back.",
      });

      localStorage.setItem("user", JSON.stringify(result.user));
      onLogin();

      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      popup.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Please check your email and password.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>User Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
