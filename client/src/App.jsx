import React, { useState, useEffect, useRef } from 'react';

// --- Helper Icon Components (Using inline SVG from Heroicons) ---

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.826L11.25 9.25v1.5L4.643 11.96a.75.75 0 00-.95.826l-1.414 4.949a.75.75 0 00.826.95L19.25 10.75l.16-.05a.75.75 0 000-1.4l-.16-.05L3.105 2.289z" />
  </svg>
);

const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM5.03 4.63a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zM14.97 4.63a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM10 5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 5zM3 9.75A.75.75 0 013.75 9h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 013 9.75zM14.75 9a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM9.25 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM10 14a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 14zM5.03 13.9a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zM14.97 13.9a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" />
  </svg>
);

// --- Task 5: Mock Chatbot Logic ---

function getBotResponse(message) {
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


// --- Task 4: ChatWindow Component (Upgraded UI) ---

function ChatWindow({ messages, onSendMessage, isBotTyping }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotTyping]); // Also scroll when typing indicator appears

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow-lg border border-slate-200">
      {/* Message List Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start space-x-3 ${msg.from === 'user' ? 'justify-end' : ''}`}>
            {msg.from === 'ai' && (
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                <BotIcon />
              </span>
            )}
            <div
              className={`p-3 rounded-lg max-w-xs shadow-md ${
                msg.from === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'
              }`}
            >
              {msg.text}
            </div>
            {msg.from === 'user' && (
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-700">
                <UserIcon />
              </span>
            )}
          </div>
        ))}
        
        {/* NEW: Bot Typing Indicator */}
        {isBotTyping && (
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
              <BotIcon />
            </span>
            <div className="p-3 rounded-lg rounded-bl-none bg-white shadow-md flex items-center space-x-1.5 border border-slate-100">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area (Upgraded UI) */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-lg">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/50"
          >
            <SendIcon />
          </button>
        </div>
      </form>
    </div>
  );
}


// --- Task 3: StatusAuditWindow Component (NEW Professional Design) ---

function StatusAuditWindow({ status, auditLog }) {

  // Configuration for different statuses
  const statusConfig = {
    pending: {
      text: 'Pending Verification',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-300',
      icon: (
        <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
      ),
    },
    approved: {
      text: 'Verification Approved',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-300',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-green-600">
          <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.84-8.4-3.28 3.28a.75.75 0 0 1-1.06 0L5.16 7.54a.75.75 0 0 1 1.06-1.06L7.5 8.19l2.72-2.72a.75.75 0 0 1 1.06 1.06Z" clipRule="evenodd" />
        </svg>
      ),
    },
    // We can add more statuses like 'rejected' later
  };

  const currentStatus = statusConfig[status] || statusConfig.pending;

  return (
    // Use a React.Fragment to hold the two new cards
    <>
      {/* Card 1: Verification Status */}
      <div className="bg-white rounded-lg shadow-lg border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            Verification Status
          </h3>
        </div>
        <div className="p-6">
          <div className={`flex items-center space-x-3 p-4 rounded-lg ${currentStatus.bgColor} border ${currentStatus.borderColor}`}>
            <span className="flex-shrink-0">{currentStatus.icon}</span>
            <span className={`font-medium ${currentStatus.textColor}`}>
              {currentStatus.text}
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Audit Trail (NEW) */}
      <div className="bg-white rounded-lg shadow-lg border border-slate-200 mt-6">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            Audit Trail
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-3 text-sm text-slate-600 h-48 overflow-y-auto pr-2">
            {auditLog.slice().reverse().map((item, index) => ( // .slice().reverse() to show newest first
              <div key={index} className="flex justify-between items-center pb-2 border-b border-slate-100 last:border-b-0">
                <span>{item.message}</span>
                <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                  {item.time.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


// --- Main App Component (Upgraded with new state) ---

export default function App() {
  // State for the entire application
  const [chatMessages, setChatMessages] = useState([
    { from: 'ai', text: "Welcome to AutoVerify! Say 'hi' or 'hello' to begin your 60-second verification." }
  ]);
  const [kycStatus, setKycStatus] = useState('pending'); // 'pending', 'approved', 'rejected'
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [auditTrail, setAuditTrail] = useState([
    { time: new Date(), message: 'Session started.' }
  ]);

  /**
   * Task 6: Handles hooking everything up.
   */
  const handleSendMessage = (userInput) => {
    // 1. Add user's message
    const userMessage = { from: 'user', text: userInput };
    setChatMessages(prevMessages => [...prevMessages, userMessage]);

    // 2. Log to audit trail
    setAuditTrail(prev => [...prev, { time: new Date(), message: 'User sent message.' }]);
    
    // 3. Set bot typing status
    setIsBotTyping(true);

    // 4. Get bot response
    const botReply = getBotResponse(userInput);
    const botMessage = { from: 'ai', text: botReply };

    // 5. Add bot's reply after a delay
    setTimeout(() => {
      setIsBotTyping(false);
      setChatMessages(prevMessages => [...prevMessages, botMessage]);
      setAuditTrail(prev => [...prev, { time: new Date(), message: 'Bot replied.' }]);
    }, 800); // 800ms delay
  };

  return (
    // Main background (Cooler palette)
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 text-center">
            AutoVerify KYC
          </h1>
          <p className="text-center text-slate-600 mt-1">
            Your secure, 60-second identity verification
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* --- Column 1: Chat Window --- */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Chat Assistant</h2>
            <ChatWindow 
              messages={chatMessages} 
              onSendMessage={handleSendMessage}
              isBotTyping={isBotTyping}
            />
          </div>

          {/* --- Column 2: Status & Audit (Upgraded) --- */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Live Status</h2>
            <StatusAuditWindow 
              status={kycStatus}
              auditLog={auditTrail}
            />
          </div>

        </div>
      </div>
    </div>
  );
}