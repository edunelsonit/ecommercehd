import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router"; // Use Link for internal routing
import {
  Search,
  User,
  HelpCircle,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import AuthModals from "./AuthModals";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState("login");

  // Track authentication state locally
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Watch for changes in localStorage (optional but helpful for sync)
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [isAuthOpen]); // Re-check when modal closes (after login)

  const openAuth = (view: string) => {
    setAuthView(view);
    setIsAuthOpen(true);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // If you stored user data
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    navigate("/"); // Redirect to Homepage
    // window.location.reload(); // Optional: force a refresh to clear all states
  };

  return (
    <>
      <header className="w-full shadow-sm bg-blue-600 text-white sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-3 px-4 md:py-4 gap-4 lg:gap-8">
          {/* Logo - Wrap in Link to always go home */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              className="lg:hidden p-1 hover:bg-blue-700 rounded"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            <Link
              to="/"
              className="text-xl md:text-2xl font-black text-orange-500 italic select-none"
            >
              Elvekas
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-grow max-w-2xl">
            <form className="flex w-full bg-white border-2 border-gray-300 rounded-full overflow-hidden focus-within:border-orange-400">
              <div className="flex items-center px-3 text-gray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full py-2 outline-none text-sm text-gray-800"
              />
              <button className="bg-orange-500 text-white px-6 py-2 font-bold uppercase hover:bg-orange-600 transition text-sm">
                Search
              </button>
            </form>
          </div>

          {/* Desktop Actions */}
          <div className="flex items-center gap-4 lg:gap-6">
            {isLoggedIn ? (
              /* Logged In View */
              <div className="hidden lg:flex items-center gap-6">
                <div className="flex items-center gap-1 cursor-pointer hover:text-orange-400 transition">
                  <Link
                    to="/profile"
                    className="flex items-center gap-1 cursor-pointer hover:text-orange-400 transition"
                    >
                    <User size={22} />
                    <span className="font-bold text-sm">My Profile</span>
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 font-medium hover:text-orange-400 transition border-l border-blue-400 pl-4"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              /* Logged Out View */
              <div
                onClick={() => openAuth("login")}
                className="hidden lg:flex items-center gap-1 cursor-pointer hover:text-orange-400 transition"
              >
                <User size={22} />
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[10px] text-blue-100">Sign In</span>
                  <span className="font-bold text-sm">Account</span>
                </div>
                <ChevronDown size={14} />
              </div>
            )}

            <div className="hidden lg:flex items-center gap-1 cursor-pointer hover:text-orange-400 transition">
              <HelpCircle size={22} />
              <span className="font-medium">Help</span>
            </div>

            <Link
              to="/cart"
              className="flex items-center gap-1 font-medium hover:text-orange-400 transition"
            >
              <div className="relative">
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  0
                </span>
              </div>
              <span className="hidden sm:inline">Cart</span>
            </Link>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          >
            <div
              className="w-64 h-full bg-white text-gray-800 p-5 shadow-xl animate-in slide-in-from-left duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8 border-b pb-4">
                <span className="font-black text-orange-500 italic text-xl">
                  Elvekas
                </span>
                <X
                  size={24}
                  className="cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                />
              </div>
              <nav className="flex flex-col gap-6">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-3 font-bold text-gray-900 p-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-1 cursor-pointer hover:text-orange-400 transition"
                      >
                        <User size={22} /> My Profile
                      </Link>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 font-bold text-red-600 bg-red-50 p-3 rounded-lg"
                    >
                      <LogOut size={20} /> Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => openAuth("login")}
                    className="flex items-center gap-3 font-bold text-blue-600 bg-blue-50 p-3 rounded-lg"
                  >
                    <User size={20} /> Login / Register
                  </button>
                )}

                <Link
                  to="/orders"
                  className="flex items-center gap-3 font-medium hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart size={20} /> My Orders
                </Link>
                {/* ... (Categories remain same) */}
              </nav>
            </div>
          </div>
        )}
      </header>

      <AuthModals
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialView={authView}
      />
    </>
  );
};
export default Header;
