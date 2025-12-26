import React from "react";

export default function Signup() {
  return (
    <div className="min-h-screen grid md:grid-cols-10 font-mono">
      
      {/* LEFT – 70% GREY */}
      <div className="md:col-span-7 bg-[#F2F2F2] flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-medium text-[#1A1A1A] mb-4">
            Create your account
          </h1>
          <p className="text-[#5A5A5A] mb-10">
            Start using Easy Apply in minutes.
          </p>

          <form className="space-y-6">
            <input
              type="text"
              placeholder="Full name"
              className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0] focus:outline-none focus:border-[#2563EB]"
            />

            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0] focus:outline-none focus:border-[#2563EB]"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0] focus:outline-none focus:border-[#2563EB]"
            />

            <button
              type="submit"
              className="w-full bg-[#2563EB] text-white py-3 rounded-lg hover:bg-[#1D4ED8] transition"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT – 30% BLACK */}
      <div className="md:col-span-3 bg-linear-to-b from-[#2A2A2A] via-[#1C1C1C] to-[#0B0B0B] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-xs">
          <h2 className="text-2xl font-medium mb-4">
            Easy Apply
          </h2>
          <p className="text-[#B5B5B5] text-sm leading-relaxed">
            Let AI find jobs that truly match your skills — automatically.
          </p>
        </div>
      </div>

    </div>
  );
}
