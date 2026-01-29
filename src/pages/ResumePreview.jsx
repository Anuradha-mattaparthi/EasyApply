import React, { useState, useEffect } from "react";
import API from "./services/api";

export default function ResumePreview() {

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
          headerRes,
          summaryRes,
          skillsRes,
          expRes,
          projRes,
          eduRes,
          certRes,
          achRes
        ] = await Promise.all([
          API.get("/api/me/resume/header/"),
          API.get("/api/me/resume/summary/"),
          API.get("/api/me/resume/skills/"),
          API.get("/api/me/resume/work-experience/"),
          API.get("/api/me/resume/projects/"),
          API.get("/api/me/resume/education/"),
          API.get("/api/me/resume/certifications/"),
          API.get("/api/me/resume/achievements/")
        ]);

        setHeader(headerRes.data);
        setSummary(summaryRes.data);
        setSkills(skillsRes.data);
        setExperiences(expRes.data);
        setProjects(projRes.data);
        setEducations(eduRes.data);
        setCertifications(certRes.data);
        setAchievements(achRes.data);

      } catch (error) {
        console.log("Error loading preview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading resume preview...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white text-black shadow-lg">

      {/* HEADER */}
      {header && (
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">{header.full_name}</h1>
          <p>{header.target_role}</p>
          <p>
            {header.email} | {header.phone}
          </p>
          <p>
            {header.location_city}, {header.location_country}
          </p>
        </div>
      )}

      {/* SUMMARY */}
      {summary?.summary_text && (
        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">Professional Summary</h2>
          <p>{summary.summary_text}</p>
        </section>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">Skills</h2>
          <ul className="list-disc ml-6">
            {skills.map((s) => (
              <li key={s.id}>
                {s.name} - {s.category}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* EXPERIENCE */}
      {experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">Work Experience</h2>

          {experiences.map((exp) => (
            <div key={exp.id} className="mb-3">
              <p className="font-semibold">{exp.job_title}</p>
              <p>{exp.company_name}</p>
              <p>
                {exp.start_date} - {exp.end_date || "Present"}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">Projects</h2>

          {projects.map((p) => (
            <div key={p.id} className="mb-3">
              <p className="font-semibold">{p.title}</p>

              {p.tech_stack?.length > 0 && (
                <p>Tech: {p.tech_stack.join(", ")}</p>
              )}

              {p.bullets?.length > 0 && (
                <ul className="list-disc ml-6">
                  {p.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* EDUCATION */}
      {educations.length > 0 && (
        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">Education</h2>

          {educations.map((e) => (
            <div key={e.id}>
              <p className="font-semibold">{e.degree}</p>
              <p>{e.institution}</p>
              <p>
                {e.graduation_year} {e.cgpa && `- CGPA: ${e.cgpa}`}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* CERTIFICATIONS */}
      {certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">Certifications</h2>

          {certifications.map((c) => (
            <div key={c.id}>
              <p className="font-semibold">{c.name}</p>
              {c.organization && <p>{c.organization}</p>}
              {c.issue_year && <p>Year: {c.issue_year}</p>}
            </div>
          ))}
        </section>
      )}

      {/* ACHIEVEMENTS */}
      {achievements.length > 0 && (
        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">Achievements</h2>

          {achievements.map((a) => (
            <div key={a.id}>
              <p className="font-semibold">{a.title}</p>
              {a.description && <p>{a.description}</p>}
              {a.year && <p>Year: {a.year}</p>}
            </div>
          ))}
        </section>
      )}

    </div>
  );
}
