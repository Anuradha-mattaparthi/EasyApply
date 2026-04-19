import React, { useState, useRef,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function VerifyOTP() {
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("reset_email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  // redirect if no email
  useEffect(() => {
    if (!email) {
      navigate("/signin");
    }
  }, [email, navigate]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
  
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);
  const handleResendOTP = async () => {
    try {
      const res = await fetch("https://smartapply-7msy.onrender.com/api/auth/forgot-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        Swal.fire("Success", data.message, "success");
  
        // reset timer
        setTimer(30);
        setCanResend(false);
      } else {
        Swal.fire("Error", data.error || "Failed to resend OTP", "error");
      }
  
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Server error", "error");
    }
  };

  const handleSubmit = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      Swal.fire("Error", "Enter valid 6-digit OTP", "warning");
      return;
    }

    try {
      const res = await fetch("https://smartapply-7msy.onrender.com/api/auth/verify-reset-otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          otp: finalOtp
        })
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          title: "OTP Verified",
          icon: "success",
          timer: 1200,
          showConfirmButton: false
        });

        // ✅ pass token securely via state
        setTimeout(() => {
          navigate("/reset-password", {
            state: {
              reset_token: data.reset_token,
              email
            }
          });
        }, 1200);

      } else {
        Swal.fire("Error", data.error || "Invalid OTP", "error");
      }

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Server error", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        
        <h2 className="text-2xl font-semibold mb-4">Verify OTP</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter the 6-digit code sent to your email
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-12 text-center border rounded-lg text-lg"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Verify OTP
        </button>

        <p className="text-sm text-gray-500 mb-4">
          {canResend ? (
            <button
              onClick={handleResendOTP}
              className="text-blue-600 hover:underline"
            >
              Resend OTP
            </button>
          ) : (
            <span>Resend OTP in {timer}s</span>
          )}
        </p>
      </div>
    </div>
  );
}