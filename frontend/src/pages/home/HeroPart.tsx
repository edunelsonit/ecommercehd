import { Smartphone, Home, Sparkles, Tv, Shirt, Utensils } from 'lucide-react';

const Hero = () => {
  const categories = [
    { name: "Official Stores", icon: <Sparkles size={18}/> },
    { name: "Appliances", icon: <Utensils size={18}/> },
    { name: "Phones & Tablets", icon: <Smartphone size={18}/> },
    { name: "Health & Beauty", icon: <Sparkles size={18}/> },
    { name: "Home & Office", icon: <Home size={18}/> },
    { name: "Electronics", icon: <Tv size={18}/> },
    { name: "Fashion", icon: <Shirt size={18}/> },
  ];

  return (
    <main className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      <div className="flex gap-4">
        {/* Category Sidebar */}
        <aside className="w-64 bg-white rounded shadow-sm hidden md:block">
          <nav className="flex flex-col py-2">
            {categories.map((cat, index) => (
              <a 
                key={index} 
                href={`/category/${cat.name.toLowerCase()}`}
                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 hover:text-orange-500 transition-colors"
              >
                {cat.icon}
                <span>{cat.name}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Hero Section */}
        <section className="flex-grow">
          <div className="w-full h-[400px] bg-orange-200 rounded shadow-sm flex items-center justify-center overflow-hidden">
             {/* Replace with your Swiper/Slider component */}
             <div className="text-center">
                <h2 className="text-4xl font-bold text-orange-800">Flash Sales</h2>
                <p className="text-lg">Up to 50% off on all electronics</p>
                <button className="mt-4 bg-white text-orange-600 px-8 py-2 rounded font-bold">Shop Now</button>
             </div>
          </div>
        </section>

        {/* Small Promo Column */}
        <aside className="w-64 hidden lg:flex flex-col gap-4">
          <div className="bg-white p-4 rounded shadow-sm h-1/2">
            <h3 className="font-bold border-b pb-2 mb-2">Help Center</h3>
            <p className="text-xs text-gray-500">Need help with your order?</p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm h-1/2">
             <h3 className="font-bold border-b pb-2 mb-2">Sell on Site</h3>
             <p className="text-xs text-gray-500">Join Hundreds of vendors.</p>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Hero;