import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
        "/complaints/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComplaints(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <h2 className="mb-4 text-center">
          My Issues
        </h2>

        {loading ? (
          <div className="text-center">
            <div
              className="spinner-border"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="alert alert-info">
            You haven't created any issues yet.
          </div>
        ) : (
          complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="card shadow-sm border-0 mb-4"
            >
              <div className="card-body">

                <div className="d-flex justify-content-between align-items-center mb-2">

                  <h5 className="mb-0">
                    {complaint.title}
                  </h5>

                  <span
                    className={`badge ${
                      complaint.status === "Resolved"
                        ? "bg-success"
                        : complaint.status === "In Progress"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                  >
                    {complaint.status}
                  </span>

                </div>

                <div className="mb-2">
                  <span className="badge bg-info text-dark">
                    {complaint.category || "Others"}
                  </span>
                </div>

                <p className="text-muted">
                  {complaint.description}
                </p>

                <div className="d-flex justify-content-between align-items-center">

                  <span className="fw-bold">
                    👍 {complaint.votes} Supporters
                  </span>

                  <small className="text-muted">
                    {new Date(
                      complaint.createdAt
                    ).toLocaleDateString()}
                  </small>

                </div>

              </div>
            </div>
          ))
        )}

      </div>
    </>
  );
}

export default MyComplaints;