import React, { useState, useEffect, useRef } from "react";
import Accordion from "../components/Accordion";
import API from "../services/api";
import Swal from "sweetalert2";

export default function EducationSection() {

  const [editingEduId, setEditingEduId] = useState(null);
  const [educations, setEducations] = useState([]);
  const formRef = useRef(null);

  const [newEdu, setNewEdu] = useState({
    degree: "",
    institution: "",
    graduation_year: "",
    cgpa: "",
    ordering_index: 0
  });

  const [loading, setLoading] = useState(false);

  const API_URL = "/api/me/resume/education/";

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
  const fetchEducations = async () => {
    try {
      setLoading(true);
      const res = await API.get(API_URL);
      setEducations(res.data);
    } catch (error) {
      console.error("Error fetching education:", error);
      Toast.fire({ icon: "error", title: "Failed to load education details" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  // ----------- HANDLE CHANGE -----------
  const handleChange = (e) => {
    setNewEdu({ ...newEdu, [e.target.name]: e.target.value });
  };

  // ----------- RESET -----------
  const resetForm = () => {
    setNewEdu({ degree: "", institution: "", graduation_year: "", cgpa: "", ordering_index: 0 });
    setEditingEduId(null);
  };

  // ----------- EDIT -----------
  const editEducation = (edu) => {
    setNewEdu({
      degree: edu.degree,
      institution: edu.institution,
      graduation_year: edu.graduation_year,
      cgpa: edu.cgpa || "",
      ordering_index: edu.ordering_index || 0
    });
    setEditingEduId(edu.id);

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // ----------- SUBMIT -----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!newEdu.degree.trim()) {
      return Toast.fire({ icon: "warning", title: "Degree is required" });
    }
    if (!newEdu.institution.trim()) {
      return Toast.fire({ icon: "warning", title: "Institution name is required" });
    }
    if (!newEdu.graduation_year) {
      return Toast.fire({ icon: "warning", title: "Graduation year is required" });
    }

    try {
      if (editingEduId) {
        await API.patch(`${API_URL}${editingEduId}/`, newEdu);
        Toast.fire({ icon: "success", title: "Education updated successfully" });
      } else {
        await API.post(API_URL, newEdu);
        Toast.fire({ icon: "success", title: "Education added successfully" });
      }

      resetForm();
      fetchEducations();

    } catch (error) {
      console.error("Save Education Error:", error);
      const msg = error.response?.data?.detail || "Failed to save education";
      Toast.fire({ icon: "error", title: msg });
    }
  };

  // ----------- DELETE -----------
  const deleteEducation = async (id) => {
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
        Toast.fire({ icon: "success", title: "Education removed successfully" });
        fetchEducations();
      } catch (error) {
        console.error("Delete Error:", error);
        Toast.fire({ icon: "error", title: "Failed to delete education" });
      }
    }
  };

  return (
    <Accordion title="Education">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">

          {/* FORM */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">

            {editingEduId && (
              <p className="text-blue-400 text-sm font-bold animate-pulse">
                Editing Education...
              </p>
            )}

            <input
              name="degree"
              value={newEdu.degree}
              onChange={handleChange}
              placeholder="Degree (e.g B.Tech, MCA)"
              autoComplete="off"
              className={`editor-input transition-all duration-300 ${
                editingEduId ? "border-blue-500 ring-1 ring-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""
              }`}
            />

            <input
              name="institution"
              value={newEdu.institution}
              onChange={handleChange}
              placeholder="Institution Name"
              autoComplete="off"
              className={`editor-input transition-all duration-300 ${
                editingEduId ? "border-blue-500 ring-1 ring-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""
              }`}
            />

            <input
              name="graduation_year"
              type="number"
              value={newEdu.graduation_year}
              onChange={handleChange}
              placeholder="Graduation Year"
              autoComplete="off"
              className={`editor-input transition-all duration-300 ${
                editingEduId ? "border-blue-500 ring-1 ring-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""
              }`}
            />

            <input
              name="cgpa"
              value={newEdu.cgpa}
              onChange={handleChange}
              placeholder="CGPA / Percentage (optional)"
              autoComplete="off"
              className={`editor-input transition-all duration-300 ${
                editingEduId ? "border-blue-500 ring-1 ring-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""
              }`}
            />

            <div className="flex gap-2">
              <button className="editor-btn flex-1">
                {editingEduId ? "Update Education" : "Add Education"}
              </button>

              {editingEduId && (
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
            <h3 className="text-white mb-3">Your Education</h3>

            {educations.length === 0 ? (
              <p>No education details added yet</p>
            ) : (
              <ul className="space-y-3">
                {educations.map((edu) => (
                  <li key={edu.id} className="bg-[#111] p-4 rounded flex justify-between items-center">
                    <div>
                      <p className="font-bold">{edu.degree}</p>
                      <p>{edu.institution}</p>
                      <p className="text-sm">
                        {edu.graduation_year} {edu.cgpa && `- CGPA: ${edu.cgpa}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); editEducation(edu); }}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteEducation(edu.id); }}
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