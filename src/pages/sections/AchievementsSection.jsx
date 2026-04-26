import React, { useState, useEffect, useRef } from "react";
import Accordion from "../components/Accordion";
import API from "../services/api";
import Swal from "sweetalert2";

export default function AchievementsSection() {

  const [editingAchievementId, setEditingAchievementId] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const formRef = useRef(null);

  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
    year: "",
    type: "other",
    ordering_index: 0
  });

  const [loading, setLoading] = useState(false);

  const API_URL = "/api/me/resume/achievements/";

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
  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const res = await API.get(API_URL);
      setAchievements(res.data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      Toast.fire({ icon: "error", title: "Failed to load achievements" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  // ----------- HANDLE CHANGE -----------
  const handleChange = (e) => {
    setNewAchievement({ ...newAchievement, [e.target.name]: e.target.value });
  };

  // ----------- RESET -----------
  const resetForm = () => {
    setNewAchievement({ title: "", description: "", year: "", type: "other", ordering_index: 0 });
    setEditingAchievementId(null);
  };

  // ----------- EDIT -----------
  const editAchievement = (ach) => {
    setNewAchievement({
      title: ach.title,
      description: ach.description || "",
      year: ach.year || "",
      type: ach.type || "other",
      ordering_index: ach.ordering_index || 0
    });
    setEditingAchievementId(ach.id);

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // ----------- SUBMIT -----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newAchievement.title.trim()) {
      return Toast.fire({ icon: "warning", title: "Achievement title is required" });
    }

    try {
      if (editingAchievementId) {
        await API.patch(`${API_URL}${editingAchievementId}/`, newAchievement);
        Toast.fire({ icon: "success", title: "Achievement updated successfully" });
      } else {
        await API.post(API_URL, newAchievement);
        Toast.fire({ icon: "success", title: "Achievement added successfully" });
      }

      resetForm();
      fetchAchievements();

    } catch (error) {
      console.error("Save Achievement Error:", error);
      const msg = error.response?.data?.detail || "Failed to save achievement";
      Toast.fire({ icon: "error", title: msg });
    }
  };

  // ----------- DELETE -----------
  const deleteAchievement = async (id) => {
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
        Toast.fire({ icon: "success", title: "Achievement removed successfully" });
        fetchAchievements();
      } catch (error) {
        console.error("Delete Error:", error);
        Toast.fire({ icon: "error", title: "Failed to delete achievement" });
      }
    }
  };

  return (
    <Accordion title="Achievements">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">

          {/* FORM */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">

            {editingAchievementId && (
              <p className="text-blue-400 text-sm font-bold animate-pulse">
                Editing Achievement...
              </p>
            )}

            <input
              name="title"
              value={newAchievement.title}
              onChange={handleChange}
              placeholder="Achievement Title"
              autoComplete="off"
              className={`editor-input transition-all duration-300 ${
                editingAchievementId ? "border-blue-500 ring-1 ring-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""
              }`}
            />

            <textarea
              name="description"
              value={newAchievement.description}
              onChange={handleChange}
              placeholder="Description (optional)"
              className={`editor-textarea transition-all duration-300 ${
                editingAchievementId ? "border-blue-500 ring-1 ring-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""
              }`}
            />

            <input
              name="year"
              type="number"
              value={newAchievement.year}
              onChange={handleChange}
              placeholder="Year"
              autoComplete="off"
              className={`editor-input transition-all duration-300 ${
                editingAchievementId ? "border-blue-500 ring-1 ring-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""
              }`}
            />

            <div className="flex gap-2">
              <button className="editor-btn flex-1">
                {editingAchievementId ? "Update Achievement" : "Add Achievement"}
              </button>

              {editingAchievementId && (
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
            <h3 className="text-white mb-3">Your Achievements</h3>

            {achievements.length === 0 ? (
              <p>No achievements added yet</p>
            ) : (
              <ul className="space-y-3">
                {achievements.map((ach) => (
                  <li key={ach.id} className="bg-[#111] p-4 rounded flex justify-between items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{ach.title}</p>
                      {ach.description && (
                        <p className="text-sm text-gray-300 break-all whitespace-pre-wrap mt-1">{ach.description}</p>
                      )}
                      {ach.year && <p className="text-sm">Year: {ach.year}</p>}
                      {ach.type && <p className="text-xs text-gray-400">Type: {ach.type}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); editAchievement(ach); }}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteAchievement(ach.id); }}
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