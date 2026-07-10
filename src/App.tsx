import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  ThumbsUp, 
  Star, 
  ArrowRight, 
  Search, 
  Calendar,
  Layers,
  Heart,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";

// Data & Types
import { PRODUCTS, CATEGORIES, REVIEWS, CRAFTSMANSHIP_IMAGE } from "./data";
import { Product, Inquiry } from "./types";

// Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import QuickViewModal from "./components/QuickViewModal";
import RoomPlanner from "./components/RoomPlanner";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>("home");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Custom Floating Inquiry Widgets
  const [showFloatInquiry, setShowFloatInquiry] = useState(false);
  const [floatName, setFloatName] = useState("");
  const [floatPhone, setFloatPhone] = useState("");
  const [floatMessage, setFloatMessage] = useState("Hello Royal Furniture, I would like to schedule a showroom visit this week.");
  const [floatSuccess, setFloatSuccess] = useState(false);

  // Reviews Index slider
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  // Hash router synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#/", "");
      if (hash && ["home", "shop", "planner", "about", "contact", "admin"].includes(hash)) {
        setCurrentPath(hash);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setCurrentPath("home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    // Initial load
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const navigateTo = (path: string) => {
    window.location.hash = `#/${path}`;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit Inquiry Endpoint handler
  const handleInquirySubmit = async (inquiryData: {
    name: string;
    phone: string;
    email: string;
    message: string;
    productName: string;
    productId: string;
    finish: string;
    fabric: string;
  }): Promise<boolean> => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryData),
      });
      if (res.ok) {
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to submit inquiry to server:", err);
      return false;
    }
  };

  // Submit generic contact floating inquiry
  const handleGenericInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!floatName.trim() || !floatPhone.trim()) return;

    const success = await handleInquirySubmit({
      name: floatName,
      phone: floatPhone,
      email: "",
      message: floatMessage,
      productName: "General Showroom Visit",
      productId: "visit_general",
      finish: "Standard",
      fabric: "Standard"
    });

    if (success) {
      setFloatSuccess(true);
      setTimeout(() => {
        setFloatSuccess(false);
        setFloatName("");
        setFloatPhone("");
        setShowFloatInquiry(false);
      }, 4000);
    }
  };

  // Filtered product items
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0F0E0C] text-stone-100 flex flex-col justify-between selection:bg-[#C5A059]/30 selection:text-white">
      
      {/* 1. Header / Navigation */}
      <Navbar currentPath={currentPath} onNavigate={navigateTo} />

      {/* 2. Page Router stage with smooth framer transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* HOME VIEW */}
            {currentPath === "home" && (
              <div className="space-y-20 pb-20">
                {/* Hero section */}
                <Hero 
                  onExplore={() => navigateTo("shop")} 
                  onNavigatePlanner={() => navigateTo("planner")} 
                />

                {/* Popular Categories Sliding Marquee */}
                <div className="bg-stone-950 border-y border-[#C5A059]/10 py-6 overflow-hidden">
                  <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <span className="text-[#C5A059] text-xs uppercase tracking-widest font-semibold whitespace-nowrap mr-8">
                      Elite Collections:
                    </span>
                    <div className="flex space-x-12 animate-infinite-scroll overflow-x-auto scrollbar-none py-1">
                      {CATEGORIES.filter(c => c.id !== "all").map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            navigateTo("shop");
                          }}
                          className="text-stone-400 hover:text-white text-xs uppercase tracking-widest whitespace-nowrap transition-colors cursor-pointer"
                        >
                          ✦ {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Featured Products Showcase */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                      <span className="text-[#C5A059] uppercase tracking-widest text-[10px] font-bold block">
                        CHOSEN MASTERPIECES
                      </span>
                      <h2 className="font-serif text-3xl sm:text-5xl text-white font-light tracking-tight">
                        Our <span className="font-serif italic text-[#C5A059] font-normal">Best Sellers</span>
                      </h2>
                    </div>
                    <button
                      onClick={() => navigateTo("shop")}
                      className="text-[#C5A059] text-xs uppercase tracking-widest font-semibold flex items-center space-x-1 hover:text-white transition-colors cursor-pointer"
                    >
                      <span>View All Masterpieces</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PRODUCTS.filter(p => p.isBestSeller).map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onQuickView={(p) => setSelectedProduct(p)}
                        onInquire={(p) => {
                          setSelectedProduct(p);
                        }}
                      />
                    ))}
                  </div>
                </section>

                {/* Exceptional Wood Craftsmanship Spotlight */}
                <section className="bg-stone-950 border-y border-[#C5A059]/15 py-16 md:py-24">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Craft Image */}
                    <div className="lg:col-span-5 relative group">
                      <div className="absolute inset-0 border border-[#C5A059]/30 rounded-2xl -translate-x-3 translate-y-3 pointer-events-none group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300" />
                      <img
                        src={CRAFTSMANSHIP_IMAGE}
                        alt="Pure wood carving craftsmanship"
                        className="w-full aspect-[4/3] object-cover rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#C5A059]/20 relative z-10"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Craft Text Sourcing */}
                    <div className="lg:col-span-7 space-y-6">
                      <span className="text-[#C5A059] text-[10px] uppercase tracking-widest font-bold flex items-center space-x-2">
                        <span>THE PEAK OF ARTISTRY</span>
                      </span>
                      <h2 className="font-serif text-3xl sm:text-5xl text-white font-light leading-tight">
                        Authentic Pure Wood 
                        <br />
                        <span className="font-serif italic text-[#C5A059] font-normal">Gujranwala Carving</span>
                      </h2>
                      <p className="text-stone-400 text-sm sm:text-base leading-relaxed font-light">
                        For over ten years, Royal Furniture & Interiors has preserved the rich, ancestral woodcarving traditions of Gujranwala. Each piece of our signature **Modern Bed** and formal dining suites is hand-sculpted from pure, carefully seasoned Shisham (Rosewood) and walnut timber. 
                      </p>
                      <p className="text-stone-400 text-sm sm:text-base leading-relaxed font-light">
                        Our master artisans carve intricate patterns by hand, applying rich multilayer walnut oils, gold brass inlays, and gold leaf gilding to create absolute heirloom assets that feel remarkably expensive.
                      </p>

                      <div className="grid grid-cols-3 gap-6 pt-4 border-t border-stone-900">
                        <div>
                          <span className="font-serif text-2xl sm:text-3xl text-white font-semibold">10+</span>
                          <span className="text-[10px] text-stone-500 uppercase tracking-widest block mt-1">Years Experience</span>
                        </div>
                        <div>
                          <span className="font-serif text-2xl sm:text-3xl text-white font-semibold">100%</span>
                          <span className="text-[10px] text-stone-500 uppercase tracking-widest block mt-1">Seasoned Wood</span>
                        </div>
                        <div>
                          <span className="font-serif text-2xl sm:text-3xl text-white font-semibold">500+</span>
                          <span className="text-[10px] text-stone-500 uppercase tracking-widest block mt-1">Villas Furnished</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Why Choose Royal (Trust badging) */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                  <div className="text-center space-y-2">
                    <span className="text-[#C5A059] text-[10px] uppercase tracking-widest font-bold">UNCOMPROMISING STANDARDS</span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
                      Why Choose <span className="font-serif italic text-[#C5A059]">Royal Furniture</span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Badge 1 */}
                    <div className="ios-card rounded-2xl p-8 space-y-4 text-center hover:border-[#C5A059]/30 transition-all">
                      <div className="w-12 h-12 bg-stone-950 border border-[#C5A059]/30 text-[#C5A059] rounded-full flex items-center justify-center mx-auto shadow-md">
                        <Award className="w-5 h-5" />
                      </div>
                      <h4 className="font-serif text-lg text-white font-medium">Museum-Grade Carving</h4>
                      <p className="text-stone-400 text-xs leading-relaxed font-light">
                        No CNC machines or generic routing. Every floral relief and crown border is handcarved by local master carpenters who have honed their skill for decades.
                      </p>
                    </div>

                    {/* Badge 2 */}
                    <div className="ios-card rounded-2xl p-8 space-y-4 text-center hover:border-[#C5A059]/30 transition-all">
                      <div className="w-12 h-12 bg-stone-950 border border-[#C5A059]/30 text-[#C5A059] rounded-full flex items-center justify-center mx-auto shadow-md">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h4 className="font-serif text-lg text-white font-medium">Bespoke Timber Sourcing</h4>
                      <p className="text-stone-400 text-xs leading-relaxed font-light">
                        We source premium walnut, mahogany, and rosewood logs, naturally air-drying them for years to guarantee your furniture never warps or cracks over time.
                      </p>
                    </div>

                    {/* Badge 3 */}
                    <div className="ios-card rounded-2xl p-8 space-y-4 text-center hover:border-[#C5A059]/30 transition-all">
                      <div className="w-12 h-12 bg-stone-950 border border-[#C5A059]/30 text-[#C5A059] rounded-full flex items-center justify-center mx-auto shadow-md">
                        <ThumbsUp className="w-5 h-5" />
                      </div>
                      <h4 className="font-serif text-lg text-white font-medium">Elite Customization</h4>
                      <p className="text-stone-400 text-xs leading-relaxed font-light">
                        Select from high-end Italian velvets, French cream bouclés, or pure damask silks, customized precisely to match your villa's specific layout and dimensions.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Customer Reviews Section */}
                <section className="ios-card !border-y !border-stone-850/80 py-16">
                  <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative">
                    <div className="flex items-center justify-center space-x-1.5 text-[#C5A059] mb-2">
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 opacity-40 fill-current" />
                      <span className="text-white text-xs font-semibold uppercase tracking-widest pl-2">Google 3.6 Rating</span>
                    </div>

                    {/* Slider layout */}
                    <div className="min-h-[140px] flex flex-col justify-center">
                      <p className="font-serif text-lg sm:text-xl text-stone-300 italic font-light leading-relaxed">
                        "{REVIEWS[activeReviewIdx].comment}"
                      </p>
                      <div className="mt-6">
                        <span className="text-white font-medium tracking-wide block">{REVIEWS[activeReviewIdx].name}</span>
                        <span className="text-stone-500 text-[10px] uppercase tracking-widest mt-1 block">Verified Customer • {REVIEWS[activeReviewIdx].date}</span>
                      </div>
                    </div>

                    {/* Slider Navigation dots */}
                    <div className="flex justify-center space-x-2 pt-4">
                      {REVIEWS.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveReviewIdx(idx)}
                          className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                            activeReviewIdx === idx ? "bg-[#C5A059] w-6" : "bg-stone-800 hover:bg-stone-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </section>

                {/* Direct Showroom booking promo block */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="bg-gradient-to-r from-stone-950 via-[#1c1917] to-stone-950 border border-[#C5A059]/25 p-8 sm:p-12 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
                    <div className="space-y-3 text-center lg:text-left">
                      <span className="text-[#C5A059] text-[10px] uppercase tracking-widest font-bold">flagship EXPERIENCE</span>
                      <h3 className="font-serif text-2xl sm:text-4xl text-white font-light tracking-tight">
                        Book A Personal Showroom Consultation
                      </h3>
                      <p className="text-stone-400 text-xs sm:text-sm max-w-xl font-light">
                        Walk through our exquisitely furnished sample rooms at **Ghordor Road, Sukhchain Town, Gujranwala**. Experience the weight of seasoned rosewood and choose raw fabrics in person with our designers.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                      <button
                        onClick={() => navigateTo("contact")}
                        className="bg-[#C5A059] hover:bg-[#AA8620] text-[#0F0E0C] font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider text-center transition-all cursor-pointer shadow-lg"
                      >
                        Book Showroom Visit
                      </button>
                      <button
                        onClick={() => navigateTo("planner")}
                        className="border border-stone-800 hover:border-[#C5A059]/35 text-stone-300 hover:text-[#C5A059] px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider text-center transition-all cursor-pointer bg-stone-900/30"
                      >
                        Try Room Planner First
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* COLLECTIONS / SHOP VIEW */}
            {currentPath === "shop" && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
                {/* Header */}
                <div className="text-center space-y-2">
                  <span className="text-[#C5A059] text-[10px] uppercase tracking-widest font-bold">BESPOKE FURNITURE</span>
                  <h2 className="font-serif text-3xl sm:text-5xl text-white font-light tracking-tight">
                    The <span className="font-serif italic text-[#C5A059]">Royal Catalog</span>
                  </h2>
                  <p className="text-[#E5E1DA]/60 font-sans text-xs sm:text-sm max-w-xl mx-auto font-light">
                    Browse our customizable masterpieces. Every item is tailored to perfection regarding size, finish tone, and luxury upholstery fabrics.
                  </p>
                </div>

                {/* Filter and Search Section */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between ios-card p-4 !rounded-2xl shadow-sm">
                  {/* Category Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 text-xs uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
                          selectedCategory === cat.id
                            ? "border-[#C5A059] text-[#C5A059] bg-[#C5A059]/10 font-semibold"
                            : "border-transparent text-stone-400 hover:text-white"
                        }`}
                      >
                        {cat.name.replace("Modern ", "").replace("Premium ", "")}
                      </button>
                    ))}
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search items (e.g. bed, sofa)..."
                      className="w-full bg-stone-950/60 border border-stone-850 text-stone-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-[#C5A059] transition-all"
                    />
                  </div>
                </div>

                {/* Products Grid list */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20 ios-card text-stone-500 text-sm">
                    No items match your search or filter configuration.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onQuickView={(p) => setSelectedProduct(p)}
                        onInquire={(p) => {
                          setSelectedProduct(p);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3D ROOM PLANNER VIEW */}
            {currentPath === "planner" && (
              <RoomPlanner onAddInquiry={handleInquirySubmit} />
            )}

            {/* ABOUT US VIEW */}
            {currentPath === "about" && (
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16 pb-24">
                <div className="text-center space-y-2">
                  <span className="text-[#C5A059] text-[10px] uppercase tracking-widest font-bold">OUR HERITAGE</span>
                  <h2 className="font-serif text-3xl sm:text-5xl text-white font-light tracking-tight">
                    Where Luxury Meets <span className="font-serif italic text-[#C5A059]">Craftsmanship</span>
                  </h2>
                  <p className="text-stone-400 font-sans text-xs sm:text-sm max-w-xl mx-auto font-light">
                    The heritage, vision, and seasoned craftsmanship behind Royal Furniture & Interiors.
                  </p>
                </div>

                {/* Grid narrative */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-4 text-stone-300 text-sm font-light leading-relaxed">
                    <h3 className="font-serif text-xl text-white font-medium tracking-tight">Our Gujranwala Origins</h3>
                    <p>
                      Established in 2015, Royal Furniture & Interiors began as a small boutique workshop in Gujranwala with a singular vision: to create grand furniture that competes with global luxury standards, while utilizing pure local resources and master carving skills.
                    </p>
                    <p>
                      Gujranwala is famous for its robust metallurgical and carpentry expertise. We leveraged this rich pool of talent, assembling a team of the finest carvers who treat rosewood and seasoned walnuts as a canvas for fine sculptural art.
                    </p>
                    <p>
                      Today, Royal is a trusted symbol of prestige, furnishing elite villas, high-end offices, and bridal master bedroom suites for discerning patrons across the country.
                    </p>
                  </div>
                  
                  <div className="relative rounded-3xl overflow-hidden border border-[#C5A059]/20 shadow-lg aspect-[4/3] bg-stone-900">
                    <img
                      src={CRAFTSMANSHIP_IMAGE}
                      alt="Workshop pure wood carving"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 to-transparent" />
                    <span className="absolute bottom-4 left-4 bg-stone-900/90 border border-[#C5A059]/30 text-white text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-full font-semibold">
                      Live Carving Wood Swatch
                    </span>
                  </div>
                </div>

                {/* Core Principles bar */}
                <div className="border-t border-stone-800/80 pt-12">
                  <h3 className="font-serif text-xl text-white text-center font-light mb-8 uppercase tracking-wider">
                    Our Uncompromising Core Pillars
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <span className="text-[#C5A059] text-xs font-semibold uppercase tracking-wider block">1. Natural Timber Seasoning</span>
                      <p className="text-stone-400 text-xs leading-relaxed font-light">
                        We air-dry all wood blocks naturally. This lengthy, expensive drying protocol ensures that your furniture remains solid and fully robust against humidity fluctuations.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[#C5A059] text-xs font-semibold uppercase tracking-wider block">2. Classical Hand Carving</span>
                      <p className="text-stone-400 text-xs leading-relaxed font-light">
                        Every rosette, claw feet pedestal, and classical border ornament is chiseled entirely by hand. No synthetic polymers or quick CNC duplicates are used.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[#C5A059] text-xs font-semibold uppercase tracking-wider block">3. Multi-Step Polish Finish</span>
                      <p className="text-stone-400 text-xs leading-relaxed font-light">
                        Our finishing includes layered hand-applied natural oil polishes, gold-leaf gilding, and sealing with high-end eye-safe lacquers that accentuate natural timber grains.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CONTACT US VIEW */}
            {currentPath === "contact" && (
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12 pb-24">
                <div className="text-center space-y-2">
                  <span className="text-[#C5A059] text-[10px] uppercase tracking-widest font-bold">VISIT US</span>
                  <h2 className="font-serif text-3xl sm:text-5xl text-white font-light tracking-tight">
                    Visit Our <span className="font-serif italic text-[#C5A059]">Grand Showroom</span>
                  </h2>
                  <p className="text-stone-400 font-sans text-xs sm:text-sm max-w-xl mx-auto font-light">
                    Consult our interior design staff in person, inspect raw materials, and browse fully styled catalog setups.
                  </p>
                </div>

                {/* Grid layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  
                  {/* Left Side: Contact details / Maps Embed (5 cols) */}
                  <div className="lg:col-span-5 space-y-6 ios-card p-6 sm:p-8 rounded-3xl">
                    <h3 className="font-serif text-xl text-white font-light border-b border-stone-800 pb-3 mb-4">
                      Showroom Details
                    </h3>

                    <div className="space-y-4 text-xs sm:text-sm text-stone-300">
                      
                      <div className="flex items-start space-x-3.5">
                        <MapPin className="w-5 h-5 text-[#C5A059] shrink-0" />
                        <div>
                          <span className="text-white font-semibold block mb-1">Flagship Location</span>
                          <span>Ghordor Rd, near Sukhchain Town, Wahdat Colony, Gujranwala, 52250, Pakistan.</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3.5 border-t border-stone-800 pt-4">
                        <Phone className="w-5 h-5 text-[#C5A059] shrink-0" />
                        <div>
                          <span className="text-white font-semibold block mb-1">Inquiry Phone & WhatsApp</span>
                          <span>0321 4567007</span>
                          <span className="text-stone-500 text-[10px] block mt-1">Available 10:00 am - 10:00 pm daily</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3.5 border-t border-stone-800 pt-4">
                        <Clock className="w-5 h-5 text-[#C5A059] shrink-0" />
                        <div>
                          <span className="text-white font-semibold block mb-1">Showroom Hours</span>
                          <span>Saturday to Thursday: 10:30 am – 9:00 pm</span>
                          <span className="text-red-400 text-[10px] font-medium block mt-1">Closed Friday for Prayers</span>
                        </div>
                      </div>

                    </div>

                    {/* Google Map Mock Frame (Fully structured styled card placeholder matching high-end layout) */}
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#C5A059]/25 shadow-md mt-6">
                      {/* Styled decorative map layout representation */}
                      <div className="absolute inset-0 bg-[#1c1917] flex flex-col justify-center items-center text-center p-4">
                        <MapPin className="w-8 h-8 text-[#C5A059] mb-2 animate-bounce" />
                        <span className="text-xs text-white font-medium tracking-wide">Ghordor Rd, Sukhchain Town</span>
                        <span className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest">Gujranwala Coordinates Map</span>
                        
                        <a
                          href="https://maps.google.com/?q=Ghordor+Rd,+Wahdat+Colony,+Gujranwala"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#C5A059] hover:bg-[#AA8620] text-stone-950 font-semibold px-4 py-1.5 rounded-lg text-[10px] uppercase tracking-wider mt-4 cursor-pointer transition-colors"
                        >
                          Open In Google Maps
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Quick Showroom Booking Form (7 cols) */}
                  <div className="lg:col-span-7 ios-card p-6 sm:p-8 rounded-3xl space-y-6">
                    <h3 className="font-serif text-xl text-white font-light border-b border-stone-800 pb-3">
                      Book a Private Tour / consultation
                    </h3>

                    {floatSuccess ? (
                      <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 p-8 rounded-2xl text-center space-y-4 animate-fade-in">
                        <div className="w-12 h-12 bg-[#C5A059]/20 text-[#C5A059] rounded-full flex items-center justify-center mx-auto">
                          <Star className="w-6 h-6 fill-current animate-pulse" />
                        </div>
                        <h4 className="font-serif text-lg text-white font-medium">Bespoke Consultation Reserved</h4>
                        <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
                          We have logged your showroom visit request. Our design consultant will reach out shortly to finalize the hour. Click below to message us directly via WhatsApp.
                        </p>
                        <a
                          href={`https://wa.me/923214567007?text=${encodeURIComponent("Hello Royal Furniture, I would like to book a private showroom visit.")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-lg"
                        >
                          <Phone className="w-4 h-4" />
                          <span>WhatsApp Confirmation</span>
                        </a>
                      </div>
                    ) : (
                      <form onSubmit={handleGenericInquirySubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-stone-500 text-[10px] uppercase tracking-widest block mb-1">Your Name</label>
                            <input
                              type="text"
                              required
                              value={floatName}
                              onChange={(e) => setFloatName(e.target.value)}
                              placeholder="e.g., Zainab Malik"
                              className="w-full bg-stone-950/60 border border-stone-800/80 focus:border-[#C5A059] text-white text-xs px-4 py-3 rounded-xl focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="text-stone-500 text-[10px] uppercase tracking-widest block mb-1">Phone Number</label>
                            <input
                              type="tel"
                              required
                              value={floatPhone}
                              onChange={(e) => setFloatPhone(e.target.value)}
                              placeholder="e.g., 0300 1234567"
                              className="w-full bg-stone-950/60 border border-stone-800/80 focus:border-[#C5A059] text-white text-xs px-4 py-3 rounded-xl focus:outline-none transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-stone-500 text-[10px] uppercase tracking-widest block mb-1">Preferred Day & Hour</label>
                          <input
                            type="text"
                            required
                            value={floatMessage}
                            onChange={(e) => setFloatMessage(e.target.value)}
                            className="w-full bg-stone-950/60 border border-stone-800/80 focus:border-[#C5A059] text-white text-xs px-4 py-3 rounded-xl focus:outline-none transition-colors resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#C5A059] hover:bg-[#AA8620] text-[#0F0E0C] font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                        >
                          Request Private Visit Reservation
                        </button>
                      </form>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* ADMIN PORTAL VIEW */}
            {currentPath === "admin" && (
              <AdminPanel />
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Footer */}
      <footer className="bg-stone-950 border-t border-[#C5A059]/10 pt-16 pb-8 px-6 md:px-12 text-stone-400 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-stone-900 pb-12 mb-8">
          
          {/* Col 1 Brand detail */}
          <div className="space-y-4">
            <h4 className="font-serif text-white text-lg font-medium tracking-wider">ROYAL FURNITURE</h4>
            <p className="text-stone-500 text-xs font-light leading-relaxed">
              Bespoke, handcarved premium pure wood creations designed and tailored for luxurious villas across Pakistan. Founded in Gujranwala.
            </p>
            <div className="flex items-center space-x-1.5 text-[#C5A059]">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 opacity-40 fill-current" />
              <span className="text-white text-[11px] font-bold">Google 3.6</span>
            </div>
          </div>

          {/* Col 2 Quick Links */}
          <div className="space-y-4">
            <h5 className="font-serif text-white uppercase tracking-wider text-[11px] font-semibold">Quick Links</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigateTo("home")} className="hover:text-[#C5A059] transition-colors cursor-pointer text-left">
                  Bespoke Home
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo("shop")} className="hover:text-[#C5A059] transition-colors cursor-pointer text-left">
                  Collections Catalog
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo("planner")} className="hover:text-[#C5A059] transition-colors cursor-pointer text-left">
                  Interactive Room Planner
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo("about")} className="hover:text-[#C5A059] transition-colors cursor-pointer text-left">
                  About Our Craftsmanship
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 Showroom Address */}
          <div className="space-y-4">
            <h5 className="font-serif text-white uppercase tracking-wider text-[11px] font-semibold">Flagship Showroom</h5>
            <p className="text-stone-500 text-xs font-light leading-relaxed">
              Ghordor Rd, near Sukhchain Town, Wahdat Colony, Gujranwala, 52250, Pakistan.
            </p>
            <div className="text-stone-500 text-xs font-light">
              <div>Phone: <a href="tel:03214567007" className="text-[#C5A059] hover:underline font-semibold">0321 4567007</a></div>
              <div>Saturday - Thursday: 10:30 am – 9:00 pm</div>
              <div className="text-red-400 mt-1 font-medium">Closed Friday for Prayers</div>
            </div>
          </div>

          {/* Col 4 Social Feed Preview */}
          <div className="space-y-4">
            <h5 className="font-serif text-white uppercase tracking-wider text-[11px] font-semibold">Social Portfolios</h5>
            <p className="text-stone-500 text-xs font-light leading-relaxed">
              Follow our official media channels to see live wood chiseling, customer home reveals, and catalog drops.
            </p>
            <div className="flex gap-2 text-stone-500 text-xs">
              <span className="hover:text-white transition-colors cursor-pointer font-semibold">@royal_furniture_official</span>
              <span>•</span>
              <span className="hover:text-white transition-colors cursor-pointer font-semibold">Facebook Page</span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-600 text-xs font-light">
          <span>&copy; {new Date().getFullYear()} Royal Furniture & Interiors Gujranwala. All Rights Reserved.</span>
          <span className="flex items-center space-x-1 uppercase tracking-wider text-[10px] text-stone-600">
            <span>Bespoke Luxury Woodcraft</span>
          </span>
        </div>
      </footer>

      {/* 4. MODAL: Single Product Quick View Detail */}
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSubmitInquiry={handleInquirySubmit}
        />
      )}

      {/* 5. FLOATING COMPONENT: WhatsApp Chat Button (iOS Green minimal styling) */}
      <a
        href={`https://wa.me/923214567007?text=${encodeURIComponent("Hello Royal Furniture & Interiors, I am interested in inquiring about your modern custom bed and living room collections.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-[0_5px_25px_rgba(37,211,102,0.4)] transform hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer group"
        title="Chat on WhatsApp"
      >
        <span className="absolute right-14 bg-stone-900 border border-stone-800 text-white text-[10px] uppercase font-semibold tracking-wider py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md pointer-events-none">
          Live WhatsApp Consultation
        </span>
        <Phone className="w-6 h-6 fill-current shrink-0 rotate-[105deg]" />
      </a>

      {/* 6. FLOATING WIDGET: Consultation schedule tray on bottom-left corner */}
      <div className="fixed bottom-6 left-6 z-40">
        {showFloatInquiry ? (
          <div className="ios-card border-[#C5A059]/20 p-5 rounded-2xl shadow-xl w-72 animate-fade-in relative">
            <button 
              onClick={() => setShowFloatInquiry(false)}
              className="absolute top-2 right-2 text-stone-500 hover:text-stone-300 text-xs font-bold"
            >
              ✕
            </button>
            <h4 className="font-serif text-sm text-white font-medium mb-3 border-b border-stone-800 pb-1.5 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>Showroom Consultation</span>
            </h4>

            {floatSuccess ? (
              <p className="text-[11px] text-emerald-400 font-medium">Logged! We will coordinate via call shortly.</p>
            ) : (
              <form onSubmit={handleGenericInquirySubmit} className="space-y-2">
                <input
                  type="text"
                  required
                  value={floatName}
                  onChange={(e) => setFloatName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-stone-950/60 border border-stone-850 text-stone-200 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#C5A059]"
                />
                <input
                  type="tel"
                  required
                  value={floatPhone}
                  onChange={(e) => setFloatPhone(e.target.value)}
                  placeholder="Your Phone/WhatsApp"
                  className="w-full bg-stone-950/60 border border-stone-850 text-stone-200 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#C5A059]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#C5A059] hover:bg-[#AA8620] text-[#0F0E0C] font-bold text-[10px] py-2 rounded-lg uppercase tracking-wider cursor-pointer"
                >
                  Confirm Reservation
                </button>
              </form>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowFloatInquiry(true)}
            className="bg-stone-900/95 border border-[#C5A059]/30 text-[#C5A059] text-xs font-semibold px-4 py-3 rounded-full hover:border-[#C5A059] shadow-lg transition-all duration-300 flex items-center space-x-2 cursor-pointer backdrop-blur"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Book Showroom Tour</span>
          </button>
        )}
      </div>

    </div>
  );
}

