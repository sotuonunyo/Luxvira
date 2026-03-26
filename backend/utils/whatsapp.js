// Format cart items for WhatsApp message [[45]][[46]]
exports.formatWhatsAppMessage = (cartItems, customerInfo = {}) => {
  const businessNumber = process.env.WHATSAPP_NUMBER; // e.g., '1234567890'
  
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
  
  // URL encode the message
  const encodedMessage = encodeURIComponent(message);
  
  // Generate WhatsApp click-to-chat URL [[45]]
  return `https://wa.me/${businessNumber}?text=${encodedMessage}`;
};
