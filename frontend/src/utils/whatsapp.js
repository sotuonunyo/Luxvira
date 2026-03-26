// Format contact form data for WhatsApp message
export const formatWhatsAppMessage = (formData) => {
  const businessNumber = '2348037991435'; // Your WhatsApp number (no + or spaces)
  
  let message = `📬 *New Message - Luxvira Scents*\n\n`;
  message += `👤 *Name:* ${formData.name}\n`;
  message += `📧 *Email:* ${formData.email}\n`;
  if (formData.phone) message += `📱 *Phone:* ${formData.phone}\n`;
  
  const typeLabels = {
    order: '📦 Order Question',
    product: '🕯️ Product Info', 
    feedback: '💬 Feedback',
    newsletter: '📰 Join Newsletter',
    complaint: '⚠️ Complaint',
    other: '✨ Other',
    '': '💬 General Inquiry'
  };
  message += `🏷️ *Type:* ${typeLabels[formData.type] || '💬 General Inquiry'}\n`;
  
  message += `\n💬 *Message:*\n${formData.message}\n`;
  message += `\n_Sent from Luxvira Scents website_`;
  
  // URL encode for WhatsApp
  const encodedMessage = encodeURIComponent(message);
  
  // Generate click-to-chat URL
  return `https://wa.me/${businessNumber}?text=${encodedMessage}`;
};
