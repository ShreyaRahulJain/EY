import React, { useState, useRef, useEffect } from "react";
import { sendChatbotMessage } from "../api";

/*
 * ChatbotAssistant - Full conversational loan application assistant
 * Now powered by OpenRouter + Grok for natural language processing
 */

const ChatbotAssistant = ({ onComplete, onBack }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! 👋 I'm your AI loan assistant from OpenCred. I'm here to make your loan application process incredibly simple and fast - no more long bank queues or endless paperwork! \n\nI'll guide you through everything step-by-step, answer any questions you have, and help you get approved quickly. The entire process is secure, transparent, and designed to save you time.\n\nTo get started, could you please tell me your full name?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [collectedData, setCollectedData] = useState({
    fullName: "",
    email: "",
    phone: "",
    pan: "",
    address: "",
    employmentType: "",
    income: "",
    amount: "",
    purpose: "",
    tenure: "",
    documentsConfirmed: "",
    documents: {
      pan: null,
      aadhaar: null,
      bankStatement: null,
      salarySlips: null,
    },
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkIfComplete = () => {
    const required = ['fullName', 'email', 'phone', 'pan', 'address', 'employmentType', 'income', 'amount', 'purpose', 'tenure', 'documentsConfirmed'];
    
    console.log("Checking completion. Required:", required);
    console.log("Current data:", collectedData);
    
    const hasAllData = required.every(field => {
      const hasField = collectedData[field] && collectedData[field].toString().trim() !== '';
      console.log(`Field ${field}:`, collectedData[field], "-> has:", hasField);
      return hasField;
    });
    
    console.log("Has all data:", hasAllData);
    
    if (hasAllData) {
      // User confirmed they have all documents, redirect to upload page
      setTimeout(() => {
        const finalMessage = {
          id: messages.length + 1,
          sender: "bot",
          text: "Perfect! Redirecting you to the document upload page...",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, finalMessage]);
        
        // Redirect to document upload page after brief delay
        setTimeout(() => {
          onComplete(collectedData);
        }, 2000);
      }, 1000);
    }
  };


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      text: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      // Call Gemini-powered chatbot
      const response = await sendChatbotMessage(
        messageText,
        messages,
        collectedData
      );

      setIsTyping(false);

      // Add bot response
      const botMessage = {
        id: messages.length + 2,
        sender: "bot",
        text: response.response,
        timestamp: response.timestamp,
      };
      setMessages((prev) => [...prev, botMessage]);

      // If Gemini collected data, update state
      if (response.collected_field && response.collected_value) {
        const field = response.collected_field;
        const value = response.collected_value;

        console.log("Updating collected data:", field, "=", value);

        setCollectedData((prev) => {
          const newData = {
            ...prev,
            [field]: value,
          };
          console.log("New collected data:", newData);
          
          // Check if documents are confirmed for redirect
          if (field === 'documentsConfirmed' && value === 'yes') {
            console.log("Documents confirmed - triggering redirect!");
            setTimeout(() => {
              onComplete(newData);
            }, 2000);
          }
          
          // Also check if all data is complete for full application
          const required = ['fullName', 'email', 'phone', 'pan', 'address', 'employmentType', 'income', 'amount', 'purpose', 'tenure', 'documentsConfirmed'];
          const hasAllData = required.every(reqField => newData[reqField] && newData[reqField].toString().trim() !== '');
          
          console.log("Full completion check - has all data:", hasAllData);
          
          if (hasAllData && field !== 'documentsConfirmed') {
            console.log("All data collected - ready for documents!");
            // Don't redirect here, wait for document confirmation
          }
          
          return newData;
        });
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setIsTyping(false);
      
      const errorMessage = {
        id: messages.length + 2,
        sender: "bot",
        text: "I'm having trouble connecting. Could you please try again?",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };


  // ========== REMOVED: File upload functions (now redirecting to upload page) ==========
  // These functions were removed since we're redirecting to the document upload page
  // instead of handling uploads in the chat interface

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-xl">
                OC
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">OpenCred</h1>
                <p className="text-xs text-gray-600">AI-Powered Loan Assistant</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all"
            >
              ← Back
            </button>
          </div>
        </div>
      </nav>

      {/* Chat Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="bg-yellow-400 text-black p-6 rounded-t-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
                AI
              </div>
              <div>
                <h3 className="font-bold text-lg">Loan Assistant</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Online - Collecting Information
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl p-4 ${
                    message.sender === "user"
                      ? "bg-yellow-400 text-black"
                      : "bg-white border-2 border-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.sender === "user" ? "text-gray-700" : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 max-w-[70%]">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t-2 border-gray-200 rounded-b-2xl">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your answer or ask a question..."
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                autoFocus
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotAssistant;

