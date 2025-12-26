import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] font-mono">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* BASE GRADIENT */}
        <div className="absolute inset-0 bg-linear-to-b from-[#2A2A2A] via-[#1C1C1C] to-[#0B0B0B]" />

        {/* BLOBS */}
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-[#3A3A3A]/60 blur-[140px]" />
        <div className="absolute top-1/4 -right-48 w-[480px] h-[480px] rounded-full bg-[#2F2F2F]/70 blur-[160px]" />
        <div className="absolute bottom-[-220px] left-1/3 w-[560px] h-[560px] rounded-full bg-black/80 blur-[180px]" />

        {/* HIGHLIGHT */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_65%)]" />

        {/* CONTENT */}
        <div className="relative z-10 max-w-3xl px-6 text-center">
          <h1 className="text-6xl font-medium tracking-tight text-[#F1F1F1]">
            Easy Apply
          </h1>

          <p className="mt-4 text-2xl text-[#CFCFCF]">
            Your 24/7 job search agent
          </p>

          <p className="mt-8 text-lg text-[#A8A8A8] leading-relaxed">
            Easy Apply automatically finds jobs that match your skills, analyzes
            job descriptions, ranks your profile, and shows exactly where to
            apply — so you can focus on interviews, not searching.
          </p>

          <div className="mt-12 flex justify-center gap-5">
          <Link
    to="/signup"
    className="bg-[#2563EB] text-white px-9 py-3 rounded-xl font-medium hover:bg-[#1D4ED8] transition"
  >
    Signup
  </Link>

  <Link
    to="/signin"
    className="px-9 py-3 rounded-xl border border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#1F1F1F] transition"
  >
    Signin
  </Link>
          </div>
        </div>
      </section>

      {/* HOW EASY APPLY WORKS */}
      <section id="how" className="bg-[#F5F5F5] py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-medium text-[#1A1A1A]">
              How Easy Apply Works
            </h2>
            <p className="mt-4 text-lg text-[#2A2A2A]">
              One profile. Continuous job discovery. Clear results.
            </p>
          </div>

          <div className="grid md:grid-cols-5 items-center gap-14 justify-items-center">
            <div className="bg-white border border-[#E5E5E5] rounded-3xl p-10 shadow-lg w-[350px]">
              <h3 className="text-xl font-medium text-[#1A1A1A] mb-4">
                Create Your Profile
              </h3>
              <p className="text-[#6A6A6A] leading-relaxed">
                Add your skills, preferences, salary range, and location.
              </p>
            </div>

            <div className="hidden md:flex items-center justify-center text-[#2563EB] text-3xl">
              →
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-3xl p-10 shadow-lg w-[350px]">
              <h3 className="text-xl font-medium text-[#1A1A1A] mb-4">
                AI Agent Searches
              </h3>
              <p className="text-[#6A6A6A] leading-relaxed">
                Our AI continuously scans job platforms that match your profile.
              </p>
            </div>

            <div className="hidden md:flex items-center justify-center text-[#2563EB] text-3xl">
              →
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-3xl p-10 shadow-lg w-[350px]">
              <h3 className="text-xl font-medium text-[#1A1A1A] mb-4">
                Get Ranked Matches
              </h3>
              <p className="text-[#6A6A6A] leading-relaxed">
                Matches get delivered directly to your email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM & SOLUTION */}
      <section className="bg-[#F2F2F2] py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl font-medium text-[#1A1A1A]">
              Job Searching, Simplified
            </h2>
            <p className="mt-4 text-lg text-[#5A5A5A]">
              See how Easy Apply replaces the traditional job hunt.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-3xl p-10 shadow-lg">
              <h3 className="text-2xl font-medium text-[#1A1A1A] mb-6">
                Manual & Time-Consuming
              </h3>
              <ul className="space-y-4 text-[#6A6A6A]">
                <li>• Apply on multiple job boards</li>
                <li>• No clarity on skill match</li>
                <li>• Endless scrolling & filtering</li>
                <li>• Resume sent blindly</li>
                <li>• Missed opportunities</li>
              </ul>
            </div>

            <div className="bg-[#0B0B0B] rounded-3xl p-10 shadow-xl">
              <h3 className="text-2xl font-medium text-white mb-6">
                Automated & Intelligent
              </h3>
              <ul className="space-y-4 text-[#B5B5B5]">
                <li>• One profile setup</li>
                <li>• AI searches jobs 24/7</li>
                <li>• Clear skill-match ranking</li>
                <li>• Resume aligned to JD</li>
                <li>• Jobs delivered to your email</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
