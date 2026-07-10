import { ArrowRight, Sparkles, Star } from "lucide-react";
import luxuryBedImg from "../assets/images/luxury_modern_bed_1783651171091.jpg";

interface HeroProps {
  onExplore: () => void;
  onNavigatePlanner: () => void;
}

export default function Hero({ onExplore, onNavigatePlanner }: HeroProps) {
  return (
    <section id="royal_hero" className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden">
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={luxuryBedImg}
          alt="Royal Modern Bed Masterpiece"
          className="w-full h-full object-cover scale-105 animate-subtle-zoom filter brightness-[0.45] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        {/* Deep luxurious color gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E0C] via-[#0F0E0C]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0E0C]/90 via-transparent to-[#0F0E0C]/90" />
      </div>

      {/* Floating Trust Badge */}
      <div className="relative z-10 flex items-center space-x-2 border border-[#C5A059]/30 bg-stone-900/60 backdrop-blur-md px-4 py-2 rounded-full mb-6 max-w-sm shadow-[0_0_15px_rgba(197,160,89,0.15)] transform hover:scale-105 transition-transform duration-300">
        <Sparkles className="w-4 h-4 text-[#C5A059]" />
        <span className="text-[#C5A059] text-xs font-semibold uppercase tracking-wider">
          Peak Wood Craftsmanship • Since 2015
        </span>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 text-center px-4 max-w-4xl flex flex-col items-center">
        <h1 className="font-serif font-light text-4xl sm:text-5xl md:text-7xl text-[#E5E1DA] tracking-tight leading-tight mb-6">
          Where <span className="font-serif italic text-[#C5A059] font-normal gold-glow-text">Craftsmanship</span>
          <br />
          Meets Luxury
        </h1>
        
        <p className="font-sans text-stone-300 text-base sm:text-xl max-w-2xl mb-10 leading-relaxed font-light">
          Discover hand-carved, pure wood creations and premium modern furniture meticulously designed in <span className="text-[#C5A059] font-medium">Gujranwala, Pakistan</span>. Crafted for elite living spaces.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={onExplore}
            className="group w-full sm:w-auto flex items-center justify-center space-x-3 bg-[#C5A059] hover:bg-[#AA8620] text-stone-950 font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_5px_30px_rgba(197,160,89,0.35)] transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span className="uppercase tracking-widest text-sm">Explore Collections</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onNavigatePlanner}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 border border-white/20 hover:border-[#C5A059]/60 hover:text-[#C5A059] bg-stone-900/40 backdrop-blur px-8 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span className="uppercase tracking-widest text-sm text-stone-100 group-hover:text-[#C5A059]">3D Room Visualizer</span>
          </button>
        </div>

        {/* Trust Ratings Badge */}
        <div className="flex items-center space-x-2 mt-12 py-2 px-4 rounded-full bg-stone-900/30 border border-stone-800 backdrop-blur-sm text-xs text-stone-400">
          <span className="font-bold text-white">Google 3.6 Rating</span>
          <div className="flex text-[#C5A059]">
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 opacity-40 fill-current" />
          </div>
          <span className="text-stone-500">|</span>
          <span className="hover:text-white transition-colors cursor-pointer">@royal_furniture_official</span>
        </div>
      </div>

      {/* Decorative Golden Line Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent" />
    </section>
  );
}
