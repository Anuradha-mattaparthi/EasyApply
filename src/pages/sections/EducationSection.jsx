import React, { useState, useEffect } from "react";
import Accordion from "../components/Accordion";
import API from "../services/api";
import Swal from "sweetalert2";

export default function EducationSection() {

  const [editingEduId, setEditingEduId] = useState(null);

  const [educations, setEducations] = useState([]);

  const [newEdu, setNewEdu] = useState({
    degree: "",
    institution: "",
    graduation_year: "",
    cgpa: "",
    ordering_index: 0
  });

  const [loading, setLoading] = useState(false);

  const API_URL = "/api/me/resume/education/";

  // ----------- GET EDUCATION LIST -----------
  const fetchEducations = async () => {
    try {
      setLoading(true);

      const res = await API.get(API_URL);

      setEducations(res.data);

    } catch (error) {
      console.log("Error fetching education:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to load education details",
        icon: "error",
        confirmButtonText: "OK"
      });

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  // ----------- HANDLE CHANGE -----------
  const handleChange = (e) => {
    setNewEdu({
      ...newEdu,
      [e.target.name]: e.target.value
    });
  };
  const editEducation = (edu) => {
    setNewEdu({
      degree: edu.degree,
      institution: edu.institution,
      graduation_year: edu.graduation_year,
      cgpa: edu.cgpa || "",
      ordering_index: edu.ordering_index || 0
    });
  
    setEditingEduId(edu.id);
  };
  
  // ----------- ADD EDUCATION (POST) -----------
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (editingEduId) {
        // PATCH (UPDATE)
        await API.patch(`${API_URL}${editingEduId}/`, newEdu);
  
        Swal.fire({
          title: "Updated!",
          text: "Education updated successfully",
          icon: "success"
        });
      } else {
        // POST (CREATE)
        await API.post(API_URL, newEdu);
  
        Swal.fire({
          title: "Success!",
          text: "Education added successfully",
          icon: "success"
        });
      }
  
      setNewEdu({
        degree: "",
        institution: "",
        graduation_year: "",
        cgpa: "",
        ordering_index: 0
      });
  
      setEditingEduId(null);
      fetchEducations();
  
    } catch (error) {
      console.log("Save Education Error:", error);
  
      Swal.fire({
        title: "Error!",
        text: "Failed to save education",
        icon: "error"
      });
    }
  };
  

  // ----------- DELETE EDUCATION -----------
  const deleteEducation = async (id) => {
    try {
      await API.delete(`${API_URL}${id}/`);

      Swal.fire({
        title: "Deleted!",
        text: "Education removed successfully",
        icon: "success",
        confirmButtonText: "OK"
      });

      fetchEducations();

    } catch (error) {
      console.log("Delete Error:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to delete education",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  return (
    <Accordion title="Education">

      {loading ? (
        <p>Loading...</p>
      ) : (

      <div className="space-y-6">

        {/* ADD EDUCATION FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="degree"
            value={newEdu.degree}
            onChange={handleChange}
            placeholder="Degree (e.g B.Tech, MCA)"
            className="editor-input"
            required
          />

          <input
            name="institution"
            value={newEdu.institution}
            onChange={handleChange}
            placeholder="Institution Name"
            className="editor-input"
            required
          />

          <input
            name="graduation_year"
            type="number"
            value={newEdu.graduation_year}
            onChange={handleChange}
            placeholder="Graduation Year"
            className="editor-input"
            required
          />

          <input
            name="cgpa"
            value={newEdu.cgpa}
            onChange={handleChange}
            placeholder="CGPA / Percentage (optional)"
            className="editor-input"
          />

          <button className="editor-btn">
            {editingEduId ? "Update Education" : "Add Education"}
          </button>


        </form>

        {/* EDUCATION LIST */}
        <div>
          <h3 className="text-white mb-3">Your Education</h3>

          {educations.length === 0 ? (
            <p>No education details added yet</p>
          ) : (
            <ul className="space-y-3">

              {educations.map((edu) => (
                <li
                  key={edu.id}
                  className="bg-[#111] p-4 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{edu.degree}</p>
                    <p>{edu.institution}</p>
                    <p className="text-sm">
                      {edu.graduation_year} {edu.cgpa && `- CGPA: ${edu.cgpa}`}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => editEducation(edu)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteEducation(edu.id)}
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
