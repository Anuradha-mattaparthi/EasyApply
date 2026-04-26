import React from "react";
import { Link } from "react-router-dom";
import API, { logout } from "./services/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Dashboard() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [status, setStatus] = useState("idle");
  const [lastRun, setLastRun] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("auto_apply");
  const filteredJobs = jobs.filter(j => j.decision === activeTab);
  const [openMenu, setOpenMenu] = useState(false);
  const [userName, setUserName] = useState("");
  const [seconds, setSeconds] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    let interval;
  
    if (status === "running") {
      setSeconds(0); // reset when starting
  
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  
  useEffect(() => {
    API.get("/api/agents/toggle/")
    .then(res => {
      setIsEnabled(res.data.is_enabled);
      setLastRun(res.data.last_triggered_at);
    })
  .catch(() => setStatus("error"));

  API.get("/api/agents/dashboard/jobs/")
  .then(res => {
    setJobs(res.data.jobs);
  })
  .catch(() => setStatus("error"));
  API.get("/api/me/resume/header/")
  .then(res => {
    setUserName(res.data.full_name);
  })
  .catch(() => setUserName("User"));
  }, []);


  async function handleToggle(newValue) {
    if (newValue) {
      setIsEnabled(true);
      setStatus("running");
  
      try {
        await API.post("/api/agents/toggle/", { enabled: true });
        setStatus("done");
        setLastRun(new Date().toISOString());
        
        // ✅ Success Toast
        Toast.fire({ icon: "success", title: "Job search enabled 🚀" });
        
      } catch (err) {
        setIsEnabled(false);
        setStatus("error");
        Toast.fire({ icon: "error", title: "Failed to enable agent" });
      }
    } else {
      setIsEnabled(false);
      setStatus("idle");
  
      try {
        await API.post("/api/agents/toggle/", { enabled: false });
        
        // ✅ Disabled Toast
        Toast.fire({ icon: "info", title: "Job search disabled" });
      } catch (err) {
        Toast.fire({ icon: "error", title: "Failed to disable agent" });
      }
    }
  }

const autoApply = jobs.filter(j => j.decision === "auto_apply");
const notify = jobs.filter(j => j.decision === "notify");
const rejected = jobs.filter(j => j.decision === "rejected");
const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  background: "#0B0B0B",
  color: "#ffffff",
});
  return (
    <div className="min-h-screen bg-[#F2F2F2] font-mono px-6 py-16">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-14">
        <div>
          <h1 className="text-3xl font-semibold text-[#1A1A1A]">
            Welcome {userName || "User"} 👋
          </h1>
          <p className="mt-1 text-gray-600 text-sm">
              Here are your job search results
          </p>
       
        </div>

          {/* Basic Details Link */}
          <div className="flex items-center gap-6">

              {/* SmartApply Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="text-sm text-gray-600">Job Search</span>

                <div
                  onClick={() => status !== "running" && handleToggle(!isEnabled)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                    isEnabled ? "bg-green-500" : "bg-gray-400"
                  } ${status === "running" ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                      isEnabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </div>
              </label>
              <div className="flex flex-col items-end text-xs mt-2">

                    {status === "running" && (
                      <p className="text-blue-600">
                        Running pipeline... {seconds} sec
                      </p>
                    )}

                    {status === "done" && (
                      <p className="text-green-600">
                        Jobs updated
                      </p>
                    )}

                    {status === "error" && (
                      <p className="text-red-600">
                        Something went wrong
                      </p>
                    )}

                    {lastRun && status !== "running" && (
                      <p className="text-gray-500">
                        Last run: {new Date(lastRun).toLocaleString()}
                      </p>
                    )}

              </div>
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenMenu(!openMenu)}
                  className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                >
                  My Account ▾
                </button>

                {openMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-black text-white rounded-lg shadow-lg overflow-hidden z-50">
                    
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-800"
                    >
                      Resume Editor
                    </Link>

                    <Link
                      to="/preview"
                      className="block px-4 py-2 hover:bg-gray-800"
                    >
                      Preview Resume
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 hover:bg-red-600"
                    >
                      Logout
                    </button>

                  </div>
                )}
              </div>

          </div>
        </div>

        <div className="mt-12">

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("auto_apply")}
              className={`px-4 py-2 rounded ${
                activeTab === "auto_apply"
                  ? "bg-black text-white"
                  : "bg-black text-gray-400"
              }`}
            >
              Recommended Jobs ({autoApply.length})
            </button>

            <button
              onClick={() => setActiveTab("notify")}
              className={`px-4 py-2 rounded ${
                activeTab === "notify"
                  ? "bg-black text-white"
                  : "bg-black text-gray-400"
              }`}
            >
              Emails ({notify.length})
            </button>

            <button
              onClick={() => setActiveTab("rejected")}
              className={`px-4 py-2 rounded ${
                activeTab === "rejected"
                  ? "bg-black text-white"
                  : "bg-black text-gray-400"
              }`}
            >
              Rejected Jobs ({rejected.length})
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
              {filteredJobs.length === 0 ? (
                <p className="text-gray-500">No jobs found</p>
              ) : (
                filteredJobs.map(job => (
                  <div
                    key={job.job_id}
                    className="bg-black text-white p-5 rounded-2xl shadow-lg flex flex-col justify-between h-full"
                  >
                    <div>
                      <h3 className="text-lg font-semibold">
                        {job.title || "No title"}
                      </h3>

                      <p className="text-sm text-gray-400">
                        {job.company || "Unknown company"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {job.location || "Not specified"}
                      </p>

                      <p className="text-sm mt-2">
                        Score: {job.fit_score ?? "N/A"}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(job.discovered_at).toLocaleString()}
                      </p>
                    </div>

                    <button
                    onClick={() => navigate(`/jobs/${job.job_id}`)}
                    className="mt-4 w-fit bg-blue-600 text-white hover:bg-blue-700 text-xs px-4 py-1.5 rounded-md transition self-center"
                  >
                    View More
                  </button>
                  </div>
                ))
              )}
          </div>
        </div>
          {/* Jobs List */}




      </div>
    </div>
  );
}
