import React, { useState, useEffect } from "react";
import Accordion from "../components/Accordion";
import API from "../services/api";
import Swal from "sweetalert2";

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

  const API_URL = "/api/me/resume/work-experience/";

  // -------- GET EXPERIENCES --------
  const fetchExperiences = async () => {
    try {
      setLoading(true);

      const res = await API.get(API_URL);

      setExperiences(res.data);

    } catch (error) {
      console.log("Error fetching experiences:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to load experiences",
        icon: "error",
        confirmButtonText: "OK"
      });

    } finally {
      setLoading(false);
    }
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

    try {
      await API.post(API_URL, newExp);

      Swal.fire({
        title: "Success!",
        text: "Experience Added Successfully",
        icon: "success",
        confirmButtonText: "OK"
      });

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
      console.log("Add Experience Error:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to add experience",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  // -------- DELETE EXPERIENCE --------
  const deleteExperience = async (id) => {
    try {
      await API.delete(`${API_URL}${id}/`);

      Swal.fire({
        title: "Deleted!",
        text: "Experience removed successfully",
        icon: "success",
        confirmButtonText: "OK"
      });

      fetchExperiences();

    } catch (error) {
      console.log("Delete Error:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to delete experience",
        icon: "error",
        confirmButtonText: "OK"
      });
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
