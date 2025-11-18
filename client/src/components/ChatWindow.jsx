import React, { useState, useEffect, useRef } from 'react';
import { SendIcon, BotIcon, UserIcon } from './Icons';

export default function ChatWindow({ messages, onSendMessage, isBotTyping }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow-lg border border-slate-200">
      {/* Message List */}
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
        
        {/* Typing Indicator */}
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

      {/* Input Area */}
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