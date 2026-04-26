import React, { useState, useEffect, useRef } from "react";
import Accordion from "../components/Accordion";
import API from "../services/api";
import Swal from "sweetalert2";

export default function CertificationSection() {

  const [editingCertId, setEditingCertId] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const formRef = useRef(null);

  const [newCert, setNewCert] = useState({
    name: "",
    organization: "",
    credential_url: "",
    issue_year: "",
    ordering_index: 0
  });

  const [loading, setLoading] = useState(false);

  const API_URL = "/api/me/resume/certifications/";

  const Toast = Swal.mixin({
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: "#111",
    color: "#fff",
  });

  // ----------- GET -----------
  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const res = await API.get(API_URL);
      setCertifications(res.data);
    } catch (error) {
      console.error("Error fetching certifications:", error);
      Toast.fire({ icon: "error", title: "Failed to load certifications" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  // ----------- HANDLE CHANGE -----------
  const handleChange = (e) => {
    setNewCert({ ...newCert, [e.target.name]: e.target.value });
  };

  // ----------- RESET -----------
  const resetForm = () => {
    setNewCert({ name: "", organization: "", credential_url: "", issue_year: "", ordering_index: 0 });
    setEditingCertId(null);
  };

  // ----------- EDIT -----------
  const editCertification = (cert) => {
    setNewCert({
      name: cert.name,
      organization: cert.organization || "",
      credential_url: cert.credential_url || "",
      issue_year: cert.issue_year || "",
      ordering_index: cert.ordering_index || 0
    });
    setEditingCertId(cert.id);

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // ----------- SUBMIT -----------
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!newCert.name.trim()) {
      return Toast.fire({ icon: "warning", title: "Certification name is required" });
    }
    if (!newCert.organization.trim()) {
      return Toast.fire({ icon: "warning", title: "Issuing organization is required" });
    }
    if (!newCert.issue_year) {
      return Toast.fire({ icon: "warning", title: "Issue year is required" });
    }
  
    // ✅ Validate URL format if provided
    if (newCert.credential_url.trim()) {
      try {
        new URL(newCert.credential_url.trim());
      } catch {
        return Toast.fire({ icon: "warning", title: "Please enter a valid URL (e.g. https://...)" });
      }
    }
  
    // ✅ Send null instead of empty string for optional URL field
    const payload = {
      ...newCert,
      credential_url: newCert.credential_url.trim() || null,
    };
  
    try {
      if (editingCertId) {
        await API.patch(`${API_URL}${editingCertId}/`, payload);
        Toast.fire({ icon: "success", title: "Certification updated successfully" });
      } else {
        await API.post(API_URL, payload);
        Toast.fire({ icon: "success", title: "Certification added successfully" });
      }
  
      resetForm();
      fetchCertifications();
  
    } catch (error) {
      console.error("Save Certification Error:", error);
  
      // ✅ Handle specific API field errors
      const data = error.response?.data;
      const msg =
        data?.credential_url?.[0] ||
        data?.name?.[0] ||
        data?.organization?.[0] ||
        data?.issue_year?.[0] ||
        data?.detail ||
        "Failed to save certification";
  
      Toast.fire({ icon: "error", title: msg });
    }
  };

  // ----------- DELETE -----------
  const deleteCertification = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      background: "#111",
      color: "#fff"
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`${API_URL}${id}/`);
        Toast.fire({ icon: "success", title: "Certification removed successfully" });
        fetchCertifications();
      } catch (error) {
        console.error("Delete Error:", error);
        Toast.fire({ icon: "error", title: "Failed to delete certification" });
      }
    }
  };

  return (
    <Accordion title="Certifications">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">

          {/* FORM */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">

            {editingCertId && (
              <p className="text-blue-400 text-sm font-bold animate-pulse">
                Editing Certification...
              </p>
            )}

            <input
              name="name"
              value={newCert.name}
              onChange={handleChange}
              placeholder="Certification Name"
              autoComplete="off"
              className={`editor-input transition-all duration-300 ${
                editingCertId ? "border-blue-500 ring-1 ring-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""
              }`}
            />

            <input
              name="organization"
              value={newCert.organization}
              onChange={handleChange}
              placeholder="Issuing Organization"
              autoComplete="off"
              className={`editor-input transition-all duration-300 ${
                editingCertId ? "border-blue-500 ring-1 ring-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""
              }`}
            />

            <input
              name="credential_url"
              value={newCert.credential_url}
              onChange={handleChange}
              placeholder="Credential URL (optional)"
              autoComplete="off"
              className={`editor-input transition-all duration-300 ${
                editingCertId ? "border-blue-500 ring-1 ring-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""
              }`}
            />

            <input
              name="issue_year"
              type="number"
              value={newCert.issue_year}
              onChange={handleChange}
              placeholder="Issue Year"
              autoComplete="off"
              className={`editor-input transition-all duration-300 ${
                editingCertId ? "border-blue-500 ring-1 ring-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""
              }`}
            />

            <div className="flex gap-2">
              <button className="editor-btn flex-1">
                {editingCertId ? "Update Certification" : "Add Certification"}
              </button>

              {editingCertId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              )}
            </div>

          </form>

          {/* LIST */}
          <div>
            <h3 className="text-white mb-3">Your Certifications</h3>

            {certifications.length === 0 ? (
              <p>No certifications added yet</p>
            ) : (
              <ul className="space-y-3">
                {certifications.map((cert) => (
                  <li key={cert.id} className="bg-[#111] p-4 rounded flex justify-between items-center">
                    <div>
                      <p className="font-bold">{cert.name}</p>
                      {cert.organization && <p>{cert.organization}</p>}
                      {cert.issue_year && <p className="text-sm">Year: {cert.issue_year}</p>}
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 text-sm underline"
                        >
                          View Credential
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); editCertification(cert); }}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteCertification(cert.id); }}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      )}
    </Accordion>
  );
}