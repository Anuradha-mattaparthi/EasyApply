import React, { useState } from "react";

export default function BasicDetails() {
  const [isExperienced, setIsExperienced] = useState(false);

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-mono flex items-center justify-center px-6 py-16">

      {/* FORM CARD */}
      <div
        className="max-w-4xl w-full rounded-3xl shadow-2xl p-12
        bg-gradient-to-br from-[#0F0F0F] via-[#151515] to-[#0B0B0B]
        text-[#EDEDED]"
      >
        {/* Header */}
        <h1 className="text-3xl font-medium text-white mb-2">
          Basic Details
        </h1>
        <p className="text-[#A8A8A8] mb-10">
          Help us personalize your job recommendations.
        </p>

        <form className="space-y-10">

          {/* PERSONAL DETAILS */}
          <section>
            <h2 className="text-xl font-medium text-white mb-6">
              Personal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <input placeholder="Full Name" className="input-dark" />
              <input type="email" placeholder="Email" className="input-dark" />
              <input placeholder="Phone Number" className="input-dark" />
              <input placeholder="Highest Qualification" className="input-dark" />
            </div>
          </section>

          {/* LINKS */}
          <section>
            <h2 className="text-xl font-medium text-white mb-6">
              Profile Links
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <input placeholder="GitHub URL" className="input-dark" />
              <input placeholder="LinkedIn URL" className="input-dark" />
            </div>
          </section>

          {/* EXPERIENCE */}
          <section>
            <h2 className="text-xl font-medium text-white mb-6">
              Experience
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
                <input placeholder="Years of Experience" className="input-dark" />
                <input placeholder="Latest Company Name" className="input-dark" />
                <input placeholder="Position / Role" className="input-dark" />
                <textarea
                  placeholder="Role Description"
                  rows="4"
                  className="input-dark resize-none"
                />
              </div>
            )}
          </section>

          {/* JOB PREFERENCES */}
          <section>
            <h2 className="text-xl font-medium text-white mb-6">
              Job Preferences
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <input placeholder="Skills (comma separated)" className="input-dark" />
              <input placeholder="Preferred Industry" className="input-dark" />
              <input placeholder="Preferred Roles" className="input-dark" />
              <select className="input-dark">
                <option value="">Company Type</option>
                <option>Service Based</option>
                <option>Product Based</option>
              </select>
            </div>
          </section>

          {/* LOCATION & SALARY */}
          <section>
            <h2 className="text-xl font-medium text-white mb-6">
              Location & Salary
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
              Save Details
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
