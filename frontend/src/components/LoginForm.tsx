import React, { useState } from "react";
import axios from "axios";
import { Mail, Lock, Loader2 } from "lucide-react";
import api from "../api/axios";

interface AuthFormProps {
  onToggleView: () => void;
  onForgotPassword: () => void; // Added this
  onClose: () => void;
}

const LoginForm: React.FC<AuthFormProps> = ({
  onToggleView,
  onForgotPassword,
  onClose,
}) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Adjusted port to 3000 to match your backend
      const response = await api.post("/api/auth/login", formData);
      const { token } = response.data;
      localStorage.setItem("token", token);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // CRITICAL STEP
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.location.reload(); // Refresh to ensure Axios Interceptor picks up the new token
      };
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-500 text-sm">Login to your account</p>
      </div>
      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleLogin}>
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition flex items-center justify-center disabled:bg-gray-400"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        New to Elvekas?{" "}
        <button
          onClick={onToggleView}
          type="button"
          className="text-blue-600 font-bold hover:underline"
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
