import React, { useState, useEffect } from "react";
import Accordion from "../components/Accordion";
import API from "../services/api";
import Swal from "sweetalert2";

export default function CertificationSection() {
  const [editingCertId, setEditingCertId] = useState(null);

  const [certifications, setCertifications] = useState([]);

  const [newCert, setNewCert] = useState({
    name: "",
    organization: "",
    credential_url: "",
    issue_year: "",
    ordering_index: 0
  });

  const [loading, setLoading] = useState(false);

  const API_URL = "/api/me/resume/certifications/";

  // ----------- GET CERTIFICATIONS -----------
  const fetchCertifications = async () => {
    try {
      setLoading(true);

      const res = await API.get(API_URL);

      setCertifications(res.data);

    } catch (error) {
      console.log("Error fetching certifications:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to load certifications",
        icon: "error",
        confirmButtonText: "OK"
      });

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  // ----------- HANDLE CHANGE -----------
  const handleChange = (e) => {
    setNewCert({
      ...newCert,
      [e.target.name]: e.target.value
    });
  };
  const editCertification = (cert) => {
    setNewCert({
      name: cert.name,
      organization: cert.organization || "",
      credential_url: cert.credential_url || "",
      issue_year: cert.issue_year || "",
      ordering_index: cert.ordering_index || 0
    });
  
    setEditingCertId(cert.id);
  };
  
  // ----------- ADD CERTIFICATION (POST) -----------
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (editingCertId) {
        // PATCH (UPDATE)
        await API.patch(`${API_URL}${editingCertId}/`, newCert);
  
        Swal.fire({
          title: "Updated!",
          text: "Certification updated successfully",
          icon: "success"
        });
      } else {
        // POST (CREATE)
        await API.post(API_URL, newCert);
  
        Swal.fire({
          title: "Success!",
          text: "Certification added successfully",
          icon: "success"
        });
      }
  
      setNewCert({
        name: "",
        organization: "",
        credential_url: "",
        issue_year: "",
        ordering_index: 0
      });
  
      setEditingCertId(null);
      fetchCertifications();
  
    } catch (error) {
      console.log("Save Certification Error:", error);
  
      Swal.fire({
        title: "Error!",
        text: "Failed to save certification",
        icon: "error"
      });
    }
  };
  

  // ----------- DELETE CERTIFICATION -----------
  const deleteCertification = async (id) => {
    try {
      await API.delete(`${API_URL}${id}/`);

      Swal.fire({
        title: "Deleted!",
        text: "Certification removed successfully",
        icon: "success",
        confirmButtonText: "OK"
      });

      fetchCertifications();

    } catch (error) {
      console.log("Delete Error:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to delete certification",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  return (
    <Accordion title="Certifications">

      {loading ? (
        <p>Loading...</p>
      ) : (

      <div className="space-y-6">

        {/* ADD CERTIFICATION FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            value={newCert.name}
            onChange={handleChange}
            placeholder="Certification Name"
            className="editor-input"
            required
          />

          <input
            name="organization"
            value={newCert.organization}
            onChange={handleChange}
            placeholder="Issuing Organization"
            className="editor-input"
          />

          <input
            name="credential_url"
            value={newCert.credential_url}
            onChange={handleChange}
            placeholder="Credential URL (optional)"
            className="editor-input"
          />

          <input
            name="issue_year"
            type="number"
            value={newCert.issue_year}
            onChange={handleChange}
            placeholder="Issue Year"
            className="editor-input"
          />

          <button className="editor-btn">
            {editingCertId ? "Update Certification" : "Add Certification"}
          </button>


        </form>

        {/* CERTIFICATION LIST */}
        <div>
          <h3 className="text-white mb-3">Your Certifications</h3>

          {certifications.length === 0 ? (
            <p>No certifications added yet</p>
          ) : (
            <ul className="space-y-3">

              {certifications.map((cert) => (
                <li
                  key={cert.id}
                  className="bg-[#111] p-4 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{cert.name}</p>

                    {cert.organization && (
                      <p>{cert.organization}</p>
                    )}

                    {cert.issue_year && (
                      <p className="text-sm">Year: {cert.issue_year}</p>
                    )}

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
                      onClick={() => editCertification(cert)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteCertification(cert.id)}
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
