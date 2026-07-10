import { Menu, X, Phone, ShoppingBag, Eye } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function Navbar({ currentPath, onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "home" },
    { name: "Collections", path: "shop" },
    { name: "3D Room Planner", path: "planner" },
    { name: "About Us", path: "about" },
    { name: "Contact Us", path: "contact" }
  ];

  return (
    <nav id="royal_navbar" className="sticky top-0 z-50 bg-[#0F0E0C]/90 backdrop-blur-md border-b border-[#C5A059]/10 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
      {/* Brand Logo */}
      <div 
        onClick={() => onNavigate("home")} 
        className="flex items-center space-x-2 cursor-pointer group"
      >
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full border border-[#C5A059]/30 bg-[#1A1614] group-hover:border-[#C5A059] transition-all duration-300 shadow-[0_0_15px_rgba(197,160,89,0.1)]">
          <span className="text-[#C5A059] font-serif font-bold text-lg">R</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[#E5E1DA] font-serif tracking-[0.2em] font-medium text-lg leading-none group-hover:text-[#C5A059] transition-colors duration-300">ROYAL</span>
          <span className="text-[#C5A059]/60 text-[8px] tracking-[0.3em] font-sans font-semibold uppercase leading-none mt-1">Furniture & Interiors</span>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden lg:flex items-center space-x-8">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`relative py-2 text-sm tracking-widest uppercase font-sans transition-all duration-300 hover:text-[#C5A059] cursor-pointer ${
                isActive ? "text-[#C5A059] font-medium" : "text-[#E5E1DA]/70"
              }`}
            >
              {item.name}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Call To Action Buttons */}
      <div className="hidden lg:flex items-center space-x-4">
        <button 
          onClick={() => onNavigate("planner")}
          className="flex items-center space-x-2 border border-[#C5A059]/30 hover:border-[#C5A059] px-4 py-2 rounded-full text-xs uppercase tracking-wider text-[#C5A059] transition-all duration-300 bg-white/5 hover:bg-[#C5A059]/10"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Interactive 3D Planner</span>
        </button>

        <a 
          href="tel:03214567007" 
          className="flex items-center space-x-2 bg-[#C5A059] hover:bg-[#AA8620] text-stone-950 font-semibold px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(197,160,89,0.25)]"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>0321 4567007</span>
        </a>

        <button 
          onClick={() => onNavigate("admin")}
          className="text-[#E5E1DA]/40 hover:text-[#E5E1DA] text-xs tracking-wider transition-colors duration-300"
        >
          Admin
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 text-[#C5A059] hover:bg-stone-900 rounded-full transition-all duration-300"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="absolute top-[73px] left-0 right-0 bg-[#0F0E0C] border-b border-[#C5A059]/20 flex flex-col p-6 lg:hidden space-y-4 shadow-2xl z-40 animate-fade-in">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  onNavigate(item.path);
                  setIsOpen(false);
                }}
                className={`text-left py-3 text-sm uppercase tracking-widest border-b border-stone-900/40 ${
                  isActive ? "text-[#C5A059] font-semibold pl-2" : "text-[#E5E1DA]/70 pl-0"
                } transition-all duration-300`}
              >
                {item.name}
              </button>
            );
          })}
          
          <div className="flex flex-col pt-4 space-y-3">
            <button
              onClick={() => {
                onNavigate("planner");
                setIsOpen(false);
              }}
              className="flex justify-center items-center space-x-2 border border-[#C5A059]/30 p-3 rounded-xl text-sm uppercase tracking-wider text-[#C5A059]"
            >
              <Eye className="w-4 h-4" />
              <span>3D Room Planner</span>
            </button>
            <a
              href="tel:03214567007"
              className="flex justify-center items-center space-x-2 bg-[#C5A059] text-stone-950 p-3 rounded-xl text-sm font-semibold uppercase tracking-wider shadow-lg"
            >
              <Phone className="w-4 h-4" />
              <span>Call: 0321 4567007</span>
            </a>
            <button
              onClick={() => {
                onNavigate("admin");
                setIsOpen(false);
              }}
              className="text-[#E5E1DA]/40 hover:text-[#E5E1DA]/80 text-xs py-2 text-center tracking-wider"
            >
              Staff Portal Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
