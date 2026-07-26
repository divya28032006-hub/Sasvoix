import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  // step 1 = enter email, step 2 = enter OTP + new password
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // DEV ONLY: shows the OTP on screen since no email service is connected
  // yet. Remove this once the backend sends the OTP by email instead of
  // returning it in the API response.
  const [devOtp, setDevOtp] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });

      if (res.data.devOtp) {
        setDevOtp(res.data.devOtp);
      } else {
        alert(
          "If an account with that email exists, a reset code has been generated. Please check and try again."
        );
      }

      setStep(2);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      alert("Password reset successfully. Please log in.");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "480px" }}>
      <h2>Forgot Password</h2>

      {step === 1 && (
        <form onSubmit={handleRequestOtp}>
          <p className="text-muted">
            Enter your account email and we'll generate a reset code.
          </p>

          <input
            type="email"
            placeholder="Email"
            className="form-control mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleResetPassword}>
          {devOtp && (
            <div className="alert alert-warning">
              <strong>Dev mode:</strong> no email service is connected yet,
              so here is your reset code: <strong>{devOtp}</strong>
              <br />
              <small>
                (Remove this banner once real email sending is wired up.)
              </small>
            </div>
          )}

          <p className="text-muted">
            Enter the code sent to <strong>{email}</strong> and choose a new
            password.
          </p>

          <input
            type="text"
            placeholder="6-digit code"
            className="form-control mb-3"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />

          <input
            type="password"
            placeholder="New password"
            className="form-control mb-3"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={6}
            required
          />

          <input
            type="password"
            placeholder="Confirm new password"
            className="form-control mb-3"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={6}
            required
          />

          <button
            type="submit"
            className="btn btn-success w-100 mb-2"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <button
            type="button"
            className="btn btn-link w-100"
            onClick={() => setStep(1)}
          >
            Use a different email
          </button>
        </form>
      )}

      <p className="text-center mt-3">
        Remembered your password? <Link to="/">Login Here</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;
