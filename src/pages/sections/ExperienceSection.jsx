import React, { useState, useEffect,useRef } from "react";
import Accordion from "../components/Accordion";
import API from "../services/api";
import Swal from "sweetalert2";

export default function ExperienceSection() {

  const [experienced, setExperienced] = useState(false);

  const [experiences, setExperiences] = useState([]);
  const [editingExpId, setEditingExpId] = useState(null);
  const formRef = useRef(null);

  const [newExp, setNewExp] = useState({
    job_title: "",
    company_name: "",
    start_date: "",
    end_date: "",
    bullets: [],
    ordering_index: 0
  });
  const Toast = Swal.mixin({
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: "#111", // Matches your experience list items
    color: "#fff",
  });
  const [loading, setLoading] = useState(false);

  const API_URL = "/api/me/resume/work-experience/";

  // -------- GET EXPERIENCES --------
  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await API.get(API_URL);
      setExperiences(res.data);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      // Use Toast instead of a hard modal for load errors
      Toast.fire({
        icon: "error",
        title: "Failed to load experiences",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const editExperience = (exp) => {
    setNewExp({
      job_title: exp.job_title,
      company_name: exp.company_name,
      start_date: exp.start_date,
      end_date: exp.end_date || "",
      bullets: exp.bullets || [],
      ordering_index: exp.ordering_index || 0
    });
  
    setEditingExpId(exp.id);
    setExperienced(true);
  
    // Scroll to form smoothly
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };
  
  useEffect(() => {
    fetchExperiences();
  }, []);

  // -------- AUTO SELECT RADIO BASED ON DATA --------
  useEffect(() => {
    if (experiences.length > 0) {
      setExperienced(true);
    } else {
      setExperienced(false);
    }
  }, [experiences]);

  // -------- HANDLE CHANGE --------
  const handleChange = (e) => {
    setNewExp({
      ...newExp,
      [e.target.name]: e.target.value
    });
  };

  // -------- ADD EXPERIENCE (POST) --------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newExp.job_title) {
      return Toast.fire({ icon: "warning", title: "Job Title is required" });
    }
    if (!newExp.company_name) {
      return Toast.fire({ icon: "warning", title: "Company Name is required" });
    }
    if (!newExp.start_date) {
      return Toast.fire({ icon: "warning", title: "Start Date is required" });
    }
    try {
      if (editingExpId) {
        await API.patch(`${API_URL}${editingExpId}/`, newExp);
        Toast.fire({
          icon: "success",
          title: "Experience updated successfully",
        });
      } else {
        await API.post(API_URL, newExp);
        Toast.fire({
          icon: "success",
          title: "Experience added successfully",
        });
      }
  
      setNewExp({
        job_title: "",
        company_name: "",
        start_date: "",
        end_date: "",
        bullets: [],
        ordering_index: 0
      });
      setEditingExpId(null);
      fetchExperiences();
    } catch (error) {
      console.error("Save Experience Error:", error);
      // Extract specific error message if available from backend
      const msg = error.response?.data?.detail || "Failed to save experience";
      Toast.fire({
        icon: "error",
        title: msg,
      });
    }
  };
  const resetForm = () => {
    setNewExp({
      job_title: "",
      company_name: "",
      start_date: "",
      end_date: "",
      bullets: [],
      ordering_index: 0
    });
    setEditingExpId(null);
  };

  // -------- DELETE EXPERIENCE --------
  const deleteExperience = async (id) => {
    // Optional: Keep the confirmation modal for destructive actions
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
        Toast.fire({
          icon: "success",
          title: "Experience removed successfully",
        });
        fetchExperiences();
      } catch (error) {
        console.error("Delete Error:", error);
        Toast.fire({
          icon: "error",
          title: "Failed to delete experience",
        });
      }
    }
  };

  return (
    <Accordion title="Work Experience">

      {loading ? (
        <p>Loading...</p>
      ) : (

      <div className="space-y-6">

        {/* EXPERIENCE TYPE RADIO */}
        <div className="flex gap-6 text-white">
          <label>
            <input
              type="radio"
              name="exp"
              checked={experienced === true}
              onChange={() => setExperienced(true)}
            /> Experienced
          </label>

          <label>
            <input
              type="radio"
              name="exp"
              checked={experienced === false}
              onChange={() => setExperienced(false)}
            /> Fresher
          </label>
        </div>

        {experienced && (
          <>
            {/* ADD FORM */}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 pt-4">
              {editingExpId && (
              <p className="text-blue-400 text-sm font-bold animate-pulse">
                Editing Experience...
              </p>
            )}
            <input
        name="job_title"
        value={newExp.job_title}
        onChange={handleChange}
        placeholder="Job Title"
        className={`editor-input transition-all duration-300 ${
          editingExpId ? "border-blue-500 ring-1 ring-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""
        }`}
        autoComplete="off"
      />

      <input
        name="company_name"
        value={newExp.company_name}
        onChange={handleChange}
        placeholder="Company Name"
        className={`editor-input transition-all duration-300 ${
          editingExpId ? "border-blue-500 ring-1 ring-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""
        }`}
        autoComplete="off"
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="date"
          name="start_date"
          value={newExp.start_date}
          onChange={handleChange}
          className={`editor-input transition-all duration-300 ${
            editingExpId ? "border-blue-500 ring-1 ring-blue-500" : ""
          }`}
        />

        <input
          type="date"
          name="end_date"
          value={newExp.end_date}
          onChange={handleChange}
          className={`editor-input transition-all duration-300 ${
            editingExpId ? "border-blue-500 ring-1 ring-blue-500" : ""
          }`}
        />
      </div>

      <div className="flex gap-2">
        <button className="editor-btn flex-1">
          {editingExpId ? "Update Experience" : "Add Experience"}
        </button>
        
        {/* Cancel button only visible during editing */}
        {editingExpId && (
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
              <h3 className="text-white mb-3">Your Experiences</h3>

              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-[#111] p-3 rounded mb-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{exp.job_title}</p>
                    <p>{exp.company_name}</p>
                    <p>
                      {exp.start_date} - {exp.end_date || "Present"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      editExperience(exp);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteExperience(exp.id);
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>

                </div>
              ))}

            </div>
          </>
        )}

      </div>

      )}

    </Accordion>
  );
}
