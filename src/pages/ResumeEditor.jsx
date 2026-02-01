import React from "react";
import { useNavigate } from "react-router-dom";

import HeaderSection from "./sections/HeaderSection";
import SummarySection from "./sections/SummarySection";
import SkillsSection from "./sections/SkillsSection";
import ExperienceSection from "./sections/ExperienceSection";
import ProjectSection from "./sections/ProjectSection";
import EducationSection from "./sections/EducationSection";
import CertificationSection from "./sections/CertificationSection";
import AchievementsSection from "./sections/AchievementsSection";

export default function ResumeEditor() {
  const navigate = useNavigate();
  
  
  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

<div className="flex items-center mb-6">
<button
  onClick={() => navigate(-1)}
  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
>
  ← Back
</button>


  <h1 className="text-2xl font-bold text-black mx-auto">
    Resume Editor
  </h1>
</div>

      <div className="max-w-3xl mx-auto space-y-4">

        <HeaderSection />

        <SummarySection />

        <SkillsSection />

        <ExperienceSection />
        <ProjectSection />
        <EducationSection />
        <CertificationSection />
        <AchievementsSection />

      </div>
    </div>
  );
}
