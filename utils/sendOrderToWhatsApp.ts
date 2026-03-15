type CartItem = {
  name: string;
  variant?: string;
  price: number;
  qty: number;
};

type WhatsAppOrderParams = {
  cartItems: CartItem[];
  subtotal: number;
  total: number;
  shippingCost: number;
  shippingTarget: number;
};

export function sendOrderToWhatsApp({
  cartItems,
  subtotal,
  total,
  shippingCost,
  shippingTarget,
}: WhatsAppOrderParams) {
  const telefono = "51944339257";

  const productos = cartItems
    .map((item) => {
      const precio = (item.price * item.qty).toFixed(2);
      return `• ${item.name}${item.variant ? ` (${item.variant})` : ""} x${item.qty} — S/ ${precio}`;
    })
    .join("\n");

  const orderId = Math.floor(10000 + Math.random() * 90000);
  const fecha = new Date().toLocaleDateString("es-PE");

  const mensaje = [
    "*Nuevo Pedido - M&G S.A.C.*",
    "",
    `Pedido: #${orderId}`,
    `Fecha: ${fecha}`,
    "",
    "*Productos:*",
    productos,
    "",
    `Subtotal: S/ ${subtotal.toFixed(2)}`,
    `Envio: ${subtotal > shippingTarget ? "GRATIS" : `S/ ${shippingCost.toFixed(2)}`}`,
    `*Total: S/ ${total.toFixed(2)}*`,
    "",
    "---------------------",
    "Por favor confirmar disponibilidad.",
  ].join("\n");

  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}
