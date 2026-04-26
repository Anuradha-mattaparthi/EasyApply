import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API from "./services/api";

export default function Signin() {

  // ✅ STEP 1: ALL hooks FIRST — no exceptions
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ STEP 2: early return AFTER hooks
  if (localStorage.getItem("access")) {
    return <Navigate to="/dashboard" />;
  }

  // ✅ STEP 3: everything else below
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Toast.fire({ icon: "warning", title: "Email and password required" });
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/api/auth/signin/", { email, password });
      const data = res.data;

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      Toast.fire({ icon: "success", title: "Welcome back 👋" });
      navigate("/dashboard");

    } catch (err) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      let message = "Login failed";
      if (err.response?.data) {
        const data = err.response.data;
        message = data.error || data.detail || "Invalid email or password";
      }
      Toast.fire({ icon: "error", title: message });

    } finally {
      setLoading(false);
    }
  };

  const showResetOtpPopup = (email) => {
    Swal.fire({
      title: "Verify OTP",
      background: "#0B0B0B",
      color: "#ffffff",
      allowOutsideClick: false,
      html: `
        <div style="display:flex; gap:10px; justify-content:center;">
          ${Array(6).fill(0).map(() => `
            <input type="text" maxlength="1" class="otp-input"
              style="width:45px;height:50px;text-align:center;
              background:#1C1C1C;color:white;border:1px solid #444;border-radius:8px;" />
          `).join("")}
        </div>
        <div id="otpError" style="color:#EF4444;margin-top:10px;text-align:center;"></div>
        <div style="margin-top:15px; text-align:center; border-top:1px solid #333; padding-top:10px;">
          <span id="resendText" style="color:#888;">Resend in 30s</span><br/>
          <a href="#" id="resendBtn" style="color:#60A5FA; pointer-events:none; opacity:0.5;">Resend OTP</a>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Verify",
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#DC2626",
      didOpen: () => {
        const inputs = document.querySelectorAll(".otp-input");
        const resendBtn = document.getElementById("resendBtn");
        const resendText = document.getElementById("resendText");

        inputs.forEach((input, index) => {
          input.addEventListener("input", (e) => {
            if (e.target.value && index < 5) inputs[index + 1].focus();
            document.getElementById("otpError").innerText = "";
          });
          input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !input.value && index > 0) inputs[index - 1].focus();
          });
        });
        inputs[0].focus();

        let timeLeft = 30;
        let timer;
        const startTimer = () => {
          clearInterval(timer);
          resendBtn.style.pointerEvents = "none";
          resendBtn.style.opacity = "0.5";
          timer = setInterval(() => {
            timeLeft--;
            resendText.innerHTML = `<span style="color:#22C55E;">OTP sent ✓</span><br/><span style="color:#888;">Resend in ${timeLeft}s</span>`;
            if (timeLeft <= 0) {
              clearInterval(timer);
              resendText.innerText = "";
              resendBtn.style.pointerEvents = "auto";
              resendBtn.style.opacity = "1";
            }
          }, 1000);
        };
        startTimer();

        resendBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          timeLeft = 30;
          startTimer();
          try {
            await API.post("/api/auth/forgot-password/", { email });
            resendText.innerHTML = `<span style="color:#22C55E;">OTP sent ✓</span><br/><span style="color:#888;">Resend in ${timeLeft}s</span>`;
          } catch {
            resendText.innerHTML = `<span style="color:#EF4444;">Failed ❌</span>`;
            setTimeout(() => { resendText.innerText = `Resend in ${timeLeft}s`; }, 5000);
          }
        });
      },
      preConfirm: async () => {
        const inputs = document.querySelectorAll(".otp-input");
        const otp = Array.from(inputs).map(i => i.value).join("");
        if (otp.length !== 6) {
          document.getElementById("otpError").innerText = "Enter 6-digit OTP";
          return false;
        }
        try {
          const res = await API.post("/api/auth/verify-reset-otp/", { email, otp });
          return res.data;
        } catch {
          document.getElementById("otpError").innerText = "Invalid OTP";
          return false;
        }
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        showResetPasswordModal(result.value.reset_token, email);
      }
    });
  };

  const showResetPasswordModal = (reset_token, email) => {
    Swal.fire({
      title: "Reset Password",
      background: "#0B0B0B",
      color: "#ffffff",
      allowOutsideClick: false,
      html: `
        <div style="text-align:left; margin-bottom:6px;">
          <label style="color:#888; font-size:12px;">New password</label>
        </div>
        <input id="newPassword" type="password" placeholder="••••••••"
          style="width:100%; box-sizing:border-box; background:#1C1C1C; color:#fff;
          border:1px solid #444; border-radius:8px; padding:10px 12px; font-size:14px; margin-bottom:14px;" />
        <div style="text-align:left; margin-bottom:6px;">
          <label style="color:#888; font-size:12px;">Confirm password</label>
        </div>
        <input id="confirmPassword" type="password" placeholder="••••••••"
          style="width:100%; box-sizing:border-box; background:#1C1C1C; color:#fff;
          border:1px solid #444; border-radius:8px; padding:10px 12px; font-size:14px;" />
        <div id="resetError" style="color:#EF4444; font-size:12px; margin-top:10px; text-align:center; min-height:16px;"></div>
      `,
      showCancelButton: true,
      confirmButtonText: "Update Password",
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#DC2626",
      didOpen: () => { document.getElementById("newPassword").focus(); },
      preConfirm: async () => {
        const password = document.getElementById("newPassword").value;
        const confirm = document.getElementById("confirmPassword").value;
        const errorEl = document.getElementById("resetError");
        if (!password || !confirm) { errorEl.innerText = "Both fields are required"; return false; }
        if (password.length < 8) { errorEl.innerText = "Password must be at least 8 characters"; return false; }
        if (password !== confirm) { errorEl.innerText = "Passwords do not match"; return false; }
        try {
          const res = await API.post("/api/auth/reset-password/", { reset_token, new_password: password });
          return res.data;
        } catch (err) {
          const data = err.response?.data;
          errorEl.innerText = Array.isArray(data?.error) ? data.error.join(", ") : data?.error || data?.detail || "Reset failed";
          return false;
        }
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Toast.fire({ icon: "success", title: "Password updated successfully 🎉" });
      }
    });
  };

  const handleForgotPassword = async () => {
    const { value: emailInput } = await Swal.fire({
      title: "Enter your email",
      background: "#0B0B0B",
      color: "#ffffff",
      backdrop: "rgba(0,0,0,0.6)",
      allowOutsideClick: false,
      input: "email",
      inputValue: email,
      inputPlaceholder: "Enter your email address",
      confirmButtonText: "Send OTP",
      confirmButtonColor: "#2563EB",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#DC2626",
      showCancelButton: true,
      inputAttributes: { autocapitalize: "off", autocorrect: "off" },
      customClass: { popup: "rounded-xl", input: "swal-input-dark" },
      inputValidator: (value) => { if (!value) return "Email is required"; },
      preConfirm: async (emailVal) => {
        Swal.showLoading();
        try {
          const res = await API.post("/api/auth/forgot-password/", { email: emailVal });
          return { email: emailVal, data: res.data };
        } catch (err) {
          Swal.hideLoading();
          Swal.showValidationMessage(err.response?.data?.error || err.response?.data?.detail || "Something went wrong");
          return false;
        }
      }
    });

    if (!emailInput) return;
    const { email: confirmedEmail } = emailInput;
    localStorage.setItem("reset_email", confirmedEmail);
    Toast.fire({ icon: "success", title: "OTP sent to your email 📩" });
    showResetOtpPopup(confirmedEmail);
  };

  return (
    <div className="min-h-screen grid md:grid-cols-10 font-mono">
      <div className="md:col-span-3 bg-black text-white flex items-center justify-center">
        Welcome Back
      </div>
      <div className="md:col-span-7 bg-gray-100 flex items-center justify-center">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <h1 className="text-3xl">Sign In</h1>
          {error && <p className="text-red-600">{error}</p>}
          <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} className="w-full p-3" />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} className="w-full p-3" />
          <button disabled={loading} className="bg-blue-600 text-white p-3 w-full">
            {loading ? "Signing in..." : "Login"}
          </button>
          <br />
          <p className="text-right text-sm">
            <button type="button" onClick={handleForgotPassword} className="text-blue-600 hover:underline" disabled={loading}>
              Forgot Password?
            </button>
          </p>
          <p className="text-center text-sm text-[#5A5A5A]">
            Don't have an Account?{" "}
            <Link to="/signup" className="text-[#2563EB] font-medium hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}