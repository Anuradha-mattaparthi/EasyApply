import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "./services/api";
export default function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/api/agents/dashboard/jobs/${jobId}/`)
      .then(res => setJob(res.data))
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!job) return <p className="p-6 text-red-500">Job not found</p>;

  return (
    <div className="min-h-screen bg-[#F2F2F2] px-6 py-10 font-mono">
      <div className="max-w-5xl mx-auto">

        {/* 🔙 Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-blue-600 hover:underline"
        >
          ← Back
        </button>

        {/* HEADER */}
        <div className="bg-black text-white p-6 rounded-2xl shadow-lg mb-6 relative">

          {/* Decision badge */}
          <span className={`absolute top-4 right-4 text-xs px-2 py-1 rounded ${
            job.decision === "auto_apply"
              ? "bg-green-600"
              : job.decision === "notify"
              ? "bg-yellow-500"
              : "bg-red-600"
          }`}>
            {job.decision}
          </span>

          <h1 className="text-2xl font-semibold mb-2">
            {job.title || "No title"}
          </h1>

          <p className="text-gray-400">
            {job.company || "Unknown company"}
          </p>

          <p className="text-gray-500 text-sm">
            {job.location || "Not specified"}
          </p>

          <p className="mt-3">
            Score: <span className="font-semibold">{job.fit_score ?? "N/A"}</span>
          </p>

          <p className="text-xs text-gray-500 mt-1">
            {new Date(job.discovered_at).toLocaleString()}
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 mt-4 flex-wrap">

            {job.apply_link && (
              <a
                href={job.apply_link}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
              >
                Apply Now
              </a>
            )}

            {job.source_url && (
              <a
                href={job.source_url}
                target="_blank"
                rel="noreferrer"
                className="border border-gray-600 px-4 py-2 rounded text-sm"
              >
                View Source
              </a>
            )}

            {/* 📄 Resume download */}
            {job.resume_generated && job.resume_download_url && (
              <a
                href={job.resume_download_url}
                target="_blank"
                rel="noreferrer"
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
              >
                Download Resume
              </a>
            )}
          </div>

          {/* ✅ Apply status */}
          <p className="mt-3 text-sm">
            Status:{" "}
            <span className={job.applied ? "text-green-400" : "text-gray-400"}>
              {job.applied ? "Applied" : "Not Applied"}
            </span>
          </p>

        </div>

        {/* 📊 SCORE BREAKDOWN */}
        {job.score_breakdown && (
          <div className="bg-white p-6 rounded-2xl shadow mb-6">
            <h2 className="text-lg font-semibold mb-3">Score Breakdown</h2>

            {Object.entries(job.score_breakdown).map(([key, value]) => (
              <div key={key} className="mb-3">
                <div className="flex justify-between text-sm">
                  <span>{key.replace("_", " ")}</span>
                  <span>{value}%</span>
                </div>

                <div className="w-full bg-gray-300 rounded h-2 mt-1">
                  <div
                    className="bg-green-500 h-2 rounded"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DESCRIPTION */}
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-3">Description</h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {job.description || "No description available"}
          </p>
        </div>

        {/* REQUIREMENTS */}
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-3">Requirements</h2>
          {job.requirements?.length ? (
            <ul className="list-disc pl-5 text-sm">
              {job.requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No requirements listed</p>
          )}
        </div>

        {/* SKILLS */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-semibold mb-2">Matching Skills</h3>
            {job.matching_skills?.length ? (
              job.matching_skills.map((s, i) => (
                <span key={i} className="inline-block bg-green-100 text-green-700 px-2 py-1 mr-2 mb-2 text-xs rounded">
                  {s}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">None</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-semibold mb-2">Missing Skills</h3>
            {job.missing_skills?.length ? (
              job.missing_skills.map((s, i) => (
                <span key={i} className="inline-block bg-red-100 text-red-700 px-2 py-1 mr-2 mb-2 text-xs rounded">
                  {s}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">None</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}