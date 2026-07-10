import { X, Send, Phone, Check, Info, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { Product } from "../types";

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
  onSubmitInquiry: (inquiryData: {
    name: string;
    phone: string;
    email: string;
    message: string;
    productName: string;
    productId: string;
    finish: string;
    fabric: string;
  }) => Promise<boolean>;
}

export default function QuickViewModal({ product, onClose, onSubmitInquiry }: QuickViewModalProps) {
  const [selectedFinish, setSelectedFinish] = useState(product.finishes[0] || "");
  const [selectedFabric, setSelectedFabric] = useState(product.fabrics ? product.fabrics[0] : "");
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    `Hello Royal Furniture, I am interested in inquiring about the "${product.name}". Please let me know the availability, final pricing, and delivery terms to my location.`
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg("Please fill in both your Name and Phone Number.");
      return;
    }
    
    setErrorMsg("");
    setIsSubmitting(true);
    
    const success = await onSubmitInquiry({
      name,
      phone,
      email,
      message,
      productName: product.name,
      productId: product.id,
      finish: selectedFinish,
      fabric: selectedFabric || "None"
    });
    
    setIsSubmitting(false);
    if (success) {
      setSubmitSuccess(true);
    } else {
      setErrorMsg("Failed to submit inquiry. Please try again or use direct WhatsApp.");
    }
  };

  const getWhatsAppLink = () => {
    const formattedText = encodeURIComponent(
      `*ROYAL FURNITURE INQUIRY*\n\n` +
      `*Customer:* ${name || "Bespoke Customer"}\n` +
      `*Phone:* ${phone || "Not provided"}\n` +
      `*Product:* ${product.name}\n` +
      `*Finish:* ${selectedFinish}\n` +
      (product.fabrics ? `*Fabric:* ${selectedFabric}\n` : "") +
      `*Message:* ${message}`
    );
    return `https://wa.me/923214567007?text=${formattedText}`;
  };

  return (
    <div id="quickview_modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0E0C]/85 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#0F0E0C] border border-[#C5A059]/20 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(197,160,89,0.15)] flex flex-col md:flex-row my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-[#1A1614] hover:bg-[#C5A059] text-[#C5A059] hover:text-stone-950 p-2 rounded-full border border-[#C5A059]/20 transition-all duration-300 shadow-md cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Product Showcase */}
        <div className="w-full md:w-1/2 bg-stone-950/40 p-6 md:p-8 flex flex-col justify-center border-r border-[#C5A059]/10">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-800/40 mb-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-4 left-4 bg-stone-900/80 backdrop-blur border border-[#C5A059]/20 px-3 py-1.5 rounded-full text-xs text-[#C5A059] font-semibold">
              Bespoke Piece
            </div>
          </div>

          <h2 className="font-serif text-2xl text-[#E5E1DA] font-light tracking-tight mb-2">
            {product.name}
          </h2>
          <span className="text-[#C5A059] font-serif text-lg font-medium mb-4 block">
            {product.priceRange}
          </span>
          
          <div className="space-y-4 text-stone-300 text-xs sm:text-sm">
            <p className="leading-relaxed font-light text-stone-400">
              {product.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4 border-t border-stone-900 pt-4 text-xs">
              <div>
                <span className="text-stone-500 uppercase tracking-widest block mb-1">Dimensions</span>
                <span className="text-stone-200 font-semibold">{product.dimensions}</span>
              </div>
              <div>
                <span className="text-stone-500 uppercase tracking-widest block mb-1">Wood Species</span>
                <span className="text-stone-200 font-semibold">{product.materials[0]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Inquiry & Customization Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-xl text-white font-light border-b border-stone-900 pb-3 mb-6">
              Customize & Inquire
            </h3>

            {/* Customization Selectors */}
            <div className="space-y-4 mb-6">
              {/* Wood Finish selection */}
              <div>
                <label className="text-stone-500 uppercase tracking-widest text-[10px] block mb-2 font-semibold">
                  Select Wood Finish
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.finishes.map((finish) => (
                    <button
                       key={finish}
                      type="button"
                      onClick={() => setSelectedFinish(finish)}
                      className={`px-3 py-2 text-xs rounded-xl border transition-all duration-300 cursor-pointer ${
                        selectedFinish === finish
                          ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                          : "border-stone-800 bg-stone-900/50 text-stone-400 hover:border-stone-700"
                      }`}
                    >
                      {finish}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric selection if applicable */}
              {product.fabrics && (
                <div>
                  <label className="text-stone-500 uppercase tracking-widest text-[10px] block mb-2 font-semibold">
                    Select Velvet / Fabric Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.fabrics.map((fabric) => (
                      <button
                        key={fabric}
                        type="button"
                        onClick={() => setSelectedFabric(fabric)}
                        className={`px-3 py-2 text-xs rounded-xl border transition-all duration-300 cursor-pointer ${
                          selectedFabric === fabric
                            ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                            : "border-stone-800 bg-stone-900/50 text-stone-400 hover:border-stone-700"
                        }`}
                      >
                        {fabric}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Invariant Success Panel */}
            {submitSuccess ? (
              <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 p-6 rounded-2xl text-center space-y-4 animate-fade-in mb-4">
                <div className="w-12 h-12 bg-[#C5A059]/20 text-[#C5A059] rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg text-[#E5E1DA] font-medium">Inquiry Submitted Successfully</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  We have saved your inquiry on our server. Our team will contact you within 24 hours. For an instant response, click the button below to message our Gujranwala showroom directly on WhatsApp!
                </p>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 w-full justify-center shadow-lg cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Connect on WhatsApp</span>
                </a>
              </div>
            ) : (
              /* Contact Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-stone-500 text-[10px] uppercase tracking-widest block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Zainab Malik"
                      className="w-full bg-stone-950/60 border border-stone-800/80 focus:border-[#C5A059] text-white text-xs px-4 py-3 rounded-xl focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-stone-500 text-[10px] uppercase tracking-widest block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g., 0300 1234567"
                      className="w-full bg-stone-950/60 border border-stone-800/80 focus:border-[#C5A059] text-white text-xs px-4 py-3 rounded-xl focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-stone-500 text-[10px] uppercase tracking-widest block mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., you@domain.com"
                    className="w-full bg-stone-950/60 border border-stone-800/80 focus:border-[#C5A059] text-white text-xs px-4 py-3 rounded-xl focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-stone-500 text-[10px] uppercase tracking-widest block mb-1">Inquiry Message</label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-stone-950/60 border border-stone-800/80 focus:border-[#C5A059] text-white text-xs px-4 py-3 rounded-xl focus:outline-none transition-colors resize-none"
                  />
                </div>

                {errorMsg && (
                  <p className="text-red-500 text-xs font-semibold">{errorMsg}</p>
                )}

                {/* Submitting Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-grow flex items-center justify-center space-x-2 bg-[#C5A059] hover:bg-[#AA8620] disabled:bg-stone-800 disabled:text-stone-500 text-stone-950 font-semibold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Submitting..." : "Send Formal Inquiry"}</span>
                  </button>

                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 border border-emerald-600/35 hover:border-emerald-600 hover:bg-emerald-600/10 text-emerald-500 px-5 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Instant WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </div>

          <div className="mt-6 flex items-center space-x-2 text-stone-600 text-[10px] bg-stone-950/40 border border-stone-900/60 p-3 rounded-xl">
            <Info className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Each masterpiece is custom-made to order. Delivery within Gujranwala is free; nationwide luxury transit is available.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
