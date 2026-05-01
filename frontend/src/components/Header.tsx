import { useState } from "react";
import {
  Search,
  User,
  HelpCircle,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full shadow-sm bg-blue-600 text-white sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-3 px-4 md:py-4 gap-4 lg:gap-8">
        {/* Mobile Menu Toggle & Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            className="lg:hidden p-1 hover:bg-blue-700 rounded"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <h1 className="text-xl md:text-2xl font-black text-orange-500 italic select-none">
            Elvekas
          </h1>
        </div>

        {/* Search Bar - Hidden on small mobile, shown on md+ or inside menu */}
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
            <button className="bg-orange-500 text-white px-4 lg:px-6 py-2 font-bold uppercase hover:bg-orange-600 transition text-xs lg:text-sm">
              Search
            </button>
          </form>
        </div>

        {/* User Actions - Desktop view */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Account and Help hidden on mobile, Cart always visible */}
          <div className="hidden lg:flex items-center gap-1 cursor-pointer hover:text-orange-400 transition">
            <User size={22} />
            <span className="font-medium text-sm lg:text-base">Account</span>
            <ChevronDown size={14} />
          </div>

          <div className="hidden lg:flex items-center gap-1 cursor-pointer hover:text-orange-400 transition">
            <HelpCircle size={22} />
            <span className="font-medium text-sm lg:text-base">Help</span>
          </div>

          <a
            href="/cart"
            className="flex items-center gap-1 font-medium hover:text-orange-400 transition"
          >
            <div className="relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                0
              </span>
            </div>
            <span className="hidden sm:inline">Cart</span>
          </a>
        </div>
      </div>

      {/* Mobile Search - Only visible on smallest screens (< md) */}
      <div className="md:hidden px-4 pb-3">
        <form className="flex w-full bg-white rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="I'm looking for..."
            className="w-full py-2 px-4 outline-none text-sm text-gray-800"
          />
          <button className="bg-orange-500 px-4">
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="w-64 h-full bg-white text-gray-800 p-5 shadow-xl animate-slide-in"
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
              <a
                href="/account"
                className="flex items-center gap-3 font-medium hover:text-blue-600"
              >
                <User size={20} /> My Account
              </a>
              <a
                href="/help"
                className="flex items-center gap-3 font-medium hover:text-blue-600"
              >
                <HelpCircle size={20} /> Help Center
              </a>
              <a
                href="/orders"
                className="flex items-center gap-3 font-medium hover:text-blue-600"
              >
                <ShoppingCart size={20} /> My Orders
              </a>
              <hr />
              <p className="text-xs uppercase text-gray-400 font-bold">
                Categories
              </p>
              <a href="/fashion" className="font-medium hover:text-blue-600">
                Fashion
              </a>
              <a
                href="/electronics"
                className="font-medium hover:text-blue-600"
              >
                Electronics
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
