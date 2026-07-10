import { Product } from "./types";

// Import our beautiful custom generated assets
import luxuryBedImg from "./assets/images/luxury_modern_bed_1783651171091.jpg";
import luxuryLivingImg from "./assets/images/luxury_living_room_1783651191010.jpg";
import luxuryDiningImg from "./assets/images/luxury_dining_room_1783651208558.jpg";
import woodCraftsmanshipImg from "./assets/images/wood_craftsmanship_1783651227058.jpg";

export const CRAFTSMANSHIP_IMAGE = woodCraftsmanshipImg;

export const CATEGORIES = [
  { id: "all", name: "All Masterpieces" },
  { id: "bedroom", name: "Modern Beds & Bedroom" },
  { id: "living", name: "Living Room" },
  { id: "dining", name: "Dining Room" },
  { id: "sofas", name: "Luxury Sofas" },
  { id: "office", name: "Presidential Office" },
  { id: "decor", name: "Premium Decor" }
];

export const PRODUCTS: Product[] = [
  {
    id: "prod_bed_1",
    name: "The Royal Modern Bed",
    category: "bedroom",
    priceRange: "PKR 285,000 - 450,000",
    description: "Our signature masterpiece. Designed for royal living, featuring high-gloss dark walnut framing, intricate gold-gilded accents, and a plush upholstered headboard in your choice of premium silk or velvet. Handcrafted with precision by the master carpenters of Gujranwala.",
    dimensions: "King Size (72\" W x 78\" L x 64\" H Headboard)",
    materials: ["Premium Seasoned Walnut Wood", "Solid Brass Trim", "High-Density Ortho Cushioning"],
    finishes: ["Rich Dark Walnut", "Imperial Mahogany", "Gold Gilding Trim"],
    fabrics: ["Royal Beige Velvet", "Emerald Green Velvet", "Cream Bouclé", "Sandalwood Linen"],
    image: luxuryBedImg,
    isBestSeller: true
  },
  {
    id: "prod_sofa_1",
    name: "Imperial Chesterfield Sofa Set",
    category: "sofas",
    priceRange: "PKR 350,000 - 580,000",
    description: "The epitome of timeless English grandeur. Rich emerald green velvet hand-tufted to perfection. Deep buttoning, thick rolled arms, and solid mahogany carved feet highlighted with subtle antique gold-leafing. Perfect for majestic formal drawing rooms.",
    dimensions: "3-Seater: 92\" W x 38\" D x 31\" H, 1-Seater: 42\" W",
    materials: ["Pure Shisham (Rosewood) Frame", "Heavy-Duty Pocket Springs", "Italian Deep-Button Velvet"],
    finishes: ["Imperial Mahogany", "Glossy Black Ash", "Antique Gold Trim"],
    fabrics: ["Emerald Green Velvet", "Royal Beige Velvet", "Ruby Red Silk Velvet", "Midnight Blue Velvet"],
    image: luxuryLivingImg,
    isBestSeller: true
  },
  {
    id: "prod_dining_1",
    name: "Royal Banquet Dining Table",
    category: "dining",
    priceRange: "PKR 420,000 - 750,000",
    description: "Crafted for formal feasts. A magnificent 10-seater solid wood table with exquisite hand-carved classical borders, a polished premium top showcasing deep natural grain, and grand double pedestal column bases with intricate floral relief carvings.",
    dimensions: "120\" L x 48\" W x 30\" H",
    materials: ["Pure Shisham Wood", "Natural High-Gloss Polish", "Gold Leafing"],
    finishes: ["Rich Dark Walnut", "Imperial Mahogany", "Warm Teak Finish"],
    image: luxuryDiningImg,
    isBestSeller: true
  },
  {
    id: "prod_bed_2",
    name: "Majestic Floating Bed",
    category: "bedroom",
    priceRange: "PKR 250,000 - 380,000",
    description: "A contemporary design with a luxurious floating base and built-in dimmable golden LED lighting under the frame. Styled with a low-profile premium headboard that stretches out to seamlessly merge with floating nightstands.",
    dimensions: "King Size (72\" W x 78\" L x 48\" H)",
    materials: ["Seasoned Walnut Wood", "Gold Brass Inlays", "Ambient LED Strips"],
    finishes: ["Rich Dark Walnut", "Glossy Black Ash"],
    fabrics: ["Royal Beige Velvet", "Sandalwood Linen", "Charcoal Grey Tweed"],
    image: "https://picsum.photos/seed/floatingbed/800/600",
    isBestSeller: false
  },
  {
    id: "prod_sofa_2",
    name: "Château Curvaceous Sectional",
    category: "sofas",
    priceRange: "PKR 390,000 - 620,000",
    description: "A gorgeous modern organic curve design. Upholstered in premium textured French cream bouclé, this sofa makes a bold architectural statement while offering soft, enveloping comfort. Ideal for contemporary penthouse lounges.",
    dimensions: "115\" W x 74\" D x 32\" H",
    materials: ["Reinforced Oakwood Inner Frame", "High-Density Resilient Memory Foam", "French Cream Bouclé"],
    finishes: ["Rich Dark Walnut", "Natural Light Oak"],
    fabrics: ["Cream Bouclé", "Sandalwood Linen", "Silver Mist Chenille"],
    image: "https://picsum.photos/seed/sectional/800/600",
    isBestSeller: false
  },
  {
    id: "prod_dining_2",
    name: "Sukhchain Crest Dining Chair",
    category: "dining",
    priceRange: "PKR 45,000 - 70,000 per chair",
    description: "An elegant, highly supportive chair. Features a high back with a hand-carved crest on top, padded comfortably with premium silk damask fabric, and finished in warm walnut wood tones with golden pin highlights.",
    dimensions: "22\" W x 24\" D x 44\" H",
    materials: ["Pure Shisham Wood", "Damask Jacquard Weave Silk", "Brass Nailheads"],
    finishes: ["Rich Dark Walnut", "Imperial Mahogany", "Gold Gilding Trim"],
    fabrics: ["Crimson Damask Silk", "Royal Beige Velvet", "Emerald Green Velvet"],
    image: "https://picsum.photos/seed/diningchair/800/600",
    isBestSeller: false
  },
  {
    id: "prod_office_1",
    name: "Presidential Executive Desk",
    category: "office",
    priceRange: "PKR 290,000 - 480,000",
    description: "Commands authority and supreme prestige. Finished in high-gloss mahogany with a hand-padded rich burgundy leather blotter. Features silent self-closing drawers, secret document storage slots, and hand-carved classical pillars at the corners.",
    dimensions: "78\" W x 38\" D x 31\" H",
    materials: ["Solid Walnut Wood", "Full-Grain Italian Leather", "Brass Knobs"],
    finishes: ["Imperial Mahogany", "Rich Dark Walnut"],
    image: "https://picsum.photos/seed/execdesk/800/600",
    isBestSeller: true
  },
  {
    id: "prod_decor_1",
    name: "Gilded Sukhchain Mirror",
    category: "decor",
    priceRange: "PKR 85,000 - 150,000",
    description: "A stunning ornamental floor-length or wall-mount mirror. Framed by hand-carved floral vine reliefs and finished with multi-step gold leafing. Instantly reflects luxury and expands space in grand entryways.",
    dimensions: "42\" W x 80\" H x 3\" D",
    materials: ["Solid Shisham Wood Frame", "Premium HD Silver Mirror Plate", "Gold Leafing"],
    finishes: ["Gold Gilding Trim", "Antique Silver Trim"],
    image: "https://picsum.photos/seed/goldmirror/800/600",
    isBestSeller: false
  },
  {
    id: "prod_living_1",
    name: "Alabaster Marble Console Table",
    category: "living",
    priceRange: "PKR 140,000 - 220,000",
    description: "Elegant and commanding. A pristine slab of imported Carrara marble sitting atop a solid wood base featuring hand-turned fluted wood pillars and polished brass leg caps. Ideal for display in luxurious entrance hallways.",
    dimensions: "60\" W x 16\" D x 32\" H",
    materials: ["Carrara Marble", "Solid Rosewood Legs", "Gold-Capped Feet"],
    finishes: ["Rich Dark Walnut", "Glossy Black Ash", "Natural Light Oak"],
    image: "https://picsum.photos/seed/consoletable/800/600",
    isBestSeller: false
  }
];

export const REVIEWS = [
  {
    id: 1,
    name: "Mian Haroon",
    rating: 5,
    date: "June 2026",
    comment: "Excellent custom woodwork! We ordered a complete bridal furniture set including the Royal Modern Bed. The finishing of the dark walnut wood combined with gold gilding is immaculate. Proud to have such high-quality craftsmen in Gujranwala!"
  },
  {
    id: 2,
    name: "Ayesha Khan",
    rating: 4,
    date: "April 2026",
    comment: "The Imperial Chesterfield Sofa in Emerald Green has completely transformed our drawing room. Visually stunning, extremely comfortable, and heavy solid wood. Customer service on WhatsApp was responsive and polite."
  },
  {
    id: 3,
    name: "Sikandar Butt",
    rating: 5,
    date: "May 2026",
    comment: "Undoubtedly the most premium furniture store in the city. Visited their showroom on Ghordor Road. High-end wood and bespoke finishes. The banquet dining table is a true masterpiece of Pakistani craftsmanship."
  }
];
