import React, { useState } from "react";

export default function ResumeDetails() {
  const [isExperienced, setIsExperienced] = useState(false);

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-mono flex items-center justify-center px-6 py-16">

      {/* FORM CARD */}
      <div
        className="max-w-4xl w-full rounded-3xl shadow-2xl p-12
        bg-linear-to-br from-[#0F0F0F] via-[#151515] to-[#0B0B0B]
        text-[#EDEDED]"
      >
        {/* Header */}
        <h1 className="text-3xl font-medium text-white mb-2">
          Resume Details
        </h1>
        <p className="text-[#A8A8A8] mb-10">
          Fill in your resume information to build your professional profile.
        </p>

        <form className="space-y-10">

          {/* HEADER / PERSONAL INFO */}
          <section>
            <h2 className="text-xl font-medium text-white mb-6">
              Header / Personal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <input placeholder="Full Name" className="input-dark" />
              <input type="email" placeholder="Email Address" className="input-dark" />
              <input placeholder="Phone Number" className="input-dark" />
              <input placeholder="Current Designation" className="input-dark" />
            </div>
          </section>

          {/* PROFILE LINKS */}
          <section>
            <h2 className="text-xl font-medium text-white mb-6">
              Profile Links
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <input placeholder="GitHub Profile URL" className="input-dark" />
              <input placeholder="LinkedIn Profile URL" className="input-dark" />
            </div>
          </section>

          {/* PROFESSIONAL SUMMARY */}
          <section>
            <h2 className="text-xl font-medium text-white mb-6">
              Professional Summary
            </h2>
            <textarea
              placeholder="Write a short professional summary about your experience and skills..."
              rows="4"
              className="input-dark resize-none"
            />
          </section>

          {/* EXPERIENCE SECTION */}
          <section>
            <h2 className="text-xl font-medium text-white mb-6">
              Work Experience
            </h2>

            <div className="flex items-center gap-6 mb-6 text-[#D0D0D0]">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="experience"
                  onChange={() => setIsExperienced(true)}
                />
                Experienced
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="experience"
                  onChange={() => setIsExperienced(false)}
                />
                Fresher
              </label>
            </div>

            {isExperienced && (
              <div className="space-y-6">
                <input placeholder="Total Years of Experience" className="input-dark" />
                <input placeholder="Current / Latest Company Name" className="input-dark" />
                <input placeholder="Job Title / Role" className="input-dark" />
                <textarea
                  placeholder="Describe your roles and responsibilities"
                  rows="4"
                  className="input-dark resize-none"
                />
              </div>
            )}
          </section>

          {/* SKILLS */}
          <section>
            <h2 className="text-xl font-medium text-white mb-6">
              Skills
            </h2>
            <input
              placeholder="Enter your skills (e.g. PHP, React, Laravel)"
              className="input-dark w-full"
            />
          </section>

          {/* JOB PREFERENCES */}
          <section>
            <h2 className="text-xl font-medium text-white mb-6">
              Job Preferences
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <input placeholder="Preferred Industry" className="input-dark" />
              <input placeholder="Preferred Roles" className="input-dark" />
              <select className="input-dark">
                <option value="">Preferred Company Type</option>
                <option>Service Based</option>
                <option>Product Based</option>
                <option>Startup</option>
              </select>
            </div>
          </section>

          {/* LOCATION & SALARY */}
          <section>
            <h2 className="text-xl font-medium text-white mb-6">
              Location & Salary Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <input placeholder="Current Location" className="input-dark" />
              <input placeholder="Preferred Location" className="input-dark" />
              <input placeholder="Current CTC (LPA)" className="input-dark" />
              <input placeholder="Expected CTC (LPA)" className="input-dark" />
            </div>
          </section>

          {/* SUBMIT */}
          <div className="pt-6">
            <button
              type="submit"
              className="bg-[#2563EB] text-white px-10 py-3 rounded-xl hover:bg-[#1D4ED8] transition"
            >
              Save Resume Details
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
