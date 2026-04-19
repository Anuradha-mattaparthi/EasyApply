import React, { useState } from "react";
import { Navigate, Link,useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Signin() {

  if (localStorage.getItem("access")) {
    return <Navigate to="/dashboard" />;
  }
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://smartapply-7msy.onrender.com/api/auth/signin/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid credentials");
      }
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleForgotPassword = async () => {
    const { value: emailInput } = await Swal.fire({
      title: "Enter your email",
      input: "email",
      inputValue: email, 
      inputPlaceholder: "Enter your email address",
      confirmButtonText: "Send OTP",
      inputValidator: (value) => {
        if (!value) return "Email is required";
      }
    });
  
    if (!emailInput) return;
  
    try {
      const res = await fetch("https://smartapply-7msy.onrender.com/api/auth/forgot-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: emailInput })
      });
  
      const data = await res.json();
  
      localStorage.removeItem("reset_email");
      localStorage.setItem("reset_email", emailInput);

      Swal.fire({
        title: "Check your email",
        text: data.message,
        icon: "info",
        confirmButtonText: "OK"
      }).then(() => {
        navigate("/verify-otp");
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Server error", "error");
    }
  };
  return (
    <div className="min-h-screen grid md:grid-cols-10 font-mono">
      <div className="md:col-span-3 bg-black text-white flex items-center justify-center">
        Welcome Back
      </div>

      <div className="md:col-span-7 bg-gray-100 flex items-center justify-center">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <h1 className="text-3xl">Sign In</h1>

          {error && <p className="text-red-600">{error}</p>}

          <input type="email" name="email" placeholder="Email" onChange={e=>setEmail(e.target.value)} required className="w-full p-3"/>
          <input type="password" name="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} required className="w-full p-3"/>

          <button
            disabled={loading}
            className="bg-blue-600 text-white p-3 w-full"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <br/>
          <p className="text-right text-sm">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-blue-600 hover:underline"
            disabled={loading}
          >
            Forgot Password?
          </button>
          </p>
          <p className="text-center text-sm text-[#5A5A5A]">
              Don't have an Account?{" "}
              <Link to="/signup" className="text-[#2563EB] font-medium hover:underline">
               Sign up
              </Link>
            </p>
        </form>
      </div>
    </div>
  );
}
