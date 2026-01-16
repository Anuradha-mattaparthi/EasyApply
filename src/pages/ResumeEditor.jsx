import React from "react";
import HeaderSection from "./sections/HeaderSection";
import SummarySection from "./sections/SummarySection";
import SkillsSection from "./sections/SkillsSection";
import ExperienceSection from "./sections/ExperienceSection";

export default function ResumeEditor() {
  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      <h1 className="text-2xl font-bold mb-6 text-center text-black">
        Resume Editor
      </h1>

      <div className="max-w-3xl mx-auto space-y-4">

        <HeaderSection />

        <SummarySection />

        <SkillsSection />

        <ExperienceSection />

      </div>
    </div>
  );
}
