import React, { useState, useEffect } from "react";
import Accordion from "../components/Accordion";
import API from "../services/api";
import Swal from "sweetalert2";

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

  const API_URL = "/api/me/resume/header/";

  // ---------------- GET DATA ----------------
  const fetchHeader = async () => {
    try {
      setLoading(true);

      const res = await API.get(API_URL);

      setFormData(res.data);

    } catch (error) {
      console.log("Error fetching header:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to load header information",
        icon: "error",
        confirmButtonText: "OK"
      });

    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchHeader();
  }, []);

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
      await API.patch(API_URL, formData);

      Swal.fire({
        title: "Success!",
        text: "Header Updated Successfully",
        icon: "success",
        confirmButtonText: "OK"
      });

    } catch (error) {
      console.log("Patch Error:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to update header",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePatch();
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

          <button
            type="submit"
            className="editor-btn"
          >
            Save Header Info
          </button>

        </div>

      </form>

      )}

    </Accordion>
  );
}
