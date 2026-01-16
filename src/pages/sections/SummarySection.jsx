import React from "react";
import Accordion from "../components/Accordion";

export default function SummarySection() {

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Summary Saved");
  };

  return (
    <Accordion title="Professional Summary">

      <form onSubmit={handleSubmit} className="space-y-4">

        <textarea
          rows="5"
          placeholder="Write your professional summary..."
          className="editor-textarea"
        />

        <button className="editor-btn">
          Save Summary
        </button>

      </form>

    </Accordion>
  );
}
