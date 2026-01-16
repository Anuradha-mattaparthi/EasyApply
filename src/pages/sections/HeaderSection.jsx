import React, { useState, useEffect } from "react";
import Accordion from "../components/Accordion";
import axios from "axios";

export default function HeaderSection() {

  const [formData, setFormData] = useState({
    full_name: "",
    target_role: "",
    phone: "",
    email: "",
    location_city: "",
    location_country: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: ""
  });

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");   // adjust based on your auth flow

  const API_URL = "https://smartapply-7msy.onrender.com/api/me/resume/header/";

  // ---------------- GET DATA ----------------
  const fetchHeader = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setFormData(res.data);

    } catch (error) {
      console.log("Error fetching header:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    if (token) {
      fetchHeader();
    }
  }, [token]);

  // ---------------- HANDLE INPUT CHANGE ----------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ---------------- PATCH UPDATE ----------------
  const handlePatch = async () => {
    try {
      await axios.patch(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Header Updated Successfully (PATCH)");

    } catch (error) {
      console.log("Patch Error:", error);
      alert("Failed to update header");
    }
  };

  // ---------------- PUT UPDATE ----------------
  const handlePut = async () => {
    try {
      await axios.put(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Header Updated Successfully (PUT)");

    } catch (error) {
      console.log("Put Error:", error);
      alert("Failed to update header");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("SUBMIT CLICKED");
    console.log("Current Form Data:", formData);    // Default action -> PATCH (recommended)
    handlePut();
  };

  return (
    <Accordion title="Header / Personal Information">

      {loading ? (
        <p>Loading...</p>
      ) : (

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Personal Details */}
        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Full Name"
            className="editor-input"
          />

          <input
            name="target_role"
            value={formData.target_role}
            onChange={handleChange}
            placeholder="Target Role"
            className="editor-input"
          />

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="editor-input"
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="editor-input"
          />

        </div>

        {/* Location */}
        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="location_city"
            value={formData.location_city}
            onChange={handleChange}
            placeholder="City"
            className="editor-input"
          />

          <input
            name="location_country"
            value={formData.location_country}
            onChange={handleChange}
            placeholder="Country"
            className="editor-input"
          />

        </div>

        {/* Links */}
        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleChange}
            placeholder="LinkedIn URL"
            className="editor-input"
          />

          <input
            name="github_url"
            value={formData.github_url}
            onChange={handleChange}
            placeholder="GitHub URL"
            className="editor-input"
          />

          <input
            name="portfolio_url"
            value={formData.portfolio_url}
            onChange={handleChange}
            placeholder="Portfolio URL"
            className="editor-input md:col-span-2"
          />

        </div>

        <div className="flex gap-4">

          <button type="submit" className="editor-btn fgdf">
            Save (PATCH)
          </button>

          <button
            type="button"
            onClick={handlePut}
            className="editor-btn"
          >
            Full Update (PUT)
          </button>

        </div>

      </form>

      )}

    </Accordion>
  );
}
