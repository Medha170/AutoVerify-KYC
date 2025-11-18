/**
 * Gets an instant, pre-scripted response from the mock chatbot.
 * @param {string} message - The user's input message.
 * @return {string} - The bot's reply.
 */
export function getBotResponse(message) {
    const msg = message.toLowerCase();
    if (msg.includes("hello") || msg.includes("hi")) {
      return "Hi there! To get started, please click the 'Upload ID' button that will appear on the right.";
    }
    if (msg.includes("upload") || msg.includes("id")) {
      return "You can upload your document using the 'Upload ID' button on the right. Once you do, I'll scan it right away.";
    }
    if (msg.includes("help") || msg.includes("support")) {
      return "No problem! Just follow the prompts. I'll guide you on uploading your ID document first.";
    }
    if (msg.includes("thanks") || msg.includes("thank you")) {
      return "You're welcome! I'm here to help.";
    }
    return "I'm not quite sure about that. Let's focus on getting your ID verified. Please use the 'Upload ID' button to continue.";
  }