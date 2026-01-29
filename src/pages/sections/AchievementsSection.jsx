import React, { useState, useEffect } from "react";
import Accordion from "../components/Accordion";
import API from "../services/api";
import Swal from "sweetalert2";

export default function AchievementsSection() {

  const [achievements, setAchievements] = useState([]);

  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
    year: "",
    type: "other",
    ordering_index: 0
  });

  const [loading, setLoading] = useState(false);

  const API_URL = "/api/me/resume/achievements/";

  // ----------- GET ACHIEVEMENTS -----------
  const fetchAchievements = async () => {
    try {
      setLoading(true);

      const res = await API.get(API_URL);

      setAchievements(res.data);

    } catch (error) {
      console.log("Error fetching achievements:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to load achievements",
        icon: "error",
        confirmButtonText: "OK"
      });

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  // ----------- HANDLE CHANGE -----------
  const handleChange = (e) => {
    setNewAchievement({
      ...newAchievement,
      [e.target.name]: e.target.value
    });
  };

  // ----------- ADD ACHIEVEMENT (POST) -----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post(API_URL, newAchievement);

      Swal.fire({
        title: "Success!",
        text: "Achievement Added Successfully",
        icon: "success",
        confirmButtonText: "OK"
      });

      setNewAchievement({
        title: "",
        description: "",
        year: "",
        type: "other",
        ordering_index: 0
      });

      fetchAchievements();

    } catch (error) {
      console.log("Error adding achievement:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to add achievement",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  // ----------- DELETE ACHIEVEMENT -----------
  const deleteAchievement = async (id) => {
    try {
      await API.delete(`${API_URL}${id}/`);

      Swal.fire({
        title: "Deleted!",
        text: "Achievement removed successfully",
        icon: "success",
        confirmButtonText: "OK"
      });

      fetchAchievements();

    } catch (error) {
      console.log("Delete Error:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to delete achievement",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  return (
    <Accordion title="Achievements">

      {loading ? (
        <p>Loading...</p>
      ) : (

      <div className="space-y-6">

        {/* ADD ACHIEVEMENT FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="title"
            value={newAchievement.title}
            onChange={handleChange}
            placeholder="Achievement Title"
            className="editor-input"
            required
          />

          <textarea
            name="description"
            value={newAchievement.description}
            onChange={handleChange}
            placeholder="Description (optional)"
            className="editor-textarea"
          />

          <input
            name="year"
            type="number"
            value={newAchievement.year}
            onChange={handleChange}
            placeholder="Year (optional)"
            className="editor-input"
          />

          <select
            name="type"
            value={newAchievement.type}
            onChange={handleChange}
            className="editor-input"
          >
            <option value="award">Award</option>
            <option value="recognition">Recognition</option>
            <option value="certificate">Certificate</option>
            <option value="other">Other</option>
          </select>

          <button className="editor-btn">
            Add Achievement
          </button>

        </form>

        {/* ACHIEVEMENTS LIST */}
        <div>
          <h3 className="text-white mb-3">Your Achievements</h3>

          {achievements.length === 0 ? (
            <p>No achievements added yet</p>
          ) : (
            <ul className="space-y-3">

              {achievements.map((ach) => (
                <li
                  key={ach.id}
                  className="bg-[#111] p-4 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{ach.title}</p>

                    {ach.description && (
                      <p className="text-sm">{ach.description}</p>
                    )}

                    {ach.year && (
                      <p className="text-sm">Year: {ach.year}</p>
                    )}

                    {ach.type && (
                      <p className="text-xs text-gray-400">
                        Type: {ach.type}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteAchievement(ach.id)}
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
