import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Link } from "react-router-dom";
function Login() {
  const navigate = useNavigate();

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

    try {
      const res = await api.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful");

      navigate("/Home");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        error.message
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control mb-3"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-3"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="btn btn-primary"
        >
          Login
        </button>
        <p className="text-center mt-3">
        Don't have an account?{" "}
         <Link to="/register">
            Register Here
        </Link>
</p>
      </form>
    </div>
  );
}

export default Login;