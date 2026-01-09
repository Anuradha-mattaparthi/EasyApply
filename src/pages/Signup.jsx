import React, { useState }  from "react";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://smartapply-7msy.onrender.com/api/auth/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful!");
        console.log(data);
      } else {
        alert(data.message || "Signup failed");
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

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

          <form className="space-y-6" onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0]"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0]"
            />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0]"
            />

            <button type="submit"
              className="w-full bg-[#2563EB] text-white py-3 rounded-lg">
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
