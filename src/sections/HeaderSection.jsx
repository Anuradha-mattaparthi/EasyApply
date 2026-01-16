import React, { useState } from "react";

export default function HeaderSection() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Header details saved (UI only)");
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">

      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h2 className="font-semibold text-lg">
          Header / Personal Information
        </h2>

        <button className="text-blue-600">
          {open ? "Close" : "Edit"}
        </button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">

          <div className="grid md:grid-cols-2 gap-4">
            <input placeholder="Full Name" className="border p-2 rounded w-full" />
            <input placeholder="Email" className="border p-2 rounded w-full" />
            <input placeholder="Phone" className="border p-2 rounded w-full" />
            <input placeholder="City" className="border p-2 rounded w-full" />
          </div>

          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            Save Header
          </button>

        </form>
      )}
    </div>
  );
}
