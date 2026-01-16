import React, { useState } from "react";

export default function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#0f0f0f] border border-[#222] rounded-xl p-4 text-white">

      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h2 className="text-lg font-semibold">{title}</h2>

        <span className="text-2xl font-bold">
          {open ? "−" : "+"}
        </span>
      </div>

      {open && (
        <div className="mt-6">
          {children}
        </div>
      )}

    </div>
  );
}
