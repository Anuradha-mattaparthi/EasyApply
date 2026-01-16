import React from "react";
import { Link } from "react-router-dom";
import { logout } from "./services/api";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F2F2F2] font-mono px-6 py-16">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-4xl font-medium text-[#1A1A1A]">
              Dashboard
            </h1>
            <p className="mt-2 text-[#5A5A5A]">
              Track your job search activity
            </p>
          </div>

          {/* Basic Details Link */}
          <Link
            to="/profile"
            className="text-sm text-[#2563EB] hover:underline"
          >
            Basic Details →
          </Link>
        <button
        onClick={logout}
        className="text-sm text-red-600 hover:underline"
        >
        Logout
        </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Recommended Jobs */}
          <div className="bg-[#0B0B0B] rounded-2xl p-8 shadow-lg">
            <p className="text-sm text-[#9A9A9A] mb-3">
              Recommended Jobs
            </p>
            <h2 className="text-5xl font-medium text-white">
              24
            </h2>
          </div>

          {/* Emails */}
          <div className="bg-[#0B0B0B] rounded-2xl p-8 shadow-lg">
            <p className="text-sm text-[#9A9A9A] mb-3">
              Emails
            </p>
            <h2 className="text-5xl font-medium text-white">
              12
            </h2>
          </div>

          {/* Incomplete Applies */}
          <div className="bg-[#0B0B0B] rounded-2xl p-8 shadow-lg">
            <p className="text-sm text-[#9A9A9A] mb-3">
              Incomplete Applies
            </p>
            <h2 className="text-5xl font-medium text-white">
              3
            </h2>
          </div>

        </div>

      </div>
    </div>
  );
}
