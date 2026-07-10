import React, { useState, useRef } from "react";
import { Sparkles, Send, RefreshCw, HelpCircle, Eye, Info, Check, Trash2, Sliders, MessageSquare } from "lucide-react";
import { Product, ChatMessage } from "../types";
import { PRODUCTS } from "../data";

interface RoomPlannerProps {
  onAddInquiry: (inquiryData: {
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

export default function RoomPlanner({ onAddInquiry }: RoomPlannerProps) {
  // Config state
  const [wallColor, setWallColor] = useState("#f4ebe1"); // Beige default
  const [wallColorName, setWallColorName] = useState("Royal Alabaster");
  const [floorType, setFloorType] = useState<"light-oak" | "dark-walnut" | "marble">("dark-walnut");
  
  // Selection state
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [selectedFinish, setSelectedFinish] = useState(PRODUCTS[0].finishes[0]);
  const [selectedFabric, setSelectedFabric] = useState(PRODUCTS[0].fabrics ? PRODUCTS[0].fabrics[0] : "");
  
  // Active furniture piece states on stage
  const [posX, setPosX] = useState(50); // percentage 0-100
  const [posY, setPosY] = useState(55); // percentage 0-100
  const [rotation, setRotation] = useState(0); // degrees
  const [scale, setScale] = useState(1); // multiplier
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_init",
      role: "assistant",
      content: "Welcome to the Royal Furniture Bespoke Planner! I am your AI Interior Design Consultant. Arrange your selected masterpiece on the visualizer stage, pick custom wall finishes, and tap 'Consult AI' below. I will evaluate your color palette, furniture selection, and give you professional design advice.",
      createdAt: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  // Direct Inquiry Form in Planner
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inqName, setInqName] = useState("");
  const [inqPhone, setInqPhone] = useState("");
  const [inqSuccess, setInqSuccess] = useState(false);

  // Available wall colors
  const WALL_COLORS = [
    { name: "Royal Alabaster", code: "#f4ebe1" },
    { name: "Sukhchain Green", code: "#1a3a2a" },
    { name: "Imperial Slate", code: "#27272a" },
    { name: "Deep Ruby Velvet", code: "#4c0519" }
  ];

  // Handle product switch
  const handleProductChange = (prodId: string) => {
    const prod = PRODUCTS.find(p => p.id === prodId);
    if (prod) {
      setSelectedProduct(prod);
      setSelectedFinish(prod.finishes[0]);
      setSelectedFabric(prod.fabrics ? prod.fabrics[0] : "");
      // Reset position slightly
      setPosX(50);
      setPosY(55);
      setRotation(0);
      setScale(1);
    }
  };

  // Ask Gemini design feedback
  const askDesignConsultant = async (customText?: string) => {
    setIsChatLoading(true);
    
    // Create detailed prompt representing current design setup
    const designConfigDescription = 
      `The client has set up the following visualizer layout in their room:\n` +
      `- Wall Paint: ${wallColorName} (Hex: ${wallColor})\n` +
      `- Flooring Style: ${floorType === "light-oak" ? "Light English Oak Wood" : floorType === "dark-walnut" ? "Premium Dark Walnut Planks" : "Carrara Marble Gloss"}\n` +
      `- Main Furniture Piece: ${selectedProduct.name}\n` +
      `- Selected Wood Finish: ${selectedFinish}\n` +
      (selectedProduct.fabrics ? `- Upholstery/Fabric Selection: ${selectedFabric}\n` : "") +
      `Layout adjustment values: X Position=${posX}%, Y Position=${posY}%, Scale=${scale}x, Rotation=${rotation}°.\n\n` +
      (customText ? `User Question: "${customText}"` : `Please evaluate this configuration and give your expert critique, material pairing tips, and accessory recommendations!`);

    const updatedMessages = [
      ...messages,
      {
        id: "msg_user_" + Date.now(),
        role: "user" as const,
        content: customText || "Consulting AI: Evaluate my current room setup.",
        createdAt: new Date().toISOString()
      }
    ];

    setMessages(updatedMessages);
    setInputValue("");

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })).concat([
            { role: "user", content: `CONTEXT:\n${designConfigDescription}` }
          ])
        })
      });
      const data = await res.json();
      
      setMessages(prev => [
        ...prev,
        {
          id: "msg_assistant_" + Date.now(),
          role: "assistant",
          content: data.text || "I apologize, I'm currently fine-tuning your luxury design recommendation. Please try again.",
          createdAt: new Date().toISOString()
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: "msg_err_" + Date.now(),
          role: "assistant",
          content: "I had a connection issue. However, visually speaking, your choice of finish and wood grain looks exquisite! Let us connect over WhatsApp to discuss fabric swatch samples.",
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Submit formal inquiry from room setup
  const submitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inqName.trim() || !inqPhone.trim()) return;

    const success = await onAddInquiry({
      name: inqName,
      phone: inqPhone,
      email: "",
      message: `Inquiry submitted via 3D Room Planner. Configuration: Wall=[${wallColorName}], Floor=[${floorType}], Item=[${selectedProduct.name}], Finish=[${selectedFinish}], Fabric=[${selectedFabric || "None"}]`,
      productName: selectedProduct.name,
      productId: selectedProduct.id,
      finish: selectedFinish,
      fabric: selectedFabric || "None"
    });

    if (success) {
      setInqSuccess(true);
    }
  };

  const getWhatsAppLink = () => {
    const text = encodeURIComponent(
      `*BESPOKE ROOM PLANNER INQUIRY*\n\n` +
      `*Customer:* ${inqName || "Bespoke Customer"}\n` +
      `*Phone:* ${inqPhone || "Not provided"}\n` +
      `*Item:* ${selectedProduct.name}\n` +
      `*Custom Finish:* ${selectedFinish}\n` +
      (selectedProduct.fabrics ? `*Custom Fabric:* ${selectedFabric}\n` : "") +
      `*Room wall:* ${wallColorName}\n` +
      `*Room floor:* ${floorType}\n` +
      `*Message:* Please arrange a showroom visit to check these wood and fabric options in person.`
    );
    return `https://wa.me/923214567007?text=${text}`;
  };

  return (
    <div id="room_planner_section" className="py-10 px-4 md:px-12 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Title block */}
      <div className="text-center space-y-2">
        <h2 className="font-serif text-3xl sm:text-5xl text-[#E5E1DA] font-light tracking-tight">
          Bespoke <span className="font-serif italic text-[#C5A059] font-normal">Room Visualizer</span>
        </h2>
        <p className="text-[#E5E1DA]/60 font-sans text-xs sm:text-sm max-w-2xl mx-auto">
          Experiment with custom fabrics, wood finishes, wall pigments, and flooring. Power your layout choices with real-time advice from our AI Interior Design Consultant.
        </p>
      </div>

      {/* Main Designer Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Grid: The Interactive Visualizer Stage (6 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex items-center justify-between ios-card !rounded-2xl px-6 py-3">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-[#C5A059]" />
              <span className="text-[#E5E1DA] text-xs uppercase tracking-wider font-semibold">Live Visualizer Stage</span>
            </div>
            <button
              onClick={() => {
                setPosX(50);
                setPosY(55);
                setRotation(0);
                setScale(1);
              }}
              className="text-[10px] text-stone-500 hover:text-white uppercase tracking-wider flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Position</span>
            </button>
          </div>

          {/* Interactive Room Canvas */}
          <div 
            className="relative flex-grow min-h-[400px] sm:min-h-[500px] rounded-3xl overflow-hidden border border-[#C5A059]/20 shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-500 flex flex-col"
            style={{ backgroundColor: wallColor }}
          >
            {/* Wall shadow accents and crown molding mock */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-stone-900/40 to-transparent border-t-4 border-stone-800" />
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-stone-950/25 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-stone-950/25 to-transparent" />

            {/* Custom Wall Framed Art placeholder to make the room look elite */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-32 border-2 border-[#C5A059]/40 bg-[#0F0E0C]/60 flex flex-col items-center justify-center text-center p-3 rounded shadow-md opacity-75">
              <span className="text-[9px] font-serif text-[#C5A059]/80 uppercase tracking-widest italic block">Royal Furniture</span>
              <span className="text-[7px] text-stone-400 font-sans tracking-wide block mt-1">Est. Gujranwala</span>
            </div>

            {/* Flooring Segment (Bottom 40%) */}
            <div className="absolute bottom-0 left-0 right-0 h-[40%] border-t-2 border-stone-900/50 shadow-inner relative overflow-hidden">
              {floorType === "dark-walnut" && (
                <div className="absolute inset-0 bg-[#3e2723] opacity-90" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.15) 40px, rgba(0,0,0,0.15) 80px)" }} />
              )}
              {floorType === "light-oak" && (
                <div className="absolute inset-0 bg-[#b58d63] opacity-85" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(0,0,0,0.1) 35px, rgba(0,0,0,0.1) 70px)" }} />
              )}
              {floorType === "marble" && (
                <div className="absolute inset-0 bg-stone-100 flex flex-col" style={{ backgroundImage: "radial-gradient(ellipse at center, rgba(230,230,230,0.8), rgba(210,210,210,0.5))" }}>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(30deg, #000 1%, transparent 2%), linear-gradient(150deg, #000 1%, transparent 2%)" }} />
                </div>
              )}
              {/* Floor perspective gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/10 pointer-events-none" />
            </div>

            {/* FURNITURE ELEMENT ON STAGE */}
            <div
              className="absolute select-none cursor-grab active:cursor-grabbing transition-all duration-100 flex flex-col items-center"
              style={{
                left: `${posX}%`,
                top: `${posY}%`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
                zIndex: 20
              }}
            >
              {/* Customized Accent Glow based on wood / fabric selection */}
              <div className="absolute inset-0 blur-3xl opacity-35 bg-amber-500 rounded-full" />
              
              {/* Actual customized furniture rendering */}
              <div className="relative group/furniture">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-48 sm:w-64 aspect-[4/3] object-cover rounded-2xl border-2 border-[#C5A059]/60 shadow-[0_15px_30px_rgba(0,0,0,0.5)] bg-stone-900"
                  referrerPolicy="no-referrer"
                  draggable={false}
                />
                
                {/* Visual Label showing chosen custom specs */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#0F0E0C]/90 border border-[#C5A059]/30 text-[#C5A059] text-[8px] sm:text-[9px] px-3 py-1 rounded-full whitespace-nowrap shadow-md tracking-wider uppercase font-semibold">
                  {selectedFinish} {selectedFabric ? `+ ${selectedFabric}` : ""}
                </div>
              </div>
            </div>

            {/* Layout Helper Overlays */}
            <div className="absolute bottom-4 left-4 z-30 bg-[#0F0E0C]/80 border border-stone-800/80 p-2 rounded-xl text-[9px] text-stone-400">
              <span className="font-semibold text-white uppercase tracking-wider block mb-1">Room Finishes Selected</span>
              <div>Wall: <span className="text-[#C5A059]">{wallColorName}</span></div>
              <div>Flooring: <span className="text-[#C5A059]">{floorType.replace("-", " ")}</span></div>
            </div>
          </div>

          {/* Quick Layout Sliders Control Panel */}
          <div className="ios-card !p-4 space-y-4">
            <div className="flex items-center space-x-2 text-stone-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <Sliders className="w-4 h-4 text-[#C5A059]" />
              <span>Spatial Controls</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-[10px] text-stone-400 uppercase tracking-widest mb-1">
                  <span>Horizontal (X)</span>
                  <span className="text-[#C5A059]">{posX}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={posX}
                  onChange={(e) => setPosX(Number(e.target.value))}
                  className="w-full accent-[#C5A059] bg-stone-850 h-1 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-stone-400 uppercase tracking-widest mb-1">
                  <span>Vertical (Y)</span>
                  <span className="text-[#C5A059]">{posY}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="80"
                  value={posY}
                  onChange={(e) => setPosY(Number(e.target.value))}
                  className="w-full accent-[#C5A059] bg-stone-850 h-1 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-stone-400 uppercase tracking-widest mb-1">
                  <span>Rotation (Angle)</span>
                  <span className="text-[#C5A059]">{rotation}°</span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full accent-[#C5A059] bg-stone-850 h-1 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-stone-400 uppercase tracking-widest mb-1">
                  <span>Scale / Size</span>
                  <span className="text-[#C5A059]">{scale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.3"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full accent-[#C5A059] bg-stone-850 h-1 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Grid: Configuration Panel & AI Chat (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          
          {/* Section 1: Swatches Customizer Card */}
          <div className="ios-card !p-6 space-y-6 shadow-md">
            <h3 className="font-serif text-lg text-[#E5E1DA] font-light border-b border-stone-800 pb-3 flex items-center justify-between">
              <span>Bespoke Palette</span>
              <span className="text-[10px] uppercase font-sans tracking-widest text-stone-500">Gujranwala Pure wood</span>
            </h3>

            {/* Step 1: Select Piece */}
            <div>
              <label className="text-stone-500 uppercase tracking-widest text-[10px] font-semibold block mb-2">
                1. Select Masterpiece Item
              </label>
              <select
                value={selectedProduct.id}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full bg-stone-950/60 border border-stone-800/80 text-stone-200 text-xs py-3 px-4 rounded-xl focus:outline-none focus:border-[#C5A059] cursor-pointer"
              >
                {PRODUCTS.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                ))}
              </select>
            </div>

            {/* Step 2: Select Finish & Fabric */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-stone-500 uppercase tracking-widest text-[10px] font-semibold block mb-2">
                  2. Wood Finish
                </label>
                <select
                  value={selectedFinish}
                  onChange={(e) => setSelectedFinish(e.target.value)}
                  className="w-full bg-stone-950/60 border border-stone-800/80 text-stone-200 text-xs py-2 px-3 rounded-xl focus:outline-none focus:border-[#C5A059] cursor-pointer"
                >
                  {selectedProduct.finishes.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-stone-500 uppercase tracking-widest text-[10px] font-semibold block mb-2">
                  3. Premium Upholstery
                </label>
                {selectedProduct.fabrics ? (
                  <select
                    value={selectedFabric}
                    onChange={(e) => setSelectedFabric(e.target.value)}
                    className="w-full bg-stone-950/60 border border-stone-800/80 text-stone-200 text-xs py-2 px-3 rounded-xl focus:outline-none focus:border-[#C5A059] cursor-pointer"
                  >
                    {selectedProduct.fabrics.map(fb => (
                      <option key={fb} value={fb}>{fb}</option>
                    ))}
                  </select>
                ) : (
                  <div className="text-stone-600 text-[10px] uppercase py-2 tracking-wider">No Upholstery</div>
                )}
              </div>
            </div>

            {/* Step 3: Room Finishes */}
            <div className="grid grid-cols-2 gap-4 border-t border-stone-800/80 pt-4">
              <div>
                <label className="text-stone-500 uppercase tracking-widest text-[10px] font-semibold block mb-2">
                  4. Wall Paint
                </label>
                <div className="flex gap-1.5">
                  {WALL_COLORS.map(wc => (
                    <button
                      key={wc.code}
                      onClick={() => {
                        setWallColor(wc.code);
                        setWallColorName(wc.name);
                      }}
                      className={`w-6 h-6 rounded-full border cursor-pointer transition-transform ${
                        wallColor === wc.code ? "scale-125 border-white" : "border-stone-850"
                      }`}
                      style={{ backgroundColor: wc.code }}
                      title={wc.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-stone-500 uppercase tracking-widest text-[10px] font-semibold block mb-2">
                  5. Flooring Tone
                </label>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setFloorType("dark-walnut")}
                    className={`text-[9px] uppercase px-2 py-1 border rounded cursor-pointer ${
                      floorType === "dark-walnut" ? "border-[#C5A059] text-[#C5A059] bg-[#C5A059]/5" : "border-stone-800 text-stone-400"
                    }`}
                  >
                    Walnut
                  </button>
                  <button
                    onClick={() => setFloorType("light-oak")}
                    className={`text-[9px] uppercase px-2 py-1 border rounded cursor-pointer ${
                      floorType === "light-oak" ? "border-[#C5A059] text-[#C5A059] bg-[#C5A059]/5" : "border-stone-800 text-stone-400"
                    }`}
                  >
                    Oak
                  </button>
                  <button
                    onClick={() => setFloorType("marble")}
                    className={`text-[9px] uppercase px-2 py-1 border rounded cursor-pointer ${
                      floorType === "marble" ? "border-[#C5A059] text-[#C5A059] bg-[#C5A059]/5" : "border-stone-800 text-stone-400"
                    }`}
                  >
                    Marble
                  </button>
                </div>
              </div>
            </div>

            {/* Inquiry Trigger */}
            <div className="pt-2">
              {showInquiryForm ? (
                inqSuccess ? (
                  <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 p-4 rounded-xl text-center space-y-3">
                    <Check className="w-5 h-5 text-[#C5A059] mx-auto" />
                    <span className="text-xs text-white block font-medium">Bespoke Inquiry Logged!</span>
                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[10px] py-2 px-4 rounded-lg tracking-wider uppercase w-full cursor-pointer"
                    >
                      <span>Forward to WhatsApp</span>
                    </a>
                  </div>
                ) : (
                  <form onSubmit={submitInquiry} className="space-y-3 bg-[#0F0E0C] p-4 rounded-2xl border border-stone-800/80 animate-fade-in">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] uppercase text-[#C5A059] font-semibold tracking-wider">Fast Inquiry Register</span>
                      <button type="button" onClick={() => setShowInquiryForm(false)} className="text-[10px] text-stone-500 hover:text-stone-300">Cancel</button>
                    </div>
                    <input
                      type="text"
                      required
                      value={inqName}
                      onChange={(e) => setInqName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-stone-900 border border-stone-800/80 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#C5A059] text-white"
                    />
                    <input
                      type="tel"
                      required
                      value={inqPhone}
                      onChange={(e) => setInqPhone(e.target.value)}
                      placeholder="Your WhatsApp/Phone"
                      className="w-full bg-stone-900 border border-stone-800/80 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#C5A059] text-white"
                    />
                    <button
                      type="submit"
                      className="w-full bg-[#C5A059] hover:bg-[#AA8620] text-stone-950 font-bold text-[10px] py-2.5 rounded-lg uppercase tracking-wider cursor-pointer"
                    >
                      Submit Room Inquiry
                    </button>
                  </form>
                )
              ) : (
                <button
                  onClick={() => setShowInquiryForm(true)}
                  className="w-full bg-stone-900/40 border border-[#C5A059]/30 hover:border-[#C5A059] text-[#C5A059] font-semibold text-xs py-3.5 rounded-xl uppercase tracking-widest transition-all duration-300 cursor-pointer text-center block"
                >
                  Inquire For This Configuration
                </button>
              )}
            </div>
          </div>

          {/* Section 2: AI Consultant Chat Panel */}
          <div className="ios-card !p-5 flex flex-col h-[350px] shadow-md justify-between">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-[#C5A059]" />
                <span className="text-[#E5E1DA] text-xs uppercase tracking-wider font-semibold">AI Design Critic Feedback</span>
              </div>
              <span className="flex items-center space-x-1 border border-emerald-950 bg-emerald-950/40 text-emerald-400 text-[8px] px-2 py-0.5 rounded-full uppercase tracking-widest font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active</span>
              </span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-grow overflow-y-auto space-y-3 mb-3 pr-2 scrollbar-thin">
              {messages.map((m) => (
                <div 
                  key={m.id}
                  className={`p-3 rounded-2xl text-[11px] leading-relaxed max-w-[85%] ${
                    m.role === "assistant" 
                      ? "bg-stone-950/60 border border-stone-900/60 text-stone-300 self-start mr-auto" 
                      : "bg-[#C5A059]/15 border border-[#C5A059]/20 text-white self-end ml-auto"
                  }`}
                >
                  <span className="block font-semibold uppercase tracking-wider text-[8px] text-[#C5A059] mb-1">
                    {m.role === "assistant" ? "Royal Consultant" : "Bespoke Customer"}
                  </span>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              ))}
              {isChatLoading && (
                <div className="p-3 rounded-2xl text-[11px] bg-stone-950/60 border border-stone-900/60 text-stone-400 flex items-center space-x-2 w-[40%]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C5A059]" />
                  <span className="font-semibold uppercase tracking-widest text-[8px] text-stone-500">Evaluating...</span>
                </div>
              )}
            </div>

            {/* Consultation trigger box */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask advice (e.g. 'What rug goes with this?')"
                className="flex-grow bg-stone-950/60 border border-stone-850 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#C5A059]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isChatLoading) {
                    askDesignConsultant(inputValue);
                  }
                }}
              />
              <button
                onClick={() => askDesignConsultant(inputValue || undefined)}
                disabled={isChatLoading}
                className="bg-[#C5A059] hover:bg-[#AA8620] disabled:bg-stone-800 text-stone-950 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Consult AI
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
