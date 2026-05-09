import { useState } from "react";
import { signupUser } from "../services/api";
import "../styles/form.css";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signupUser(formData);

    alert(result.message || "Something went wrong");

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
    });
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

        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;