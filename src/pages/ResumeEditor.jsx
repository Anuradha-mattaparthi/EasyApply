import React from "react";
import HeaderSection from "./sections/HeaderSection";
import SummarySection from "./sections/SummarySection";
import SkillsSection from "./sections/SkillsSection";
import ExperienceSection from "./sections/ExperienceSection";

export default function ResumeEditor() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-2xl font-bold mb-6 text-center">
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
