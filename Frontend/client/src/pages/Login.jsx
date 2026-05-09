import { useState } from "react";
import { loginUser } from "../services/api";
import "../styles/form.css";

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await loginUser(formData);

    alert(result.message || "Login failed");

    console.log(result);

    if (result.user) {
      localStorage.setItem("user", JSON.stringify(result.user));
      onLogin();
    }

    setFormData({
      email: "",
      password: "",
    });
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

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
