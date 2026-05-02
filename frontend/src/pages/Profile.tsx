import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Wallet,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import Header from "../components/Header";
import api from "../api/axios"; // Import your new instance

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/auth/profile");
        setUser(response.data);
      } catch (err: any) {
        console.error("DEBUG ERROR:", err.response?.data || err.message);
        // If it's a 401, you might want to redirect to login
        if (err.response?.status === 401) {
          console.log("Token is missing or invalid");
        }
      }
    };
    fetchProfile();
  }, []);

  if (!user) {
    return (
      <>
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Account</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Avatar & Quick Info */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-blue-600 mb-4">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="rounded-full"
                    />
                  ) : (
                    <User size={48} />
                  )}
                </div>
                <h2 className="font-bold text-lg text-gray-900">
                  {user?.firstName || "User"} {user?.surname || ""}
                </h2>
                <p className="text-gray-500 text-sm">{user?.email}</p>
                <div className="mt-4 inline-block bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {user?.role}
                </div>
              </div>

              {/* Wallet Balance Card */}
              <div className="bg-blue-600 rounded-2xl shadow-md p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Wallet size={20} />
                  <span className="text-sm opacity-80">Wallet Balance</span>
                </div>
                <div className="text-3xl font-black">
                  ₦{parseFloat(user?.balance).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Info */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">
                    Personal Information
                  </h3>
                  <button className="text-blue-600 text-sm font-bold hover:underline">
                    Edit
                  </button>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Mail className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold">
                        Email Address
                      </p>
                      <p className="text-sm font-medium">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold">
                        Phone Number
                      </p>
                      <p className="text-sm font-medium">
                        {user?.phone || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ShieldCheck className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold">
                        Nationality
                      </p>
                      <p className="text-sm font-medium">
                        {user?.nationality || "Nigerian"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold">
                        Delivery Address
                      </p>
                      <p className="text-sm font-medium">
                        {user?.address || "No address provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center gap-4">
                <ShieldCheck className="text-orange-500" size={24} />
                <p className="text-sm text-orange-800">
                  Ensure your <strong>NIN</strong> is verified to increase your
                  transaction limits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
