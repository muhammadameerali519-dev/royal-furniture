import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Gemini API
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API Client initialized successfully.");
  } else {
    console.warn("GEMINI_API_KEY is not set or using default value. AI features will fallback to client-side rule-based system.");
  }
} catch (err) {
  console.error("Failed to initialize Gemini API Client:", err);
}

// Inquiries Storage
const INQUIRIES_FILE = path.join(process.cwd(), "inquiries.json");

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  productName?: string;
  productId?: string;
  finish?: string;
  fabric?: string;
  createdAt: string;
  status: "new" | "contacted" | "completed";
}

// Seed inquiries if not exists
const seedInquiries: Inquiry[] = [
  {
    id: "inq_1",
    name: "Zainab Malik",
    phone: "0300 1234567",
    email: "zainab.malik@gmail.com",
    message: "I am interested in customizing the Royal Modern Bed with a dark walnut finish and premium royal velvet beige fabric. Please provide pricing and delivery timeline to Lahore.",
    productName: "The Royal Modern Bed",
    productId: "prod_bed_1",
    finish: "Dark Walnut",
    fabric: "Royal Beige Velvet",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "new"
  },
  {
    id: "inq_2",
    name: "Chaudhary Nabeel",
    phone: "0321 7654321",
    email: "nabeel.guj@yahoo.com",
    message: "Would love to book a showroom visit this Saturday for furnishing our new villa in Sukhchain Town, Gujranwala. Do you offer complete interior packages?",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "contacted"
  },
  {
    id: "inq_3",
    name: "Dr. Asim Shah",
    phone: "0333 9876543",
    email: "dr.asim@hotmail.com",
    message: "Interested in the Imperial Chesterfield Sofa Set in deep emerald velvet. Can you share dimensions and fabric samples?",
    productName: "Imperial Chesterfield Sofa Set",
    productId: "prod_sofa_1",
    finish: "Mahogany Wood",
    fabric: "Emerald Velvet",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed"
  }
];

function getInquiries(): Inquiry[] {
  try {
    if (!fs.existsSync(INQUIRIES_FILE)) {
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(seedInquiries, null, 2));
      return seedInquiries;
    }
    const data = fs.readFileSync(INQUIRIES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading inquiries:", err);
    return seedInquiries;
  }
}

function saveInquiries(inquiries: Inquiry[]) {
  try {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));
  } catch (err) {
    console.error("Error saving inquiries:", err);
  }
}

// --- API ROUTES ---

// Submit customer inquiry
app.post("/api/inquiries", (req, res) => {
  try {
    const { name, phone, email, message, productName, productId, finish, fabric } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ error: "Name, phone, and message are required." });
    }

    const inquiries = getInquiries();
    const newInquiry: Inquiry = {
      id: "inq_" + Date.now(),
      name,
      phone,
      email: email || "",
      message,
      productName,
      productId,
      finish,
      fabric,
      createdAt: new Date().toISOString(),
      status: "new"
    };

    inquiries.unshift(newInquiry);
    saveInquiries(inquiries);

    res.status(201).json({ success: true, inquiry: newInquiry });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all inquiries (Admin)
