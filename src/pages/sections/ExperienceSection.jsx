import React, { useState, useEffect } from "react";
import Accordion from "../components/Accordion";
import axios from "axios";

export default function ExperienceSection() {

  const [experienced, setExperienced] = useState(false);

  const [experiences, setExperiences] = useState([]);

  const [newExp, setNewExp] = useState({
    job_title: "",
    company_name: "",
    start_date: "",
    end_date: "",
    bullets: [],
    ordering_index: 0
  });

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access");

  const API_URL = "https://smartapply-7msy.onrender.com/api/me/resume/work-experience/";

  // -------- GET EXPERIENCES --------
  const fetchExperiences = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setExperiences(res.data);

    } catch (error) {
      console.log("Error fetching experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchExperiences();
    }
  }, [token]);

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

    console.log("Posting experience:", newExp);

    try {
      await axios.post(API_URL, newExp, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Experience Added Successfully");

      setNewExp({
        job_title: "",
        company_name: "",
        start_date: "",
        end_date: "",
        bullets: [],
        ordering_index: 0
      });

      fetchExperiences();

    } catch (error) {
      console.log("Add Experience Error:", error.response);
      alert("Failed to add experience");
    }
  };

  // -------- DELETE EXPERIENCE --------
  const deleteExperience = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Experience Deleted");

      fetchExperiences();

    } catch (error) {
      console.log("Delete Error:", error.response);
      alert("Failed to delete experience");
    }
  };

  /*if (!token) {
    return <p>Please login to manage experience</p>;
  }*/  

  return (
    <Accordion title="Work Experience">

      {loading ? (
        <p>Loading...</p>
      ) : (

      <div className="space-y-6">

        <div className="flex gap-6 text-white">
          <label>
            <input
              type="radio"
              name="exp"
              onChange={() => setExperienced(true)}
            /> Experienced
          </label>

          <label>
            <input
              type="radio"
              name="exp"
              onChange={() => setExperienced(false)}
            /> Fresher
          </label>
        </div>

        {experienced && (
          <>
            {/* ADD FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                name="job_title"
                value={newExp.job_title}
                onChange={handleChange}
                placeholder="Job Title"
                className="editor-input"
                required
              />

              <input
                name="company_name"
                value={newExp.company_name}
                onChange={handleChange}
                placeholder="Company Name"
                className="editor-input"
                required
              />

              <input
                type="date"
                name="start_date"
                value={newExp.start_date}
                onChange={handleChange}
                className="editor-input"
                required
              />

              <input
                type="date"
                name="end_date"
                value={newExp.end_date}
                onChange={handleChange}
                className="editor-input"
              />

              <button className="editor-btn">
                Add Experience
              </button>

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
              ))}

            </div>
          </>
        )}

      </div>

      )}

    </Accordion>
  );
}
