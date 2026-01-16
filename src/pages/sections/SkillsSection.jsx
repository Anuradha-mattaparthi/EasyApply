import React from "react";
import Accordion from "../components/Accordion";

export default function SkillsSection() {

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Skills Saved");
  };

  return (
    <Accordion title="Skills">

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          placeholder="Enter skills (comma separated)"
          className="editor-input"
        />

        <button className="editor-btn">
          Save Skills
        </button>

      </form>

    </Accordion>
  );
}
