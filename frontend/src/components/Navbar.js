import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">

        <Link
          className="navbar-brand fw-bold"
          to="/home"
        >
          SasVoix
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >
          <div className="navbar-nav ms-auto align-items-center">

            {/* Student Links */}

            {user?.role === "student" && (
              <>
                <Link
                  className="nav-link"
                  to="/home"
                >
                  Home
                </Link>

                <Link
                  className="nav-link"
                  to="/create"
                >
                  Create Issue
                </Link>

                <Link
                  className="nav-link"
                  to="/my-complaints"
                >
                  My Issues
                </Link>
              </>
            )}

            {/* Admin Links */}

            {user?.role === "admin" && (
              <>
                <Link
                  className="nav-link"
                  to="/home"
                >
                  Home
                </Link>

                <Link
                  className="nav-link"
                  to="/dashboard"
                >
                  Dashboard
                </Link>

                <Link
                  className="nav-link"
                  to="/admin-complaints"
                >
                  Manage Issues
                </Link>
              </>
            )}

            {/* User Name */}

            {user?.name && (
              <span className="text-light ms-3 me-3">
                Welcome, {user.name}
              </span>
            )}

            {/* Logout */}

            <button
              className="btn btn-danger ms-lg-3 mt-2 mt-lg-0"
              onClick={logoutHandler}
            >
              Logout
            </button>

          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;