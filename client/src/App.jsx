import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import StatusAuditWindow from './components/StatusAuditWindow';
import { getBotResponse } from './utils/mockChatBot';

// ---------------------------------------------------------
// Load API URL from .env file
// ---------------------------------------------------------
const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  // --- State ---
  const [chatMessages, setChatMessages] = useState([
    { from: 'ai', text: "Welcome to AutoVerify! Say 'hi' or 'hello' to begin your 60-second verification." }
  ]);
  const [kycStatus, setKycStatus] = useState('pending'); // 'pending', 'approved'
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [auditTrail, setAuditTrail] = useState([
    { time: new Date(), message: 'Session started.' }
  ]);

  // --- Actions ---

  const addAuditLog = (message) => {
    setAuditTrail(prev => [...prev, { time: new Date(), message }]);
  };

  const handleSendMessage = (userInput) => {
    const userMessage = { from: 'user', text: userInput };
    setChatMessages(prev => [...prev, userMessage]);
    addAuditLog('User sent message.');
    
    setIsBotTyping(true);

    const botReply = getBotResponse(userInput);
    const botMessage = { from: 'ai', text: botReply };

    setTimeout(() => {
      setIsBotTyping(false);
      setChatMessages(prev => [...prev, botMessage]);
      addAuditLog('Bot replied.');
    }, 800);
  };

  // --- DAY 3 LOGIC: Handle File Upload & Call AI ---
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    addAuditLog(`User uploaded ${file.name}`);
    addAuditLog('Sending to AI for analysis...');

    // Convert to Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onloadend = async () => {
      const base64Image = reader.result;

      try {
        // Call our Firebase Function
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Image })
        });

        const result = await response.json();

        if (result.success) {
            setExtractedData(result.data);
            addAuditLog('AI extraction successful.');
            addAuditLog(`Detected: ${result.data.name}`);
        } else {
            addAuditLog('AI extraction failed.');
            console.error(result.error);
        }
      } catch (error) {
        addAuditLog('Network error connecting to AI.');
        console.error(error);
      } finally {
        setIsProcessing(false);
      }
    };
  };

  // --- DAY 3 LOGIC: Auto-Approve Logic ---
  useEffect(() => {
    if (extractedData && kycStatus === 'pending') {
        // Simulate a quick risk check delay
        setTimeout(() => {
            setKycStatus('approved');
            addAuditLog('Risk check passed. User approved.');
            
            setChatMessages(prev => [...prev, { 
                from: 'ai', 
                text: `I've verified your ID, ${extractedData.name}. Your account is now approved!` 
            }]);
        }, 1000);
    }
  }, [extractedData, kycStatus]);

  // --- Render ---
  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 text-center">AutoVerify KYC</h1>
          <p className="text-center text-slate-600 mt-1">Your secure, 60-second identity verification</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chat Column */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Chat Assistant</h2>
            <ChatWindow 
              messages={chatMessages} 
              onSendMessage={handleSendMessage}
              isBotTyping={isBotTyping}
            />
          </div>

          {/* Status & Audit Column */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Live Status</h2>
            <StatusAuditWindow 
              status={kycStatus}
              auditLog={auditTrail}
              onFileUpload={handleFileUpload}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}