import { useState } from "react";
import { signupUser } from "../services/api";
import popup, { showLoading } from "../utils/notifications";
import "../styles/form.css";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
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
    showLoading("Creating Account", "Please wait while we set up your account.");

    try {
      const result = await signupUser(formData);

      await popup.fire({
        icon: "success",
        title: "Signup Successful",
        text: result.message || "Your account has been created successfully.",
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
      });
    } catch (error) {
      popup.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.message || "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>User Signup</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
        />

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
          {isSubmitting ? "Signing up..." : "Signup"}
        </button>
      </form>
    </div>
  );
}

export default Signup;
