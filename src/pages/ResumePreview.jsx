import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "./services/api";

export default function ResumePreview() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState(null);
  const [summary, setSummary] = useState(null);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [educations, setEducations] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [
          headerRes, summaryRes, skillsRes, expRes,
          projRes, eduRes, certRes, achRes
        ] = await Promise.all([
          API.get("/api/me/resume/header/").catch(() => ({ data: null })),
          API.get("/api/me/resume/summary/").catch(() => ({ data: null })),
          API.get("/api/me/resume/skills/").catch(() => ({ data: [] })),
          API.get("/api/me/resume/work-experience/").catch(() => ({ data: [] })),
          API.get("/api/me/resume/projects/").catch(() => ({ data: [] })),
          API.get("/api/me/resume/education/").catch(() => ({ data: [] })),
          API.get("/api/me/resume/certifications/").catch(() => ({ data: [] })),
          API.get("/api/me/resume/achievements/").catch(() => ({ data: [] }))
        ]);

        setHeader(headerRes.data);
        setSummary(summaryRes.data);
        setSkills(skillsRes.data || []);
        setExperiences(expRes.data || []);
        setProjects(projRes.data || []);
        setEducations(eduRes.data || []);
        setCertifications(certRes.data || []);
        setAchievements(achRes.data || []);
      } catch (error) {
        console.log("Error loading preview:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const hasNoData =
    !header && !summary?.summary_text && skills.length === 0 &&
    experiences.length === 0 && projects.length === 0 &&
    educations.length === 0 && certifications.length === 0 &&
    achievements.length === 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F2F2F2] font-mono">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563EB] mb-4"></div>
        <p className="text-[#5A5A5A]">Fetching your resume data...</p>
      </div>
    );
  }

  if (hasNoData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F2F2F2] font-mono px-6 text-center">
        <h2 className="text-2xl font-medium text-[#1A1A1A] mb-2">Resume is Empty</h2>
        <p className="text-[#5A5A5A] mb-8">Please fill out your details to see a preview.</p>
        <Link to="/profile" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
          Go to Resume Editor
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F2F2F2] min-h-screen pb-20 pt-6 font-mono">
      {/* Navigation Toolbar */}
      <div className="max-w-5xl mx-auto px-6 mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="bg-black text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-all"
        >
          ← Back
        </button>
        <Link to="/profile" className="bg-black text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-all">
          Resume Editor →
        </Link>
      </div>

      {/* Resume Document Paper */}
      <div className="max-w-[8.5in] mx-auto bg-white shadow-lg p-12 text-[#111] font-sans overflow-hidden">
        
        {/* HEADER SECTION */}
        {header && (
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight uppercase mb-1">{header.full_name}</h1>
            <div className="text-sm flex flex-wrap justify-center gap-x-2 text-gray-700">
              {header.email && <span>{header.email}</span>}
              {header.phone && <span>| {header.phone}</span>}
              {(header.location_city || header.location_country) && (
                <span>| {header.location_city}{header.location_city && ", "}{header.location_country}</span>
              )}
            </div>
            <div className="w-full border-b border-gray-300 mt-4 mb-2"></div>
          </div>
        )}

        {/* PROFESSIONAL SUMMARY */}
        {summary?.summary_text && (
          <section className="mb-6">
            <h2 className="text-md font-bold uppercase border-b border-gray-800 mb-2">Professional Summary</h2>
            <p className="text-sm leading-relaxed text-justify break-words">
              {summary.summary_text}
            </p>
          </section>
        )}

        {/* SKILLS SECTION */}
        {skills.length > 0 && (
          <section className="mb-6">
            {/* Section Heading */}
            <h2 className="text-md font-bold uppercase border-b border-gray-800 mb-2">
              Skills
            </h2>
            
            <div className="text-sm space-y-1">
              {Object.entries(
                skills.reduce((acc, s) => {
                  // 1. Capitalize first letter of category and default to "Technical"
                  const rawCategory = s.category || "Technical";
                  const category = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1);
                  
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(s.name);
                  return acc;
                }, {})
              ).map(([category, names]) => (
                <div key={category} className="leading-tight">
                  {/* 2. Render with bullet point and bold category with First letter capital */}
                  <span className="font-bold">• {category}: </span>
                  <span className="text-gray-900">{names.join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* WORK EXPERIENCE */}
        {experiences.length > 0 && (
          <section className="mb-6">
            <h2 className="text-md font-bold uppercase border-b border-gray-800 mb-2">Work Experience</h2>
            {experiences.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm">{exp.job_title}</h3>
                  <span className="text-xs font-medium">
                    {exp.start_date} — {exp.end_date || "Present"}
                  </span>
                </div>
                <p className="text-sm italic text-gray-700">{exp.company_name}</p>
              </div>
            ))}
          </section>
        )}

        {/* PROJECTS SECTION */}
        {projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-md font-bold uppercase border-b border-gray-800 mb-2">Projects</h2>
            {projects.map((p) => (
              <div key={p.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm break-words">{p.title}</h3>
                </div>
                {p.tech_stack?.length > 0 && (
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    Tech: {p.tech_stack.join(", ")}
                  </p>
                )}
                {p.bullets?.length > 0 && (
                  <ul className="list-disc ml-5 text-sm space-y-1">
                    {p.bullets.map((b, i) => (
                      <li key={i} className="break-words">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* EDUCATION SECTION */}
        {educations.length > 0 && (
          <section className="mb-6">
            <h2 className="text-md font-bold uppercase border-b border-gray-800 mb-2">Education</h2>
            {educations.map((e) => (
              <div key={e.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm">{e.degree}</h3>
                  <span className="text-xs">{e.graduation_year}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <p className="text-sm italic">{e.institution}</p>
                  {e.cgpa && <span className="text-xs">CGPA: {e.cgpa}</span>}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-md font-bold uppercase border-b border-gray-800 mb-2">Certifications</h2>
            <div className="grid grid-cols-1 gap-2">
              {certifications.map((c) => (
                <div key={c.id} className="flex justify-between items-baseline">
                  <p className="text-sm font-semibold break-words">{c.name} <span className="font-normal italic text-gray-600">— {c.organization}</span></p>
                  <span className="text-xs">{c.issue_year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ACHIEVEMENTS */}
        {achievements.length > 0 && (
          <section className="mb-6">
            <h2 className="text-md font-bold uppercase border-b border-gray-800 mb-2">Achievements</h2>
            {achievements.map((a) => (
              <div key={a.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm break-words">{a.title}</h3>
                  <span className="text-xs">{a.year}</span>
                </div>
                {a.description && <p className="text-sm text-gray-700 break-words">{a.description}</p>}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}