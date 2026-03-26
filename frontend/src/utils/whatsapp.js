// Generate WhatsApp checkout URL [[45]][[46]]
export const generateWhatsAppURL = (cartItems, customerInfo = {}) => {
  const businessNumber = import.meta.env.VITE_WHATSAPP_NUMBER; // From frontend .env
  
  let message = `🛍️ *New Order - Luxvira Scents*\n\n`;
  
  cartItems.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`;
    message += `   Price: $${item.price}\n`;
    message += `   Qty: ${item.quantity}\n`;
    message += `   Subtotal: $${(item.price * item.quantity).toFixed(2)}\n\n`;
  });
  
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  message += `*Total: $${total.toFixed(2)}*\n\n`;
  
  if (customerInfo.name) message += `👤 Name: ${customerInfo.name}\n`;
  if (customerInfo.email) message += `📧 Email: ${customerInfo.email}\n`;
  if (customerInfo.phone) message += `📱 Phone: ${customerInfo.phone}\n`;
  if (customerInfo.address) message += `📍 Address: ${customerInfo.address}\n`;
  
  message += `\n_Please confirm my order. Thank you!_`;
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${businessNumber}?text=${encodedMessage}`;
};
