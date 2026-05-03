import { useEffect, useState } from "react";
import {
  User,
  ShieldCheck,
  Loader2,
  Save,
  Phone,
  Calendar,
  MapPin,
  Hash,
  Mail,
  X,
  Globe,
  Edit2,
} from "lucide-react";
import Header from "../components/Header";
import api from "../api/axios";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/auth/profile");
        setUser(response.data);
        setFormData(response.data); // Initialize form with user data
      } catch (err: any) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Inside ProfilePage component
  const handleUpdate = async () => {
    setSaving(true);
    try {
      // Prepare the payload to match Prisma expectations
      const payload = {
        id:formData.id,
        email:formData.email,
        surname: formData.surname,
        firstName: formData.firstName,
        otherName: formData.otherName || "",
        phone: formData.phone,
        nationality: formData.nationality,
        dob: formData.dob, // Ensure this is a valid ISO string or null
        genderId: formData.genderId ? Number(formData.genderId):1,
        stateId: formData.stateId ? Number(formData.stateId) : 1,
        lgaId: formData.lgaId ? Number(formData.lgaId) : 1,
        city: formData.city||"Gembu",
        address: formData.address,
        nin: formData.nin,
        tin: formData.tin,
      };

      const response = await api.put("/api/auth/update-profile", payload);
      setUser(response.data.user);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                Account Settings
              </h1>
              <p className="text-gray-500">
                Manage your personal information and verification status
              </p>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                >
                  <Edit2 size={18} /> Edit Profile
                </button>
              ) : (
                <>
                  {" "}
                  {/* Added missing fragment start */}
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-50"
                  >
                    <X size={18} /> Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={saving}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Save size={18} />
                    )}
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar: ID Card & Wallet */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-blue-400 rounded-3xl flex items-center justify-center text-white shadow-inner">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt="Profile"
                        className="rounded-3xl object-cover w-full h-full"
                      />
                    ) : (
                      <User size={64} />
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-lg shadow-md border text-blue-600 hover:text-blue-700">
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>

                <div className="text-center space-y-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {user?.firstName} {user?.surname}
                  </h2>
                  <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
                    <Mail size={14} /> {user?.email}
                  </p>
                  <span className="mt-4 inline-block bg-blue-50 text-blue-700 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                    {user?.role}
                  </span>
                </div>
              </div>

              <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">
                    Available Balance
                  </p>
                  <h3 className="text-4xl font-black mb-6">
                    ₦{parseFloat(user?.balance || "0").toLocaleString()}
                  </h3>
                  <button className="w-full bg-white/10 hover:bg-white/20 transition py-3 rounded-xl font-bold text-sm backdrop-blur-md border border-white/10">
                    View Transaction History
                  </button>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
              </div>
            </div>

            {/* Right Main Content */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 flex items-center gap-3">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                    <User size={20} />
                  </div>
                  <h3 className="font-bold text-gray-800">
                    Personal & Legal Information
                  </h3>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <ProfileInput
                    label="First Name"
                    value={formData.firstName}
                    isEditing={isEditing}
                    onChange={(v) => setFormData({ ...formData, firstName: v })}
                  />

                  <ProfileInput
                    label="Surname"
                    value={formData.surname}
                    isEditing={isEditing}
                    onChange={(v) => setFormData({ ...formData, surname: v })}
                  />

                  <ProfileInput
                    label="Other Name"
                    value={formData.otherName}
                    isEditing={isEditing}
                    onChange={(v) => setFormData({ ...formData, otherName: v })}
                  />

                  <ProfileInput
                    label="Phone Number"
                    value={formData.phone}
                    isEditing={isEditing}
                    icon={<Phone size={16} />}
                    onChange={(v) => setFormData({ ...formData, phone: v })}
                  />

                  <div>
                    <label className="text-[10px] text-gray-400 uppercase font-black mb-2 block">
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
                        value={formData.dob ? formData.dob.split("T")[0] : ""}
                        onChange={(e) =>
                          setFormData({ ...formData, dob: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />{" "}
                        {user?.dob
                          ? new Date(user.dob).toLocaleDateString()
                          : "---"}
                      </p>
                    )}
                  </div>

                  <ProfileInput
                    label="Nationality"
                    value={formData.nationality}
                    isEditing={isEditing}
                    icon={<Globe size={16} />}
                    onChange={(v) =>
                      setFormData({ ...formData, nationality: v })
                    }
                  />

                  <div className="md:col-span-2 h-px bg-gray-50 my-2"></div>

                  <ProfileInput
                    label="NIN (National Identity Number)"
                    value={formData.nin}
                    isEditing={isEditing}
                    icon={<Hash size={16} />}
                    placeholder="11-digit number"
                    onChange={(v) => setFormData({ ...formData, nin: v })}
                  />

                  <ProfileInput
                    label="TIN (Taxpayer ID)"
                    value={formData.tin}
                    isEditing={isEditing}
                    icon={<ShieldCheck size={16} />}
                    placeholder="13-digit number"
                    onChange={(v) => setFormData({ ...formData, tin: v })}
                  />

                  <div className="md:col-span-2">
                    <label className="text-[10px] text-gray-400 uppercase font-black mb-2 block">
                      Full Delivery Address
                    </label>
                    {isEditing ? (
                      <textarea
                        rows={3}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
                        value={formData.address || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm font-semibold text-gray-700 flex items-center gap-2 italic">
                        <MapPin size={16} className="text-gray-400 shrink-0" />{" "}
                        {user?.address || "No address provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {!user?.nin && (
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6">
                  <div className="p-4 bg-white rounded-2xl text-orange-500 shadow-sm">
                    <ShieldCheck size={32} />
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h4 className="font-bold text-orange-900">
                      Identity Verification Required
                    </h4>
                    <p className="text-sm text-orange-700">
                      Please provide your NIN and TIN to unlock full wallet
                      features and higher spending limits.
                    </p>
                  </div>
                  <button className="w-full sm:w-auto bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-200">
                    Verify Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </> // Added missing closing fragment
  );
};

// 1. Move this OUTSIDE and ABOVE (or below) your main Profile function
const ProfileInput = ({
  label,
  value,
  isEditing,
  onChange,
  icon,
  placeholder,
}: any) => (
  <div>
    <label className="text-[10px] text-gray-400 uppercase font-black mb-2 block tracking-wider">
      {label}
    </label>
    {isEditing ? (
      <input
        placeholder={placeholder}
        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <p className="text-sm font-semibold text-gray-700 flex items-center gap-2 h-11">
        {icon && <span className="text-gray-400">{icon}</span>}
        {value || "---"}
      </p>
    )}
  </div>
);

export default ProfilePage;
