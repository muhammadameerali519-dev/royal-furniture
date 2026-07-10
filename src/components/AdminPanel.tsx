import React, { useState, useEffect } from "react";
import { Lock, Check, Calendar, Phone, Mail, User, ShieldAlert, Sparkles, Trash2 } from "lucide-react";
import { Inquiry } from "../types";

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "new" | "contacted" | "completed">("all");

  // Fetch inquiries on login
  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchInquiries();
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === "admin" && password.trim() === "royal2026") {
      setIsLoggedIn(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Invalid username or password. (Hint: admin / royal2026)");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "new" | "contacted" | "completed") => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        // Update local state
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      }
    } catch (err) {
      console.error("Error deleting inquiry:", err);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (filter === "all") return true;
    return inq.status === filter;
  });

  return (
    <div id="admin_portal" className="py-12 px-4 md:px-12 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {!isLoggedIn ? (
        /* Secure-Looking Admin Login Screen */
        <div className="max-w-md mx-auto ios-card p-8">
          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 bg-stone-900/60 border border-[#C5A059]/30 text-[#C5A059] rounded-full flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl text-[#E5E1DA] font-light tracking-tight">Staff Portal Login</h2>
            <p className="text-[#E5E1DA]/60 font-sans text-xs tracking-wide">
              Royal Furniture & Interiors staff management login.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-stone-500 text-[10px] uppercase tracking-widest block mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., admin"
                className="w-full bg-stone-950/60 border border-stone-800/80 focus:border-[#C5A059] text-white text-xs px-4 py-3 rounded-xl focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-stone-500 text-[10px] uppercase tracking-widest block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-950/60 border border-stone-800/80 focus:border-[#C5A059] text-white text-xs px-4 py-3 rounded-xl focus:outline-none transition-colors"
              />
            </div>

            {errorMsg && (
              <p className="text-red-500 text-xs font-semibold text-center">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#C5A059] hover:bg-[#AA8620] text-[#0F0E0C] font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors duration-300 cursor-pointer shadow-md"
            >
              Sign In To Dashboard
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-stone-900 text-center text-[10px] text-stone-600">
            <span>Security protocol active • Unauthorized access is strictly logged.</span>
          </div>
        </div>
      ) : (
        /* Staff Inquiries Panel Dashboard */
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/20 text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                  Admin Authority
                </span>
                <span className="text-xs text-stone-500">• Secure Session</span>
              </div>
              <h2 className="font-serif text-3xl text-[#E5E1DA] font-light tracking-tight">Customer Inquiries Hub</h2>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchInquiries}
                className="bg-stone-950 hover:bg-stone-900 text-white text-xs px-4 py-2.5 border border-stone-800 rounded-xl cursor-pointer transition-colors"
              >
                Refresh Data
              </button>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/20 text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 ios-card p-3 !rounded-2xl">
            <span className="text-stone-500 text-[10px] uppercase tracking-widest px-3 font-semibold">Filter Status:</span>
            {(["all", "new", "contacted", "completed"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 text-xs rounded-xl uppercase tracking-wider border cursor-pointer transition-all ${
                  filter === st
                    ? "border-[#C5A059] text-[#C5A059] bg-[#C5A059]/10 font-medium"
                    : "border-stone-850 text-stone-400 hover:border-stone-700 hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* inquiries grid list */}
          {isLoading ? (
            <div className="text-center py-12 text-stone-400 text-sm">
              Loading logged customer inquires from server...
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="text-center py-16 ios-card text-stone-500 text-sm">
              No inquiries found under the status "{filter}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="ios-card hover:border-[#C5A059]/20 rounded-2xl p-6 space-y-4 flex flex-col justify-between transition-all"
                >
                  <div className="space-y-3">
                    {/* Badge & Date */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${
                          inq.status === "new"
                            ? "bg-amber-950/40 border-amber-500/35 text-amber-400"
                            : inq.status === "contacted"
                            ? "bg-blue-950/40 border-blue-500/35 text-blue-400"
                            : "bg-emerald-950/40 border-emerald-500/35 text-emerald-400"
                        }`}
                      >
                        {inq.status}
                      </span>
                      <span className="text-[10px] text-stone-500 flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-1">
                      <h4 className="text-white font-medium text-sm flex items-center space-x-2">
                        <User className="w-4 h-4 text-[#C5A059]" />
                        <span>{inq.name}</span>
                      </h4>
                      <div className="text-xs text-stone-400 flex items-center space-x-2">
                        <Phone className="w-3.5 h-3.5 text-stone-500" />
                        <a href={`tel:${inq.phone}`} className="hover:text-[#C5A059]">{inq.phone}</a>
                      </div>
                      {inq.email && (
                        <div className="text-xs text-stone-400 flex items-center space-x-2">
                          <Mail className="w-3.5 h-3.5 text-stone-500" />
                          <span className="truncate">{inq.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Selected Specifications */}
                    {(inq.productName || inq.finish) && (
                      <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-900 space-y-1 text-[11px]">
                        {inq.productName && (
                          <div>
                            <span className="text-stone-500">Product:</span>{" "}
                            <span className="text-white font-medium">{inq.productName}</span>
                          </div>
                        )}
                        {inq.finish && (
                          <div>
                            <span className="text-stone-500">Wood Finish:</span>{" "}
                            <span className="text-white font-medium">{inq.finish}</span>
                          </div>
                        )}
                        {inq.fabric && inq.fabric !== "None" && (
                          <div>
                            <span className="text-stone-500">Upholstery:</span>{" "}
                            <span className="text-white font-medium">{inq.fabric}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Customer Message */}
                    <div className="bg-stone-950 p-4 rounded-xl border border-stone-900">
                      <p className="text-stone-300 text-xs leading-relaxed italic">
                        "{inq.message}"
                      </p>
                    </div>
                  </div>

                  {/* Actions Drawer */}
                  <div className="border-t border-stone-900 pt-4 mt-2 flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleUpdateStatus(inq.id, "contacted")}
                        className="text-[10px] uppercase font-semibold border border-blue-900/40 text-blue-400 hover:bg-blue-950/20 px-2.5 py-1.5 rounded-lg cursor-pointer"
                        title="Mark as Contacted"
                      >
                        Contacted
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(inq.id, "completed")}
                        className="text-[10px] uppercase font-semibold border border-emerald-900/40 text-emerald-400 hover:bg-emerald-950/20 px-2.5 py-1.5 rounded-lg cursor-pointer"
                        title="Mark as Completed"
                      >
                        Complete
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteInquiry(inq.id)}
                      className="text-stone-500 hover:text-red-500 p-1.5 rounded-lg border border-stone-850 hover:border-red-950 transition-colors cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
