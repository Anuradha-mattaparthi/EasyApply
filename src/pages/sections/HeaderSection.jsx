import React, { useState, useEffect } from "react";
import Accordion from "../components/Accordion";
import API from "../services/api";
import Swal from "sweetalert2";

export default function HeaderSection() {

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",          
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: "#0B0B0B",
    color: "#ffffff",
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

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
  const [saving, setSaving] = useState(false);  

  const API_URL = "/api/me/resume/header/";

  const fetchHeader = async () => {
    try {
      setLoading(true);
      const res = await API.get(API_URL);
      setFormData(res.data);
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.response?.data?.detail || "Failed to load header info"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeader();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.full_name.trim()) {
      Toast.fire({ icon: "warning", title: "Full name is required" });
      return;
    }
    if (!formData.email.trim()) {
      Toast.fire({ icon: "warning", title: "Email is required" });
      return;
    }

    try {
      setSaving(true);
      await API.patch(API_URL, formData);
      Toast.fire({ icon: "success", title: "Header updated successfully" });
    } catch (error) {
      const data = error.response?.data;
      const msg =
        data?.detail ||
        data?.error ||
        Object.values(data || {})?.[0]?.[0] ||   
        "Failed to update header";

      Toast.fire({ icon: "error", title: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Accordion title="Header / Personal Information">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid md:grid-cols-2 gap-4">
            <input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" className="editor-input" />
            <input name="target_role" value={formData.target_role} onChange={handleChange} placeholder="Target Role" className="editor-input" />
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="editor-input" />
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="editor-input" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input name="location_city" value={formData.location_city} onChange={handleChange} placeholder="City" className="editor-input" />
            <input name="location_country" value={formData.location_country} onChange={handleChange} placeholder="Country" className="editor-input" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} placeholder="LinkedIn URL" className="editor-input" />
            <input name="github_url" value={formData.github_url} onChange={handleChange} placeholder="GitHub URL" className="editor-input" />
            <input name="portfolio_url" value={formData.portfolio_url} onChange={handleChange} placeholder="Portfolio URL" className="editor-input md:col-span-2" />
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={saving} className="editor-btn">
              {saving ? "Saving..." : "Save Header Info"}
            </button>
          </div>

        </form>
      )}
    </Accordion>
  );
}