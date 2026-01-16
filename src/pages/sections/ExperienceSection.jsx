import React, { useState } from "react";
import Accordion from "../components/Accordion";

export default function ExperienceSection() {

  const [experienced, setExperienced] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Experience Saved");
  };

  return (
    <Accordion title="Work Experience">

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="flex gap-6">
          <label>
            <input
              type="radio"
              name="exp"
              onChange={() => setExperienced(true)}
            /> Experienced
          </label>

          <label>
            <input
              type="radio"
              name="exp"
              onChange={() => setExperienced(false)}
            /> Fresher
          </label>
        </div>

        {experienced && (
          <div className="space-y-4">

            <input
              placeholder="Years of Experience"
              className="editor-input"
            />

            <input
              placeholder="Company Name"
              className="editor-input"
            />

            <input
              placeholder="Role"
              className="editor-input"
            />

          </div>
        )}

        <button className="editor-btn">
          Save Experience
        </button>

      </form>

    </Accordion>
  );
}
