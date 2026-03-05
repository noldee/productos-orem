export interface Product {
  id: number;
  name: string;
  categoria: string;
  linea: string;
  aroma: string;
  formato: string;
  precio: number;
  badge: string | null;
  biodegradable: boolean;
  concentrado: boolean;
  img: string;
  desc: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Lavanda & Eucalipto Pro",
    categoria: "Multiusos",
    linea: "Botánica",
    aroma: "Lavanda",
    formato: "500ml",
    precio: 45.0,
    badge: "Más vendido",
    biodegradable: true,
    concentrado: false,
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600",
    desc: "Fórmula botánica con aceite esencial de lavanda andina y eucalipto amazónico.",
  },
  {
    id: 2,
    name: "Desengrasante Menta Soft",
    categoria: "Desengrasante",
    linea: "Extractos",
    aroma: "Menta",
    formato: "500ml",
    precio: 32.0,
    badge: null,
    biodegradable: true,
    concentrado: false,
    img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600",
    desc: "Elimina grasas y residuos con extracto puro de menta peruana.",
  },
  {
    id: 3,
    name: "Limpiapisos Cedro & Pino",
    categoria: "Pisos",
    linea: "Botánica",
    aroma: "Cedro",
    formato: "1L",
    precio: 38.0,
    badge: "Nuevo",
    biodegradable: true,
    concentrado: true,
    img: "https://plus.unsplash.com/premium_photo-1678718605794-e21935e9fda1?q=80&w=870&auto=format&fit=crop",
    desc: "Concentrado de cedro y pino con efecto bactericida natural duradero.",
  },
  {
    id: 4,
    name: "Desinfectante Hospitalario",
    categoria: "Desinfectante",
    linea: "Clínica",
    aroma: "Neutro",
    formato: "1L",
    precio: 65.0,
    badge: "Premium",
    biodegradable: false,
    concentrado: true,
    img: "https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=600",
    desc: "Grado hospitalario. Elimina el 99.9% de patógenos certificado DIGESA.",
  },
  {
    id: 5,
    name: "Quitamanchas Cítrico",
    categoria: "Textil",
    linea: "Extractos",
    aroma: "Cítrico",
    formato: "500ml",
    precio: 28.0,
    badge: null,
    biodegradable: true,
    concentrado: false,
    img: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?q=80&w=600",
    desc: "Extracto de naranja peruana y limón sutil para telas delicadas.",
  },
  {
    id: 6,
    name: "Abrillantador Superficies",
    categoria: "Multiusos",
    linea: "Clínica",
    aroma: "Neutro",
    formato: "500ml",
    precio: 42.0,
    badge: null,
    biodegradable: false,
    concentrado: false,
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600",
    desc: "Brillo espejo en acero inoxidable, vidrio y cerámica.",
  },
  {
    id: 7,
    name: "Aromatizante Selva Verde",
    categoria: "Aromas",
    linea: "Botánica",
    aroma: "Amazónico",
    formato: "300ml",
    precio: 35.0,
    badge: "Exclusivo",
    biodegradable: true,
    concentrado: false,
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600",
    desc: "Diseño olfativo inspirado en la Amazonía peruana. Para espacios premium.",
  },
  {
    id: 8,
    name: "Limpiador Baños Pro",
    categoria: "Baños",
    linea: "Clínica",
    aroma: "Menta",
    formato: "750ml",
    precio: 29.0,
    badge: null,
    biodegradable: false,
    concentrado: false,
    img: "https://images.unsplash.com/photo-1556911073-52527ac43761?q=80&w=600",
    desc: "Antical y antibacterial de alto rendimiento para baños de uso intensivo.",
  },
  {
    id: 9,
    name: "Kit Inicio Botánico",
    categoria: "Kits",
    linea: "Botánica",
    aroma: "Mixto",
    formato: "Kit x3",
    precio: 99.0,
    badge: "Oferta",
    biodegradable: true,
    concentrado: false,
    img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600",
    desc: "Trio esencial: multiusos, pisos y aromatizante. Presentación regalo.",
  },
];

export const CATEGORIAS = [
  "Todas",
  "Multiusos",
  "Desengrasante",
  "Pisos",
  "Desinfectante",
  "Textil",
  "Aromas",
  "Baños",
  "Kits",
];

export const LINEAS = ["Botánica", "Extractos", "Clínica"];

export const AROMAS = [
  "Lavanda",
  "Menta",
  "Cedro",
  "Cítrico",
  "Neutro",
  "Amazónico",
  "Mixto",
];

export const FORMATOS = ["300ml", "500ml", "750ml", "1L", "Kit x3"];

export const BADGE_STYLES: Record<string, string> = {
  "Más vendido": "bg-terracota text-white",
  Nuevo: "bg-musgo text-white",
  Premium: "bg-stone-900 text-white",
  Exclusivo: "bg-salvia text-stone-900",
  Oferta: "bg-amber-400 text-stone-900",
};
