import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Smartphone, Home, Sparkles, Tv, Shirt, Utensils, HelpCircle, Store, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

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

  const slides = [
    {
      title: "Flash Sales",
      subtitle: "Up to 50% Off",
      desc: "Upgrade your lifestyle with our premium electronics and gadgets.",
      bg: "from-orange-400 to-orange-600",
      tag: "Limited Time Offer"
    },
    {
      title: "Fashion Week",
      subtitle: "New Arrivals",
      desc: "Discover the latest trends in clothing and accessories.",
      bg: "from-blue-500 to-indigo-700",
      tag: "Exclusive"
    },
    {
        title: "Grocery Deals",
        subtitle: "Fresh From Gembu",
        desc: "Get the best prices on local produce and farm inputs.",
        bg: "from-green-500 to-teal-700",
        tag: "Local Market"
    }
  ];

  return (
    <main className="w-full bg-gray-50">
      <div className="container mx-auto px-4 py-4 md:py-6 flex gap-4">
        
        {/* Category Sidebar - Desktop */}
        <aside className="w-150 bg-white rounded-lg shadow-sm hidden md:block border border-gray-100 overflow-hidden">
          <nav className="flex flex-col py-2">
            {categories.map((cat, index) => (
              <a 
                key={index} 
                href={`/category/${cat.name.toLowerCase().replace(/ /g, '-')}`}
                className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 group-hover:text-orange-500">{cat.icon}</span>
                  <span>{cat.name}</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </a>
            ))}
          </nav>
        </aside>

        {/* Hero Carousel Section */}
        <section className="flex-grow min-w-0">
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="rounded-lg shadow-md h-[300px] md:h-[420px]"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className={`relative w-full h-full bg-gradient-to-br ${slide.bg} flex items-center overflow-hidden`}>
                  {/* Decorative Elements */}
                  <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  
                  <div className="relative z-10 px-8 md:px-16 w-full md:w-2/3 text-left">
                    <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 backdrop-blur-md uppercase tracking-wider">
                       {slide.tag}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                      {slide.title} <br /> 
                      <span className="text-orange-200">{slide.subtitle}</span>
                    </h2>
                    <p className="text-white/90 mt-4 text-sm md:text-lg max-w-sm">
                      {slide.desc}
                    </p>
                    <button className="mt-8 bg-white text-orange-600 hover:bg-orange-50 px-8 py-2.5 rounded-full font-bold shadow-lg transition-transform active:scale-95">
                      Shop Now
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Small Promo Column - Desktop */}
        <aside className="w-150 hidden lg:flex flex-col gap-4">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex-grow group cursor-pointer">
            <div className="bg-blue-50 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <HelpCircle size={24} />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Help Center</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Check order status or track deliveries.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex-grow group cursor-pointer">
            <div className="bg-orange-50 text-orange-600 w-10 h-10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Store size={24} />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Sell on Elvekas</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Join hundreds of vendors in Gembu today.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Hero;