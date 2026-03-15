// ─── TOKENS (Se mantienen igual para coherencia visual) ───────────────
export const TOKENS = {
  crema: "#F9F7F2",
  negro: "#1A1A18",
  musgo: "#3E5245",
  salvia: "#A3B899",
  arena: "#E5DED0",
  terracota: "#C66B44",
  textoGris: "#66625B",
} as const;

// ─── REVIEWS PERUANAS ──────────────────────────────────────────────────
export interface Review {
  name: string;
  role: string;
  text: string;
  img: string;
}

export interface Service {
  title: string;
  desc: string;
  iconName: string;
}

export interface CartItem {
  id: number;
  name: string;
  variant: string;
  price: number;
  qty: number;
  img: string;
}

export const reviewsRow1: Review[] = [
  {
    name: "Milagros Cueva",
    role: "Miraflores / Airbnb Host",
    text: "Mis huéspedes siempre comentan lo bien que huele el depa. Pureza elevó mis calificaciones en limpieza.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
  },
  {
    name: "Renzo Ferrero",
    role: "Cafetería de Especialidad",
    text: "El desengrasante Menta Soft es increíble, limpia sin dejar ese olor químico molesto en la barra.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
  },
  {
    name: "Luciana Riva Agüero",
    role: "Diseño de Interiores",
    text: "Uso la línea corporativa en todos mis proyectos en San Isidro. Estética y aroma impecable.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
  },
];

export const reviewsRow2: Review[] = [
  {
    name: "Gianmarco Soto",
    role: "Chef / Restaurante",
    text: "Finalmente un proveedor que entiende que la limpieza también es parte de la experiencia del cliente.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200",
  },
  {
    name: "Ximena de la Jara",
    role: "Socia en Boutique Cusco",
    text: "Las fragancias de autor conectan perfecto con el concepto de nuestra marca. Atención A1.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
  },
  {
    name: "Joaquín Belaúnde",
    role: "Estudio de Yoga",
    text: "La lavanda y eucalipto crean el ambiente de paz que mis alumnos necesitan apenas entran.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
  },
];

// ─── SERVICIOS EN PERÚ ──────────────────────────────────────────────────
export const services: Service[] = [
  {
    title: "Suscripción Lima & Provincias",
    desc: "Recargas programadas para que nunca te falte stock en casa o negocio.",
    iconName: "leaf",
  },
  {
    title: "Venta Mayorista B2B",
    desc: "Precios competitivos y facturación inmediata para empresas peruanas.",
    iconName: "shield",
  },
  {
    title: "Despacho Express",
    desc: "Envíos en 24h para Lima Metropolitana y envíos rápidos a todo el Perú.",
    iconName: "sparkles",
  },
];

// ─── CARRITO (Precios en Soles sugeridos) ─────────────────────────────────
export const initialCartItems: CartItem[] = [];

export const SHIPPING_TARGET = 150; // Envío gratis a partir de 150 soles
export const SHIPPING_COST = 12; // Costo de envío estándar en Lima
