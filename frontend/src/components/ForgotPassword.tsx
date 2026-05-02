import React, { useState } from "react";
import axios from "axios";
import { Mail, ShieldCheck, Lock, Loader2, ArrowLeft } from "lucide-react";
import api from "../api/axios";

const ForgotPasswordForm = ({ onBack, onToggleView }: { onBack: () => void; onToggleView: () => void }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Pass
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // STEP 1: Send OTP to Email
  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { email });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send code");
    } finally { setLoading(false); }
  };

  // STEP 2: Verify OTP
  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/verify-otp", { email, otp });
      setStep(3);
    } catch (err: any) {
      setError("Invalid or expired code");
    } finally { setLoading(false); }
  };

  // STEP 3: Submit New Password
  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return setError("Passwords do not match");
    setLoading(true);
    try {
      await axios.patch("/api/auth/reset-password", { 
        email, otp, password: passwords.new 
      });
      onToggleView(); // Switch back to login view
      alert("Password updated! You can now login.");
      onBack(); // Return to login view
    } catch (err: any) {
      setError("Session expired. Please start over.");
    } finally { setLoading(false); }
  };

  return (
    <div className="p-8">
      {step < 3 && (
        <button onClick={onBack} className="flex items-center text-gray-500 text-sm mb-4"><ArrowLeft size={16}/> Back</button>
      )}
      
      <h2 className="text-2xl font-bold mb-1">Reset Password</h2>
      <p className="text-gray-500 text-sm mb-6">
        {step === 1 && "Enter your email to receive a 6-digit code."}
        {step === 2 && `Enter the code sent to ${email}`}
        {step === 3 && "Create a strong new password."}
      </p>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

      {/* STEP 1: EMAIL */}
      {step === 1 && (
        <form onSubmit={requestOtp} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="email" placeholder="Email Address" required value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg" />
          </div>
          <button disabled={loading} className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold">
            {loading ? <Loader2 className="animate-spin mx-auto"/> : "Send Code"}
          </button>
        </form>
      )}

      {/* STEP 2: OTP */}
      {step === 2 && (
        <form onSubmit={verifyOtp} className="space-y-4">
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="text" placeholder="6-Digit Code" required maxLength={6} value={otp} onChange={(e)=>setOtp(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg text-center tracking-widest font-bold" />
          </div>
          <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">
            {loading ? <Loader2 className="animate-spin mx-auto"/> : "Verify Code"}
          </button>
        </form>
      )}

      {/* STEP 3: NEW PASSWORD */}
      {step === 3 && (
        <form onSubmit={updatePassword} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="password" placeholder="New Password" required value={passwords.new} onChange={(e)=>setPasswords({...passwords, new: e.target.value})} className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="password" placeholder="Confirm Password" required value={passwords.confirm} onChange={(e)=>setPasswords({...passwords, confirm: e.target.value})} className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg" />
          </div>
          <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold">
            {loading ? <Loader2 className="animate-spin mx-auto"/> : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;