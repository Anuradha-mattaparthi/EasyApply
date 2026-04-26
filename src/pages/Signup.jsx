import React, { useState }  from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import API from "./services/api";




export default function Signup() {
  const [loading, setLoading] = useState(false);
  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: "#0B0B0B",
    color: "#ffffff",
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  const navigate = useNavigate();

  if (localStorage.getItem("access")) {
    return <Navigate to="/dashboard" />;
  }
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: ""
  });
  

  const showOtpPopup = (email) => {
    Swal.fire({
      title: "Verify OTP",
      background: "#0B0B0B",
      color: "#ffffff",
      backdrop: "rgba(0,0,0,0.4)",
      allowOutsideClick: false, 
  
      html: `
        <div style="display:flex; gap:10px; justify-content:center; margin-top:10px;">
          ${Array(6).fill(0).map(() => `
            <input type="text" maxlength="1"
              class="otp-input"
              style="
                width:45px;
                height:50px;
                text-align:center;
                font-size:20px;
                border-radius:8px;
                background:#1C1C1C;
                color:white;
                outline:none;
                border:1px solid #444;
              "
            />
          `).join("")}
        </div>
        <div id="otpError" style="color:#EF4444; margin-top:12px; text-align:center;"></div>

      `,
  
      showCancelButton: true,
      confirmButtonText: "Verify",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#DC2626",
      reverseButtons: true,
      showLoaderOnConfirm: true,
  
      footer: `
        <div style="border-top:1px solid #333; padding-top:12px; text-align:center;">
          <span id="resendText" style="color:#888; font-size:14px;">
            Resend in 30s
          </span><br/>
          <a href="#" id="resendOtp"
            style="color:#60A5FA; pointer-events:none; opacity:0.5;">
            Resend OTP
          </a>
        </div>
      `,
  
      didOpen: () => {
        const inputs = document.querySelectorAll(".otp-input");
  
        // 🔹 INPUT NAVIGATION
        inputs.forEach((input, index) => {
          input.addEventListener("input", (e) => {
            // ✅ move to next box
            if (e.target.value.length === 1 && index < inputs.length - 1) {
              inputs[index + 1].focus();
            }
          
            // 🔥 CLEAR ERROR MESSAGE
            const errorDiv = document.getElementById("otpError");
            if (errorDiv) {
              errorDiv.innerText = "";
            }
          
            // 🔥 RESET BORDER COLORS
            document.querySelectorAll(".otp-input").forEach(input => {
              input.style.border = "1px solid #444";
            });
          });
  
          input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !input.value && index > 0) {
              inputs[index - 1].focus();
            }
          });
  
          input.addEventListener("focus", () => {
            input.style.border = "1px solid #2563EB";
          });
  
          input.addEventListener("blur", () => {
            input.style.border = "1px solid #444";
          });
        });
  
        inputs[0].focus();
  
        // 🔹 TIMER
        const resendBtn = document.getElementById("resendOtp");
        const resendText = document.getElementById("resendText");
  
        let timeLeft = 30;
        let timer;
  
        const startTimer = () => {
          clearInterval(timer); // ✅ FIX: stop old timer
  
          resendBtn.style.pointerEvents = "none";
          resendBtn.style.opacity = "0.5";
  
          timer = setInterval(() => {
            timeLeft--;
            resendText.innerText = `Resend in ${timeLeft}s`;
  
            if (timeLeft <= 0) {
              clearInterval(timer);
              resendText.innerText = "";
              resendBtn.style.pointerEvents = "auto";
              resendBtn.style.opacity = "1";
            }
          }, 1000);
        };
  
        startTimer();
  
        // 🔹 RESEND OTP
        resendBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          resendBtn.style.pointerEvents = "none";
          resendBtn.style.opacity = "0.5";
          resendText.innerHTML = `<span style="color:#888;">Sending...</span>`;
          timeLeft = 30;  
          try {
            await API.post("/api/auth/resend-otp/", { email });
  
            resendText.innerHTML = `<span style="color:#22C55E;">OTP sent ✓</span>`;

            setTimeout(() => {
              startTimer(); 
            }, 1500);

  
          } catch (err) {
            resendText.innerHTML = `<span style="color:#EF4444;">Failed ❌</span>`;
  
            setTimeout(() => {
              resendText.innerText = "";
              resendBtn.style.pointerEvents = "auto";
              resendBtn.style.opacity = "1";
            }, 2500);
          }
        });
      },
  
      // 🔹 VERIFY OTP
      preConfirm: async () => {
        const inputs = document.querySelectorAll(".otp-input");
        const otp = Array.from(inputs).map(i => i.value).join("");
  
        if (otp.length !== 6) {
          document.getElementById("otpError").innerText = "Enter complete 6-digit OTP";
          return false;
        }
  
        try {
          const res = await API.post("/api/auth/verify-otp/", {
            email,
            otp
          });
  
          return res.data;
  
        } catch (err) {
          document.getElementById("otpError").innerText = "Invalid or expired OTP";

          // 🔥 make inputs red
          document.querySelectorAll(".otp-input").forEach(input => {
            input.style.border = "1px solid #EF4444";
          });
          
          return false;
        }
      }
  
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const data = result.value;
  
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
  
        Toast.fire({
          icon: "success",
          title: "Account activated 🎉"
        });
  
        navigate("/dashboard");
      }
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name) {
      Toast.fire({ icon: "warning", title: "Full name is required" });
      return;
    }
    
    if (!form.email) {
      Toast.fire({ icon: "warning", title: "Email is required" });
      return;
    }
    
    if (!form.password) {
      Toast.fire({ icon: "warning", title: "Password is required" });
      return;
    }
    try {
      setLoading(true);
      const res = await API.post("/api/auth/signup/", {
        full_name: form.full_name,
        email: form.email,
        password: form.password
      });
      
      const data = res.data;
      
      if (res.status === 201 || res.status === 200) {
        Toast.fire({
          icon: "success",
          title: "Signup successful"
        });
      
        showOtpPopup(form.email);
      }

    } catch (err) {
      let message = "Something went wrong";
  
      if (err.response?.data) {
        const data = err.response.data;
  
        message =
          data.email?.[0] ||
          data.password?.[0] ||
          data.full_name?.[0] ||
          data.error ||
          data.detail ||
          "Signup failed";
      }
  
      Toast.fire({
        icon: "error",
        title: message
      });  
    } finally {
      setLoading(false); // 🔥 STOP LOADING (IMPORTANT)
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
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Full name"
              autoComplete="off"
              className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0]"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email address"
              autoComplete="off"
              className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0]"
            />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              autoComplete="off"
              className="w-full px-4 py-3 rounded-lg border border-[#D0D0D0]"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-[#2563EB]"
              }`}
            >
              {loading ? "Loading..." : "Sign up"}
            </button>
            <p className="text-center text-sm text-[#5A5A5A]">
              Already have an account?{" "}
              <Link to="/signin" className="text-[#2563EB] font-medium hover:underline">
                Log in
              </Link>
            </p>
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
