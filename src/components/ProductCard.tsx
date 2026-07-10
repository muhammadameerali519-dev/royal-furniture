import React from "react";
import { Sparkles, ArrowUpRight, Check } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onQuickView: (product: Product) => void;
  onInquire: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView, onInquire }: ProductCardProps): React.JSX.Element {
  return (
    <div 
      id={`product_${product.id}`}
      className="group ios-card overflow-hidden transition-all duration-500 flex flex-col hover:border-[#C5A059]/40 hover:shadow-[0_10px_30px_rgba(197,160,89,0.08)]"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-900/40">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Shadow Mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.isBestSeller && (
            <span className="flex items-center space-x-1 border border-[#C5A059]/40 bg-[#0F0E0C]/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase font-semibold text-[#C5A059] tracking-wider shadow-md">
              <Sparkles className="w-3 h-3" />
              <span>Bestseller</span>
            </span>
          )}
          {product.category === "bedroom" && (
            <span className="border border-white/10 bg-[#0F0E0C]/85 px-3 py-1 rounded-full text-[9px] uppercase font-semibold text-stone-300 tracking-wider">
              Signature Bed
            </span>
          )}
        </div>

        {/* Hover Fast Actions */}
        <div className="absolute bottom-4 right-4 flex space-x-2 z-10 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => onQuickView(product)}
            className="bg-[#0F0E0C]/95 hover:bg-[#C5A059] text-white hover:text-stone-950 p-2.5 rounded-full border border-white/10 hover:border-transparent backdrop-blur transition-all duration-300 shadow-lg cursor-pointer"
            title="Quick View Details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <span className="text-[#C5A059]/60 text-[10px] tracking-widest uppercase font-sans font-semibold mb-2 block">
            {product.category} COLLECTION
          </span>
          <h3 className="font-serif text-lg text-[#E5E1DA] font-light group-hover:text-[#C5A059] transition-colors duration-300 mb-2 leading-tight">
            {product.name}
          </h3>
          <p className="text-[#E5E1DA]/60 font-sans text-xs line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        <div>
          {/* Price & Primary Action */}
          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
            <div className="flex flex-col">
              <span className="text-stone-500 text-[9px] uppercase tracking-widest leading-none mb-1">Estimated Range</span>
              <span className="text-[#C5A059] font-serif text-sm font-medium">{product.priceRange}</span>
            </div>
            
            <button
              onClick={() => onQuickView(product)}
              className="text-xs uppercase tracking-widest text-stone-300 hover:text-[#C5A059] transition-colors duration-300 font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <span>View Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
