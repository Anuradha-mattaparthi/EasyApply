import React, { useState } from "react";

export default function ExperienceSection() {
  const [open, setOpen] = useState(false);
  const [experienced, setExperienced] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Experience saved (UI only)");
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">

      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h2 className="font-semibold text-lg">
          Work Experience
        </h2>

        <button className="text-blue-600">
          {open ? "Close" : "Edit"}
        </button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">

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
                className="border p-2 rounded w-full"
              />

              <input
                placeholder="Company Name"
                className="border p-2 rounded w-full"
              />

              <input
                placeholder="Role"
                className="border p-2 rounded w-full"
              />
            </div>
          )}

          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            Save Experience
          </button>

        </form>
      )}
    </div>
  );
}
