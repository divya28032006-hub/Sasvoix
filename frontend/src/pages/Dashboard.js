import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
  "/dashboard",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

);

      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!stats) {
    return (
      <>
        <Navbar />
        <div className="container text-center mt-5">
          <div
            className="spinner-border"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <h2 className="mb-4 text-center">
          📊 Admin Dashboard
        </h2>

        <div className="row">

          <div className="col-md-3 mb-3">
            <div className="card bg-primary text-white text-center shadow border-0">
              <div className="card-body">
                <h6>Total Complaints</h6>
                <h2>{stats.totalComplaints}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card bg-secondary text-white text-center shadow border-0">
              <div className="card-body">
                <h6>Pending</h6>
                <h2>{stats.pendingComplaints}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card bg-warning text-dark text-center shadow border-0">
              <div className="card-body">
                <h6>In Progress</h6>
                <h2>{stats.inProgressComplaints}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card bg-success text-white text-center shadow border-0">
              <div className="card-body">
                <h6>Resolved</h6>
                <h2>{stats.resolvedComplaints}</h2>
              </div>
            </div>
          </div>

        </div>

        {/* Top Complaint */}

        <div className="card shadow border-0 mt-4">
          <div className="card-body">

            <h4 className="mb-3">
              🔥 Most Supported Issue
            </h4>

            {stats.topComplaint ? (
              <>
                <div className="d-flex justify-content-between align-items-center mb-2">

                  <h5 className="mb-0">
                    {stats.topComplaint.title}
                  </h5>

                  <span
                    className={`badge ${
                      stats.topComplaint.status ===
                      "Resolved"
                        ? "bg-success"
                        : stats.topComplaint.status ===
                          "In Progress"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                  >
                    {stats.topComplaint.status}
                  </span>

                </div>

                <div className="mb-2">
                  <span className="badge bg-info text-dark">
                    {stats.topComplaint.category ||
                      "Others"}
                  </span>
                </div>

                <p className="text-muted">
                  {stats.topComplaint.description}
                </p>

                <h6>
                  👍 {stats.topComplaint.votes} Supporters
                </h6>
              </>
            ) : (
              <div className="alert alert-info">
                No complaints yet.
              </div>
            )}

          </div>
        </div>

      </div>
    </>
  );
}

export default Dashboard;