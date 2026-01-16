import React from "react";
import Accordion from "../components/Accordion";

export default function HeaderSection() {

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Header Details Saved");
  };

  return (
    <Accordion title="Header / Personal Information">

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Personal Details */}
        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="full_name"
            placeholder="Full Name"
            className="editor-input"
          />

          <input
            name="target_role"
            placeholder="Target Role (e.g Product Manager)"
            className="editor-input"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            className="editor-input"
          />

          <input
            name="email"
            placeholder="Email Address"
            className="editor-input"
          />

        </div>

        {/* Location */}
        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="location_city"
            placeholder="City"
            className="editor-input"
          />

          <input
            name="location_country"
            placeholder="Country"
            className="editor-input"
          />

        </div>

        {/* Links */}
        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="linkedin_url"
            placeholder="LinkedIn URL"
            className="editor-input"
          />

          <input
            name="github_url"
            placeholder="GitHub URL"
            className="editor-input"
          />

          <input
            name="portfolio_url"
            placeholder="Portfolio URL"
            className="editor-input md:col-span-2"
          />

        </div>

        <button className="editor-btn">
          Save Header
        </button>

      </form>

    </Accordion>
  );
}
