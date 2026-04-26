import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "./services/api";

export default function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    API.get(`/api/agents/dashboard/jobs/${jobId}/`)
      .then((res) => setJob(res.data))
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [jobId]);

  // Handle PDF Download with Authorization Header
  const handleDownload = async () => {
    try {
      setDownloading(true);
      // We call the specific resume endpoint defined in your API docs
      const response = await API.get(`/api/agents/dashboard/jobs/${jobId}/resume/`, {
        responseType: "blob", // Needed to handle PDF binary data
      });

      // Create a blob link to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Clean filename: resume_Company_JobTitle.pdf
      const fileName = `resume_${job.company || "job"}.pdf`.replace(/\s+/g, "_");
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      alert("Resume download failed. It may not be ready yet.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <p className="p-6 font-mono text-gray-500">Loading job details...</p>;
  if (!job) return <p className="p-6 text-red-500 font-mono">Job not found</p>;

  return (
    <div className="min-h-screen bg-[#F2F2F2] px-6 py-10 font-mono">
      <div className="max-w-5xl mx-auto">
        
        {/* 🔙 Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          ← Back to Dashboard
        </button>

        {/* HEADER */}
        <div className="bg-black text-white p-8 rounded-2xl shadow-lg mb-6 relative overflow-hidden">
          {/* Decision badge */}
          <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
            <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
              job.decision === "auto_apply" ? "bg-green-600" : 
              job.decision === "notify" ? "bg-yellow-500 text-black" : "bg-red-600"
            }`}>
              {job.decision?.replace("_", " ")}
            </span>
            {job.remote_type && (
               <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded border border-gray-700">
                 {job.remote_type}
               </span>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-2 pr-24">{job.title || "Untitled Position"}</h1>
          <p className="text-xl text-gray-400">{job.company || "Unknown Company"}</p>
          
          <div className="flex gap-4 mt-4 text-sm text-gray-500">
            <span>📍 {job.location || "Remote / Not Specified"}</span>
            {job.job_type && <span className="capitalize">💼 {job.job_type.replace("_", " ")}</span>}
          </div>

          <div className="mt-6 flex items-center gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Match Score</p>
              <p className="text-3xl font-bold text-green-400">{job.fit_score ?? "N/A"}%</p>
            </div>
            <div className="h-10 w-[1px] bg-gray-800"></div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Discovered</p>
              <p className="text-sm">{new Date(job.discovered_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 mt-8 flex-wrap">
            {job.apply_link && (
              <a
                href={job.apply_link}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors"
              >
                Apply Now
              </a>
            )}

            {job.source_url && (
              <a
                href={job.source_url}
                target="_blank"
                rel="noreferrer"
                className="border border-gray-700 hover:bg-gray-900 px-6 py-2.5 rounded-lg text-sm transition-colors"
              >
                View Source
              </a>
            )}

            {/* 📄 Authenticated Resume Download */}
            {job.resume_generated && (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="bg-green-600 hover:bg-green-700 px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50 transition-all"
              >
                {downloading ? (
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                )}
                {downloading ? "Generating..." : "Download Tailored Resume"}
              </button>
            )}
          </div>

          {job.decision_reason && (
             <p className="mt-4 text-xs text-gray-500 italic">
               Reason: {job.decision_reason}
             </p>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* DESCRIPTION */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                Job Description
              </h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {job.description || "No description available"}
              </p>
            </div>

            {/* REQUIREMENTS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-purple-600 rounded-full"></span>
                Key Requirements
              </h2>
              {job.requirements?.length ? (
                <ul className="space-y-2">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-700">
                      <span className="text-blue-500 font-bold">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm italic">No specific requirements listed.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* 📊 SCORE BREAKDOWN */}
            {job.score_breakdown && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold mb-4">AI Analysis</h2>
                {Object.entries(job.score_breakdown).map(([key, value]) => (
                  <div key={key} className="mb-4 last:mb-0">
                    <div className="flex justify-between text-xs uppercase tracking-tighter mb-1 text-gray-500">
                      <span>{key.replace("_", " ")}</span>
                      <span className="font-bold text-gray-900">{value}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-1000 ${
                          value > 70 ? "bg-green-500" : value > 40 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SKILLS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="font-bold mb-3 text-sm flex items-center gap-2 text-green-700">
                Matching Skills
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {job.matching_skills?.length ? (
                  job.matching_skills.map((s, i) => (
                    <span key={i} className="bg-green-50 text-green-700 px-2.5 py-1 text-[10px] font-bold rounded uppercase border border-green-100">
                      {s}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400 text-xs italic">No matching skills identified.</p>
                )}
              </div>

              <h3 className="font-bold mb-3 text-sm flex items-center gap-2 text-red-700">
                Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.missing_skills?.length ? (
                  job.missing_skills.map((s, i) => (
                    <span key={i} className="bg-red-50 text-red-700 px-2.5 py-1 text-[10px] font-bold rounded uppercase border border-red-100">
                      {s}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400 text-xs italic">No missing skills identified.</p>
                )}
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="bg-gray-900 text-gray-400 p-6 rounded-2xl shadow-sm text-xs space-y-3">
              <div className="flex justify-between">
                <span>Application Status</span>
                <span className={job.applied ? "text-green-400" : "text-yellow-500"}>
                  {job.applied ? "✓ Applied" : "Pending"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Resume Tailored</span>
                <span className={job.resume_generated ? "text-green-400" : "text-gray-600"}>
                  {job.resume_generated ? "Yes" : "No"}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-800 text-[10px] text-gray-600 truncate">
                Job ID: {job.job_id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}