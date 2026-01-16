import React, { useState, useEffect } from "react";
import Accordion from "../components/Accordion";
import axios from "axios";

export default function SkillsSection() {

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    name: "",
    category: ""
  });

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access");

  const API_URL = "https://smartapply-7msy.onrender.com/api/me/resume/skills/";

  // ----------- GET SKILLS -----------
  const fetchSkills = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSkills(res.data);

    } catch (error) {
      console.log("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSkills();
    }
  }, [token]);

  // ----------- HANDLE CHANGE -----------
  const handleChange = (e) => {
    setNewSkill({
      ...newSkill,
      [e.target.name]: e.target.value
    });
  };

  // ----------- POST (CREATE SKILL) -----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API_URL, newSkill, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Skill Added Successfully");

      setNewSkill({ name: "", category: "" });

      fetchSkills();

    } catch (error) {
      console.log("Error creating skill:", error.response);
      alert("Failed to add skill");
    }
  };

  // ----------- DELETE SKILL -----------
  const deleteSkill = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Skill Deleted");

      fetchSkills();

    } catch (error) {
      console.log("Delete Error:", error.response);
      alert("Failed to delete skill");
    }
  };

  if (!token) {
    return <p>Please login to manage skills</p>;
  }

  return (
    <Accordion title="Skills">

      {loading ? (
        <p>Loading...</p>
      ) : (

      <div className="space-y-6">

        {/* ADD SKILL FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            value={newSkill.name}
            onChange={handleChange}
            placeholder="Skill Name (e.g PHP)"
            className="editor-input"
          />

          <input
            name="category"
            value={newSkill.category}
            onChange={handleChange}
            placeholder="Category (technical / soft)"
            className="editor-input"
          />

          <button className="editor-btn">
            Add Skill
          </button>

        </form>

        {/* SKILLS LIST */}
        <div>
          <h3 className="text-white mb-3">Your Skills</h3>

          {skills.length === 0 ? (
            <p>No skills added yet</p>
          ) : (
            <ul className="space-y-2">

              {skills.map((skill) => (
                <li
                  key={skill.id}
                  className="flex justify-between items-center bg-[#111] p-3 rounded"
                >
                  <span>
                    {skill.name} - {skill.category}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSkill(skill.id);
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

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
