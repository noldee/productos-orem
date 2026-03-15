import { Metadata } from "next";

// catalogos/layout.tsx — ya no necesitás el div flotante, borralo o dejalo vacío
export const metadata: Metadata = {
  title: "M&G Catalogo",
  description:
    "Catalogo de Productos de limpieza premium con ingredientes naturales peruanos.",
  icons: {
    icon: "/logo.png",
  },
};

export default function CatalogosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
