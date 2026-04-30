

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      {/* Newsletter Section */}
      <div className="bg-gray-700 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-bold uppercase italic">Logo</h3>
            <p className="text-sm text-gray-300">New to our shop? Subscribe to our newsletter to get updates on our latest offers!</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input 
              type="email" 
              placeholder="Enter Email Address" 
              className="px-4 py-2 rounded w-full md:w-64 text-black outline-none"
            />
            <button className="bg-orange-500 px-6 py-2 rounded font-bold hover:bg-orange-600">MALE</button>
            <button className="bg-orange-500 px-6 py-2 rounded font-bold hover:bg-orange-600">FEMALE</button>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold mb-4 uppercase text-sm">Need Help?</h4>
          <ul className="text-xs space-y-2 text-gray-400">
            <li><a href="#" className="hover:underline">Help Center</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
            <li><a href="#" className="hover:underline">Track Your Order</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase text-sm">About Us</h4>
          <ul className="text-xs space-y-2 text-gray-400">
            <li><a href="#" className="hover:underline">About Shop</a></li>
            <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase text-sm">Make Money</h4>
          <ul className="text-xs space-y-2 text-gray-400">
            <li><a href="#" className="hover:underline">Sell on Shop</a></li>
            <li><a href="#" className="hover:underline">Become an Affiliate</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase text-sm">Payment Methods</h4>
          <div className="flex gap-2">
            <div className="w-10 h-6 bg-gray-500 rounded"></div>
            <div className="w-10 h-6 bg-gray-500 rounded"></div>
            <div className="w-10 h-6 bg-gray-500 rounded"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;