app.get("/api/inquiries", (req, res) => {
  try {
    const inquiries = getInquiries();
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update inquiry status (Admin)
app.patch("/api/inquiries/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !["new", "contacted", "completed"].includes(status)) {
      return res.status(400).json({ error: "Valid status is required." });
    }

    const inquiries = getInquiries();
    const index = inquiries.findIndex((inq) => inq.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Inquiry not found." });
    }

    inquiries[index].status = status;
    saveInquiries(inquiries);

    res.json({ success: true, inquiry: inquiries[index] });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete inquiry (Admin)
app.delete("/api/inquiries/:id", (req, res) => {
  try {
    const { id } = req.params;
    const inquiries = getInquiries();
    const filtered = inquiries.filter((inq) => inq.id !== id);
    saveInquiries(filtered);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// AI interior design consultant chat with Gemini
app.post("/api/gemini/chat", async (req, res) => {
  const { messages } = req.body; // Array of { role: 'user' | 'model', content: string }
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  // Format messages for @google/genai
  // Convert messages to what the SDK expects (contents, with roles mapped to 'user' and 'model')
  const contents = messages.map((msg: any) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }]
  }));

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: `You are the chief Interior Design Consultant for "Royal Furniture & Interiors", a super-premium, ultra-luxurious, and high-end furniture brand located in Gujranwala, Pakistan.
Your brand stands for the peak of craftsmanship, using pure wood (Sheesham/Rosewood, Walnut, Mahogany), hand-carved classical details, gold-leaf gilding, and luxurious fabrics.
Your client base consists of elite and high-net-worth individuals in Pakistan.
Your tone must be incredibly sophisticated, prestigious, polished, polite, and helpful.
Give design tips, advise them on colors (e.g. gold, royal blue, warm beige, deep walnut, emerald), dimensions, room layout, and match their requests specifically to Royal Furniture collections:
- "The Royal Modern Bed" (Walnut Wood, Elegant gold lining, velvet upholstery)
- "Imperial Chesterfield Sofa Set" (Full tufted deep emerald or maroon velvet, mahogany feet)
- "Royal Banquet Dining Table" (Solid Rosewood, hand-carved borders, seats 8-12)
- "Presidential Executive Desk" (Luxurious leather insert, brass cable grommets, rosewood)
- "Majestic Velvet Lounge Chair" (Classic wingback, brass studding)

Always try to guide the client towards choosing premium custom-made packages or visiting the flagship showroom at Ghordor Rd, near Sukhchain Town, Wahdat Colony, Gujranwala, Pakistan (contact: 0321 4567007). Highlight that custom sizes and custom fabrics are easily arranged to suit their luxurious villas! Keep responses visually structured using bullet points where appropriate, and elegant in presentation.`
        }
      });

      const responseText = response.text || "I am currently fine-tuning your luxury design recommendation. Please request again in a moment.";
      res.json({ text: responseText });
    } else {
      // Rule-based fallback if API key is not active/available
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
      let reply = "As your Royal Furniture & Interiors design consultant, I would be delighted to help you create your dream home! ";

      if (lastMessage.includes("bed") || lastMessage.includes("bedroom")) {
        reply += "For a luxurious master bedroom, I highly recommend our signature **The Royal Modern Bed**. It is crafted from premium walnut wood with gold brass linings, paired with luxurious royal beige velvet headboarding. I suggest pairing it with high-contrast warm lighting and deep amber rugs.";
      } else if (lastMessage.includes("sofa") || lastMessage.includes("living") || lastMessage.includes("couch")) {
        reply += "For an elite living room experience, our **Imperial Chesterfield Sofa Set** in emerald green velvet is unmatched. The deep tufting, solid mahogany frame, and hand-fitted brass studs bring timeless grandeur to any space.";
      } else if (lastMessage.includes("dining") || lastMessage.includes("table") || lastMessage.includes("eat")) {
        reply += "Our **Royal Banquet Dining Table** in solid rosewood is the ultimate centerpiece. It accommodates 8 to 12 guests with exquisite hand-carved floral borders and gold-leaf highlights, perfect for elegant formal dinners.";
      } else if (lastMessage.includes("color") || lastMessage.includes("theme")) {
        reply += "Our signature luxurious palette consists of **Deep Walnut & Matte Gold** or **Royal Beige & Deep Emerald**. Combining rich wood grain with brass details and plush velvets creates an instantly expensive, sophisticated ambiance.";
      } else {
        reply += "I would love to invite you to our flagship showroom at **Ghordor Rd, near Sukhchain Town, Wahdat Colony, Gujranwala**. There, we can sit down over tea and explore custom fabrics, hand-carved patterns, and 3D floor plans. Feel free to call us directly at **0321 4567007**.";
      }

      res.json({ text: reply });
    }
  } catch (err: any) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Design assistant had a temporary issue: " + err.message });
  }
});

// Vite server integration
import { createServer as createViteServer } from "vite";

async function start() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
