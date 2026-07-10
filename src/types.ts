export interface Product {
  id: string;
  name: string;
  category: "bedroom" | "living" | "dining" | "sofas" | "office" | "mattresses" | "decor";
  priceRange: string;
  description: string;
  dimensions: string;
  materials: string[];
  finishes: string[];
  fabrics?: string[];
  image: string;
  isBestSeller?: boolean;
}

export interface Inquiry {
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

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface RoomFinish {
  wallColor: string;
  floorType: "light-oak" | "dark-walnut" | "marble";
}

export interface PlannerItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  x: number; // percentage width 0-100
  y: number; // percentage height 0-100
  rotation: number; // degrees
  scale: number; // 0.5 to 1.5
  finish: string;
  fabric?: string;
  depthZ?: number; // ordering depth
}
