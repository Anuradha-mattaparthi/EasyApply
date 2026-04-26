import React, { useState, useEffect, useRef } from "react";
import Accordion from "../components/Accordion";
import API from "../services/api";
import Swal from "sweetalert2";

export default function ProjectSection() {

  const [projects, setProjects] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const formRef = useRef(null);

  const [newProject, setNewProject] = useState({
    title: "",
    tech_stack: "",
    bullets: "",
    ordering_index: 0
  });

  const [loading, setLoading] = useState(false);

  const API_URL = "/api/me/resume/projects/";

  const Toast = Swal.mixin({
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: "#111",
    color: "#fff",
  });

  // ----------- GET PROJECTS -----------
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await API.get(API_URL);
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      Toast.fire({ icon: "error", title: "Failed to load projects" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ----------- HANDLE CHANGE -----------
  const handleChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  // ----------- RESET FORM -----------
  const resetForm = () => {
    setNewProject({ title: "", tech_stack: "", bullets: "", ordering_index: 0 });
    setEditingProjectId(null);
  };

  // ----------- EDIT -----------
  const editProject = (project) => {
    setNewProject({
      title: project.title,
      tech_stack: project.tech_stack?.join(", ") || "",
      bullets: project.bullets?.join("\n") || "",
      ordering_index: project.ordering_index || 0
    });
    setEditingProjectId(project.id);

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // ----------- SUBMIT (CREATE / UPDATE) -----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!newProject.title.trim()) {
      return Toast.fire({ icon: "warning", title: "Project title is required" });
    }
    if (!newProject.tech_stack.trim()) {
      return Toast.fire({ icon: "warning", title: "Tech stack is required" });
    }
    if (!newProject.bullets.trim()) {
      return Toast.fire({ icon: "warning", title: "At least one project point is required" });
    }

    const payload = {
      title: newProject.title,
      tech_stack: newProject.tech_stack
        ? newProject.tech_stack.split(",").map(t => t.trim()).filter(Boolean)
        : [],
      bullets: newProject.bullets
        ? newProject.bullets.split("\n").filter(Boolean)
        : [],
      ordering_index: newProject.ordering_index || 0
    };

    try {
      if (editingProjectId) {
        await API.patch(`${API_URL}${editingProjectId}/`, payload);
        Toast.fire({ icon: "success", title: "Project updated successfully" });
      } else {
        await API.post(API_URL, payload);
        Toast.fire({ icon: "success", title: "Project added successfully" });
      }

      resetForm();
      fetchProjects();

    } catch (error) {
      console.error("Save Project Error:", error);
      const msg = error.response?.data?.detail || "Failed to save project";
      Toast.fire({ icon: "error", title: msg });
    }
  };

  // ----------- DELETE -----------
  const deleteProject = async (id) => {
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
        Toast.fire({ icon: "success", title: "Project removed successfully" });
        fetchProjects();
      } catch (error) {
        console.error("Delete Error:", error);
        Toast.fire({ icon: "error", title: "Failed to delete project" });
      }
    }
  };

  return (
    <Accordion title="Projects">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">

          {/* FORM */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">

            {editingProjectId && (
              <p className="text-blue-400 text-sm font-bold animate-pulse">
                Editing Project...
              </p>
            )}

            <input
              name="title"
              value={newProject.title}
              onChange={handleChange}
              placeholder="Project Title"
              autoComplete="off"
              className={`editor-input transition-all duration-300 ${
                editingProjectId ? "border-blue-500 ring-1 ring-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""
              }`}
            />

            <input
              name="tech_stack"
              value={newProject.tech_stack}
              onChange={handleChange}
              placeholder="Tech Stack (comma separated e.g React, Node, PHP)"
              autoComplete="off"
              className={`editor-input transition-all duration-300 ${
                editingProjectId ? "border-blue-500 ring-1 ring-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""
              }`}
            />

            <textarea
              name="bullets"
              value={newProject.bullets}
              onChange={handleChange}
              placeholder="Project points (one per line)"
              className={`editor-textarea transition-all duration-300 ${
                editingProjectId ? "border-blue-500 ring-1 ring-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""
              }`}
            />

            <div className="flex gap-2">
              <button className="editor-btn flex-1">
                {editingProjectId ? "Update Project" : "Add Project"}
              </button>

              {editingProjectId && (
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

          {/* PROJECT LIST */}
          <div>
            <h3 className="text-white mb-3">Your Projects</h3>

            {projects.length === 0 ? (
              <p>No projects added yet</p>
            ) : (
              <ul className="space-y-3">
                {projects.map((project) => (
                  <li key={project.id} className="bg-[#111] p-4 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold">{project.title}</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); editProject(project); }}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
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
                      <ul className="list-disc text-sm text-gray-300 break-all whitespace-pre-wrap mt-1 ml-4">
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