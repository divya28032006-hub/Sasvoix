import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = [
    "All",
    "Mess",
    "Hostel",
    "WiFi",
    "Library",
    "Transport",
    "Others",
  ];

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
        "/complaints",
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

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/complaints/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchComplaints();

      alert("Status Updated Successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.message
      );
    }
  };

  const filteredComplaints =
    categoryFilter === "All"
      ? complaints
      : complaints.filter(
          (complaint) => complaint.category === categoryFilter
        );

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <h2 className="mb-4 text-center">
          Manage Complaints
        </h2>

        <div className="d-flex justify-content-end mb-3">
          <select
            className="form-select"
            style={{ maxWidth: "220px" }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "All Topics" : cat}
              </option>
            ))}
          </select>
        </div>

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
        ) : filteredComplaints.length === 0 ? (
          <div className="alert alert-info">
            No complaints found{categoryFilter !== "All" ? ` for "${categoryFilter}"` : ""}.
          </div>
        ) : (
          filteredComplaints.map((complaint) => (
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
                        : complaint.status ===
                          "In Progress"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                  >
                    {complaint.status}
                  </span>

                </div>

                <div className="mb-2">
                  <span className="badge bg-info text-dark">
                    {complaint.category ||
                      "Others"}
                  </span>
                </div>

                <p className="text-muted">
                  {complaint.description}
                </p>

                {complaint.evidenceUrl && (
                  <p className="mb-2">
                    <a
                      href={complaint.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📎 View Evidence
                    </a>
                  </p>
                )}

                <div className="mb-3">
                  <strong>
                    👍 {complaint.votes} Supporters
                  </strong>
                </div>

                <div className="row align-items-center">

                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={complaint.status}
                      onChange={(e) =>
                        updateStatus(
                          complaint._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Resolved">
                        Resolved
                      </option>
                    </select>
                  </div>

                </div>

              </div>
            </div>
          ))
        )}

      </div>
    </>
  );
}

export default AdminComplaints;