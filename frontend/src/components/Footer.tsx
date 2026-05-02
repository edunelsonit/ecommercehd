
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      {/* Newsletter Section */}
      <div className="bg-gray-700 py-8">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="text-center lg:text-left">
            <h3 className="text-xl font-bold uppercase italic text-orange-500">ELVEKAS</h3>
            <p className="text-sm text-gray-300 max-w-md">
              New to our shop? Subscribe to our newsletter to get updates on our latest offers!
            </p>
          </div>
          
          <form className="flex flex-col sm:flex-row w-full lg:w-auto gap-2" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter Email Address" 
              className="px-4 py-2.5 rounded-lg w-full lg:w-80 text-black outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-orange-500 px-4 py-2.5 rounded-lg font-bold hover:bg-orange-600 transition-colors text-xs">
                MALE
              </button>
              <button type="submit" className="flex-1 bg-orange-500 px-4 py-2.5 rounded-lg font-bold hover:bg-orange-600 transition-colors text-xs">
                FEMALE
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Links Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h4 className="font-bold mb-4 uppercase text-sm tracking-wider">Need Help?</h4>
            <ul className="text-xs space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white hover:underline transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition">Track Your Order</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition">Returns & Refunds</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 uppercase text-sm tracking-wider">About Us</h4>
            <ul className="text-xs space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white hover:underline transition">About Elvekas</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition">Flash Sales</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 uppercase text-sm tracking-wider">Make Money</h4>
            <ul className="text-xs space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white hover:underline transition">Sell on Elvekas</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition">Become an Affiliate</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition">Vendor Hub</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 uppercase text-sm tracking-wider">Payment Methods</h4>
            <div className="flex flex-wrap gap-3 mt-2">
              {/* Using colored divs as placeholders for logos */}
              <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center text-[10px] text-gray-400 border border-gray-600">VISA</div>
              <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center text-[10px] text-gray-400 border border-gray-600">M/C</div>
              <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center text-[10px] text-gray-400 border border-gray-600">VERVE</div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Elvekas Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;