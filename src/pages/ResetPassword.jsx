import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const { reset_token, email } = location.state || {};

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!reset_token) {
    navigate("/signin");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "warning");
      return;
    }

    if (password.length < 8) {
      Swal.fire("Error", "Password must be at least 8 characters", "warning");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://smartapply-7msy.onrender.com/api/auth/reset-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          reset_token,
          new_password: password
        })
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          title: "Success",
          text: data.message,
          icon: "success"
        }).then(() => {
          navigate("/signin");
        });
      } else {
        // Handle array errors (Django validators)
        const errorMsg = Array.isArray(data.error)
          ? data.error.join(", ")
          : data.error;

        Swal.fire("Error", errorMsg || "Reset failed", "error");
      }

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96 space-y-4">
        
        <h2 className="text-2xl font-semibold text-center">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

      </form>
    </div>
  );
}