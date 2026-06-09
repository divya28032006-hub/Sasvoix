import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function CreateComplaints() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
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
      const token = localStorage.getItem("token");

      await api.post(
        "/complaints",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Issue Created Successfully");

      setFormData({
        title: "",
        category: "",
        description: "",
      });

    } catch (error) {
      alert(
        error.response?.data?.message ||
        error.message
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <div className="card shadow border-0 p-4">

          <h2 className="mb-4 text-center">
            Create New Issue
          </h2>

          <form onSubmit={handleSubmit}>

            {/* Title */}

            <input
              type="text"
              name="title"
              placeholder="Issue Title"
              className="form-control mb-3"
              value={formData.title}
              onChange={handleChange}
              required
            />

            {/* Category */}

            <select
              name="category"
              className="form-select mb-3"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Category
              </option>

              <option value="Mess">
                Mess
              </option>

              <option value="Hostel">
                Hostel
              </option>

              <option value="WiFi">
                WiFi
              </option>

              <option value="Library">
                Library
              </option>

              <option value="Transport">
                Transport
              </option>

              <option value="Others">
                Others
              </option>
            </select>

            {/* Description */}

            <textarea
              name="description"
              placeholder="Describe the issue"
              className="form-control mb-3"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <button
              className="btn btn-success w-100"
              type="submit"
            >
              Submit Issue
            </button>

          </form>

        </div>

      </div>
    </>
  );
}

export default CreateComplaints;