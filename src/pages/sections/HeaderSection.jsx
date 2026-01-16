import React from "react";
import Accordion from "../components/Accordion";

export default function HeaderSection() {

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Header Saved");
  };

  return (
    <Accordion title="Header / Personal Information">

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="grid md:grid-cols-2 gap-4">

          <input placeholder="Full Name" className="editor-input" />

          <input placeholder="Email" className="editor-input" />

          <input placeholder="Phone" className="editor-input" />

          <input placeholder="City" className="editor-input" />

        </div>

        <button className="editor-btn">
          Save Header
        </button>

      </form>

    </Accordion>
  );
}
