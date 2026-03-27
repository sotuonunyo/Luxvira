export const formatCartForWhatsApp = (cartItems, customerName = 'Customer') => {
  const businessNumber = '2348037991435';
  
  let message = `🛍️ *New Order - Luxvira Scents*\n\n`;
  message += `👤 *Customer:* ${customerName}\n`;
  message += `📅 *Date:* ${new Date().toLocaleDateString('en-NG', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}\n\n`;
  
  message += `📦 *Items:*\n`;
  cartItems.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`;
    message += `   💰 ₦${item.price.toLocaleString()} × ${item.quantity}\n`;
    message += `   ➡️ Subtotal: ₦${(item.price * item.quantity).toLocaleString()}\n\n`;
  });
  
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  message += `💵 *TOTAL: ₦${total.toLocaleString()}*\n\n`;
  message += `_Please confirm my order. Thank you!_ ✨`;
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${businessNumber}?text=${encodedMessage}`;
};
