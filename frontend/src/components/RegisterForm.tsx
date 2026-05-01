import React, { useState, useEffect } from "react";
import api from "../lib/axios"; // Import the instance we just created
import { AxiosError } from "axios";
import { User, Mail, Phone, MapPin, Lock, ChevronRight } from "lucide-react";

interface Gender { id: number; sex: string; }
interface State { id: number; name: string; }
interface LGA { id: number; name: string; }

interface AuthFormProps {
  onToggleView: () => void;
}

const RegisterForm: React.FC<AuthFormProps> = ({ onToggleView }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [genders, setGenders] = useState<Gender[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [lgas, setLgas] = useState<LGA[]>([]);

  const [formData, setFormData] = useState({
    surname: "", firstName: "", email: "", phone: "",
    genderId: "", stateId: "", lgaId: "", address: "", password: ""
  });

  // Fetch Genders and States on load
  useEffect(() => {
    const loadData = async () => {
      try {
        const [gRes, sRes] = await Promise.all([
          api.get("/genders"),
          api.get("/states")
        ]);
        setGenders(gRes.data);
        setStates(sRes.data);
      } catch (err) {
        console.error("Failed to load initial data");
      }
    };
    loadData();
  }, []);

  // Fetch LGAs when state changes
  useEffect(() => {
    if (formData.stateId) {
      api.get(`/lgas?stateId=${formData.stateId}`).then(res => setLgas(res.data));
    }
  }, [formData.stateId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      genderId: Number(formData.genderId),
      stateId: Number(formData.stateId),
      lgaId: Number(formData.lgaId),
    };

    try {
      await api.post("/auth/register", payload);
      alert("Account created successfully!");
      onToggleView(); 
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError(axiosError.response?.data?.error || "Registration failed");
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
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input name="surname" placeholder="Surname" required onChange={handleChange} className="w-full p-2.5 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
          <input name="firstName" placeholder="First Name" required onChange={handleChange} className="w-full p-2.5 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
          <input name="email" type="email" placeholder="Email Address" required onChange={handleChange} className="w-full pl-10 p-2.5 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
          <input name="phone" placeholder="Phone Number" required onChange={handleChange} className="w-full pl-10 p-2.5 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select name="genderId" required onChange={handleChange} className="p-2.5 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500">
            <option value="">Gender</option>
            {genders.map(g => <option key={g.id} value={g.id}>{g.sex}</option>)}
          </select>
          <select name="stateId" required onChange={handleChange} className="p-2.5 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500">
            <option value="">State</option>
            {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <select name="lgaId" required disabled={!formData.stateId} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50">
          <option value="">Select LGA</option>
          {lgas.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>

        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
          <input name="address" placeholder="Residential Address" required onChange={handleChange} className="w-full pl-10 p-2.5 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
          <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="w-full pl-10 p-2.5 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-600 transition-all disabled:bg-gray-400"
        >
          {loading ? "Creating Account..." : "Create Account"} <ChevronRight size={18} />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account? <button onClick={onToggleView} className="text-blue-600 font-bold hover:underline">Login</button>
      </p>
    </div>
  );
};

export default RegisterForm;