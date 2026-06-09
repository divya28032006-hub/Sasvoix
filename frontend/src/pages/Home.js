import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Home() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints");

      const sortedComplaints = res.data.sort(
        (a, b) => b.votes - a.votes
      );

      setComplaints(sortedComplaints);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h2 className="mb-4 text-center">
          Campus Issues
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
            No complaints found.
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
                    👍 {complaint.votes} Votes
                  </span>

                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      voteComplaint(complaint._id)
                    }
                  >
                    Support Issue
                  </button>

                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Home;