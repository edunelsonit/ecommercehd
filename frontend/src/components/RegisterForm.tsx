import React, { useState } from "react";
import axios from "axios";
import { Mail, Phone, Lock, Loader2 } from "lucide-react";

interface AuthFormProps {
  onToggleView: () => void;
}

const RegisterForm: React.FC<AuthFormProps> = ({ onToggleView }) => {
  const genders = [
    { id: 1, sex: "Male" },
    { id: 2, sex: "Female" },
  ];

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    genderId: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      genderId: Number(formData.genderId),
    };

    try {
      // Replace with your environment variable in production
      await axios.post("http://localhost:3000/api/auth/register", payload);
      alert("Account created successfully!");
      onToggleView();
    } catch (err: unknown) {
      // 2. Use Axios's built-in type guard
      if (axios.isAxiosError(err)) {
        // Now 'err' is typed as AxiosError
        const message = err.response?.data?.message || "An error occurred";
        setError(message);
      } else {
        // Handle non-axios errors (like programming bugs)
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Join Elvekas</h2>
        <p className="text-gray-500 text-sm">Create your shopping account</p>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Wrapped in a form element */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 p-2.5 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full pl-10 p-2.5 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1">
          <select
            name="genderId"
            required
            value={formData.genderId}
            onChange={handleChange}
            className="p-2.5 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            {genders.map((g) => (
              <option key={g.id} value={g.id}>
                {g.sex}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-10 p-2.5 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Register"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          onClick={onToggleView}
          type="button"
          className="text-blue-600 font-bold hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;
