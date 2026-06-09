import { useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
function Register() {
  const [formData, setFormData] = useState({
    name: "",
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
        "/auth/register",
        formData
      );

      alert("Registration Successful");
      console.log(res.data);

    } catch (error) {
      console.log(error.response.data);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="btn btn-primary"
        >
          Register
        </button>
        <p className="text-center mt-3">
         Already have an account?{" "}
        <Link to="/">
            Login Here
        </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;