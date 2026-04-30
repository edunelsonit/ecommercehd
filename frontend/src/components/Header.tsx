import { Search, User, HelpCircle, ShoppingCart, ChevronDown } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full shadow-sm bg-black text-white">
      
      <div className="container mx-auto flex items-center justify-between py-4 px-4 gap-8">
        {/* Logo */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-black text-orange-500 italic">LOGO</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-grow max-w-2xl">
          <form className="flex w-full border-2 border-gray-300 rounded-full overflow-hidden focus-within:border-orange-400">
            <div className="flex items-center px-3 text-gray-400">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search products, brands and categories"
              className="w-full py-2 outline-none text-sm"
            />
            <button className="bg-orange-500 text-white px-6 py-2 font-bold uppercase hover:bg-orange-600 transition">
              Search
            </button>
          </form>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-6">
          <div className="group relative flex items-center gap-1 cursor-pointer hover:text-orange-500">
            <User size={24} />
            <span className="font-medium">Account</span>
            <ChevronDown size={16} />
          </div>

          <div className="flex items-center gap-1 cursor-pointer hover:text-orange-500">
            <HelpCircle size={24} />
            <span className="font-medium">Help</span>
            <ChevronDown size={16} />
          </div>

          <a href="/cart" className="flex items-center gap-1 font-medium hover:text-orange-500">
            <div className="relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">0</span>
            </div>
            Cart
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;