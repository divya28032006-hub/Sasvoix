import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
function Complaints() {
  const [complaints, setComplaints] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints");
      setComplaints(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const voteComplaint = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/complaints/${id}/vote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchComplaints();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        error.message
      );
    }
  };

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

      alert("Complaint Added");

      setFormData({
        title: "",
        description: "",
      });

      fetchComplaints();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        error.message
      );
    }
  };

  return (
    <>
    <Navbar/>
    <div className="container mt-5">
      <h2>Create Complaint</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Complaint Title"
          className="form-control mb-3"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Complaint Description"
          className="form-control mb-3"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <button
          className="btn btn-success mb-4"
          type="submit"
        >
          Submit Complaint
        </button>
      </form>

      <h2>All Complaints</h2>

      {complaints.map((complaint) => (
        <div
          key={complaint._id}
          className="card p-3 mb-3"
        >
          <h4>{complaint.title}</h4>

          <p>{complaint.description}</p>

          <p>
            <strong>Status:</strong>{" "}
            {complaint.status}
          </p>

          <p>
            <strong>Votes:</strong>{" "}
            {complaint.votes}
          </p>

          <button
            className="btn btn-primary"
            onClick={() =>
              voteComplaint(complaint._id)
            }
          >
            👍 Vote
          </button>
        </div>
      ))}
    </div>
    </>
  );
}

export default Complaints;