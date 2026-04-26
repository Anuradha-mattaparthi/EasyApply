import Accordion from "../components/Accordion";
import API from "../services/api";
import Swal from "sweetalert2";
import React, { useState, useEffect, useRef } from "react";

export default function SkillsSection() {

  const Toast = Swal.mixin({
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: "#111",
    color: "#fff",
  });

  const formRef = useRef(null);
  const nameInputRef = useRef(null);

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: "", category: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingSkillId, setEditingSkillId] = useState(null);

  const API_URL = "/api/me/resume/skills/";

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await API.get(API_URL);
      setSkills(res.data);
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.response?.data?.detail || "Failed to load skills"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleChange = (e) => {
    setNewSkill({ ...newSkill, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newSkill.name.trim()) {
      return Toast.fire({ icon: "warning", title: "Skill name is required" });
    }
    if (!newSkill.category.trim()) {
      return Toast.fire({ icon: "warning", title: "Category is required" });
    }

    try {
      setSaving(true);

      if (editingSkillId) {
        await API.patch(`${API_URL}${editingSkillId}/`, newSkill);
        Toast.fire({ icon: "success", title: "Skill updated successfully" });
      } else {
        await API.post(API_URL, newSkill);
        Toast.fire({ icon: "success", title: "Skill added successfully" });
      }

      setNewSkill({ name: "", category: "" });
      setEditingSkillId(null);
      fetchSkills();

    } catch (error) {
      const data = error.response?.data;
      const msg =
        data?.detail ||
        data?.error ||
        Object.values(data || {})?.[0]?.[0] ||
        "Failed to save skill";
      Toast.fire({ icon: "error", title: msg });
    } finally {
      setSaving(false);
    }
  };

  const editSkill = (skill) => {
    setNewSkill({ name: skill.name, category: skill.category });
    setEditingSkillId(skill.id);

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      nameInputRef.current?.focus();
    }, 100);
  };

  const cancelEdit = () => {
    setNewSkill({ name: "", category: "" });
    setEditingSkillId(null);
  };

  const deleteSkill = async (id) => {
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

    if (!result.isConfirmed) return;

    try {
      setDeletingId(id);
      await API.delete(`${API_URL}${id}/`);
      Toast.fire({ icon: "success", title: "Skill removed successfully" });
      fetchSkills();
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.response?.data?.detail || "Failed to delete skill"
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Accordion title="Skills">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">

          {/* FORM */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">

            {editingSkillId && (
              <p className="text-blue-400 text-sm font-bold animate-pulse">
                Editing Skill...
              </p>
            )}

            <input
              ref={nameInputRef}
              name="name"
              value={newSkill.name}
              onChange={handleChange}
              placeholder="Skill Name (e.g PHP)"
              autoComplete="off"
              className={`editor-input transition-all duration-300 ${
                editingSkillId ? "border-blue-500 ring-1 ring-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""
              }`}
            />

            <input
              name="category"
              value={newSkill.category}
              onChange={handleChange}
              placeholder="Category (e.g technical / soft)"
              autoComplete="off"
              className={`editor-input transition-all duration-300 ${
                editingSkillId ? "border-blue-500 ring-1 ring-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""
              }`}
            />

            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="editor-btn flex-1">
                {saving ? "Saving..." : editingSkillId ? "Update Skill" : "Add Skill"}
              </button>

              {editingSkillId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              )}
            </div>

          </form>

          {/* LIST */}
          <div>
            <h3 className="text-white mb-3">Your Skills</h3>

            {skills.length === 0 ? (
              <p>No skills added yet</p>
            ) : (
              <ul className="space-y-2">
                {skills.map((skill) => (
                  <li key={skill.id} className="flex justify-between items-center bg-[#111] p-3 rounded">
                    <span>{skill.name} — {skill.category}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); editSkill(skill); }}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteSkill(skill.id); }}
                        disabled={deletingId === skill.id}
                        className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                      >
                        {deletingId === skill.id ? "Deleting..." : "Delete"}
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