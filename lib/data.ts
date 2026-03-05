// ─── TOKENS ───────────────────────────────────────────────────────────────
export const TOKENS = {
  crema: "#F9F7F2",
  negro: "#1A1A18",
  musgo: "#3E5245",
  salvia: "#A3B899",
  arena: "#E5DED0",
  terracota: "#C66B44",
  textoGris: "#66625B",
} as const;

// ─── REVIEWS ──────────────────────────────────────────────────────────────
export interface Review {
  name: string;
  role: string;
  text: string;
  img: string;
}

export const reviewsRow1: Review[] = [
  {
    name: "Alessandra V.",
    role: "Arquitecta",
    text: "El aroma transformó mi espacio por completo.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
  },
  {
    name: "Juan P.",
    role: "Hotel Boutique",
    text: "La línea corporativa es de otro nivel, muy premium.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
  },
  {
    name: "Carla M.",
    role: "Home Decor",
    text: "Suscripción mensual recomendada 100%.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
  },
];

export const reviewsRow2: Review[] = [
  {
    name: "Roberto F.",
    role: "Oficinas",
    text: "Paz absoluta en medio del caos de la ciudad.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200",
  },
  {
    name: "Lucía T.",
    role: "Socia",
    text: "Diseño olfativo que mis clientes siempre notan.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
  },
  {
    name: "Mateo S.",
    role: "Diseñador",
    text: "Increíble atención al detalle y presentación.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
  },
];

// ─── SERVICIOS ────────────────────────────────────────────────────────────
export interface Service {
  title: string;
  desc: string;
  iconName: "leaf" | "shield" | "sparkles";
}

export const services: Service[] = [
  {
    title: "Suscripción Hogar",
    desc: "Recargas mensuales automáticas.",
    iconName: "leaf",
  },
  {
    title: "Línea Corporativa",
    desc: "Higiene premium para boutiques y hoteles.",
    iconName: "shield",
  },
  {
    title: "Fragancias de Autor",
    desc: "Marketing olfativo exclusivo de marca.",
    iconName: "sparkles",
  },
];

// ─── CARRITO ──────────────────────────────────────────────────────────────
export interface CartItem {
  id: number;
  name: string;
  variant: string;
  price: number;
  qty: number;
  img: string;
}

export const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "Lavanda & Eucalipto Pro",
    variant: "Edición Botánica — 500ml",
    price: 45.0,
    qty: 1,
    img: "https://plus.unsplash.com/premium_photo-1684407616442-87bf0d69e8b4?q=80&w=870&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Desengrasante Menta Soft",
    variant: "Extracto Puro — 500ml",
    price: 32.0,
    qty: 1,
    img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400",
  },
];

export const SHIPPING_TARGET = 150;
export const SHIPPING_COST = 15;