import React, { useState } from "react";

export default function SummarySection() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Summary saved (UI only)");
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">

      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h2 className="font-semibold text-lg">
          Professional Summary
        </h2>

        <button className="text-blue-600">
          {open ? "Close" : "Edit"}
        </button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">

          <textarea
            rows="4"
            placeholder="Write your professional summary..."
            className="border p-2 rounded w-full"
          />

          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            Save Summary
          </button>

        </form>
      )}
    </div>
  );
}
