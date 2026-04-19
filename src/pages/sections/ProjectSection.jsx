import React, { useState, useEffect } from "react";
import Accordion from "../components/Accordion";
import API from "../services/api";
import Swal from "sweetalert2";

export default function ProjectSection() {

  const [projects, setProjects] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(null);


  const [newProject, setNewProject] = useState({
    title: "",
    tech_stack: "",
    bullets: "",
    ordering_index: 0
  });

  const [loading, setLoading] = useState(false);

  const API_URL = "/api/me/resume/projects/";

  // ----------- GET PROJECTS -----------
  const fetchProjects = async () => {
    try {
      setLoading(true);

      const res = await API.get(API_URL);

      setProjects(res.data);

    } catch (error) {
      console.log("Error fetching projects:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to load projects",
        icon: "error",
        confirmButtonText: "OK"
      });

    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchProjects();
  }, []);

  // ----------- HANDLE CHANGE -----------
  const handleChange = (e) => {
    setNewProject({
      ...newProject,
      [e.target.name]: e.target.value
    });
  };
  const editProject = (project) => {
    setNewProject({
      title: project.title,
      tech_stack: project.tech_stack?.join(", ") || "",
      bullets: project.bullets?.join("\n") || "",
      ordering_index: project.ordering_index || 0
    });
  
    setEditingProjectId(project.id);
  };
  
  // ----------- POST (CREATE PROJECT) -----------
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      title: newProject.title,
      tech_stack: newProject.tech_stack
        ? newProject.tech_stack.split(",").map(t => t.trim())
        : [],
      bullets: newProject.bullets
        ? newProject.bullets.split("\n").filter(Boolean)
        : [],
      ordering_index: 0
    };
  
    try {
      if (editingProjectId) {
        // PATCH (UPDATE)
        await API.patch(`${API_URL}${editingProjectId}/`, payload);
  
        Swal.fire({
          title: "Updated!",
          text: "Project updated successfully",
          icon: "success"
        });
      } else {
        // POST (CREATE)
        await API.post(API_URL, payload);
  
        Swal.fire({
          title: "Success!",
          text: "Project added successfully",
          icon: "success"
        });
      }
  
      setNewProject({
        title: "",
        tech_stack: "",
        bullets: "",
        ordering_index: 0
      });
  
      setEditingProjectId(null);
      fetchProjects();
  
    } catch (error) {
      console.log("Save Project Error:", error);
  
      Swal.fire({
        title: "Error!",
        text: "Failed to save project",
        icon: "error"
      });
    }
  };
  

  // ----------- DELETE PROJECT -----------
  const deleteProject = async (id) => {
    try {
      await API.delete(`${API_URL}${id}/`);

      Swal.fire({
        title: "Deleted!",
        text: "Project removed successfully",
        icon: "success",
        confirmButtonText: "OK"
      });

      fetchProjects();

    } catch (error) {
      console.log("Delete Error:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to delete project",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  return (
    <Accordion title="Projects">

      {loading ? (
        <p>Loading...</p>
      ) : (

      <div className="space-y-6">

        {/* ADD PROJECT FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="title"
            value={newProject.title}
            onChange={handleChange}
            placeholder="Project Title"
            className="editor-input"
            required
          />

          <input
            name="tech_stack"
            value={newProject.tech_stack}
            onChange={handleChange}
            placeholder="Tech Stack (comma separated e.g React,Node,PHP)"
            className="editor-input"
          />

          <textarea
            name="bullets"
            value={newProject.bullets}
            onChange={handleChange}
            placeholder="Project points (one per line)"
            className="editor-textarea"
          />

          <button className="editor-btn">
            {editingProjectId ? "Update Project" : "Add Project"}
          </button>


        </form>

        {/* PROJECT LIST */}
        <div>
          <h3 className="text-white mb-3">Your Projects</h3>

          {projects.length === 0 ? (
            <p>No projects added yet</p>
          ) : (
            <ul className="space-y-3">

              {projects.map((project) => (
                <li
                  key={project.id}
                  className="bg-[#111] p-4 rounded"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold">{project.title}</h4>

                    <div className="flex gap-2">
                        <button
                          onClick={() => editProject(project)}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteProject(project.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                    </div>

                  </div>

                  {project.tech_stack?.length > 0 && (
                    <p className="text-sm text-gray-400">
                      Tech: {project.tech_stack.join(", ")}
                    </p>
                  )}

                  {project.bullets?.length > 0 && (
                    <ul className="list-disc text-sm text-gray-300 break-all whitespace-pre-wrap mt-1">
                      {project.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
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
