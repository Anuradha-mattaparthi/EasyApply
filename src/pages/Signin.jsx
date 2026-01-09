import React, { useState } from "react";
import { Navigate } from "react-router-dom";

export default function Signin() {

  if (localStorage.getItem("access")) {
    return <Navigate to="/dashboard" />;
  }
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
      if (!res.ok) throw new Error("Invalid credentials");

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      window.location.href = "/dashboard";

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

          <input type="email" placeholder="Email" onChange={e=>setEmail(e.target.value)} required className="w-full p-3"/>
          <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} required className="w-full p-3"/>

          <button className="bg-blue-600 text-white p-3 w-full">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
