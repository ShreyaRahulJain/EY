import React, { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../api";

const ChatInterface = ({ loanId, userName, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "manager",
      text: `Hello ${userName}! I'm reviewing your loan application. How can I assist you today?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      text: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);
    const messageText = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      // Call actual API
      const response = await sendChatMessage(loanId, messageText);
      
      const managerResponse = {
        id: messages.length + 2,
        sender: "manager",
        text: response.response,
        timestamp: response.timestamp,
      };
      setMessages((prev) => [...prev, managerResponse]);
    } catch (error) {
      console.error("Chat error:", error);
      // Fallback to local response
      const managerResponse = {
        id: messages.length + 2,
        sender: "manager",
        text: generateManagerResponse(messageText),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, managerResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateManagerResponse = (userInput) => {
    // Simple response logic - replace with actual AI agent
    const input = userInput.toLowerCase();
    if (input.includes("status") || input.includes("update")) {
      return "Your application is currently under manual review. I'm analyzing your income-to-loan ratio and will have a decision for you within 24 hours.";
    } else if (input.includes("document") || input.includes("upload")) {
      return "All your documents have been received and verified. Is there a specific document you'd like to discuss?";
    } else if (input.includes("income") || input.includes("salary")) {
      return "I see your monthly income is listed. If you have additional income sources or recent salary increases, please share those details with me.";
    } else if (input.includes("help") || input.includes("question")) {
      return "I'm here to help! You can ask me about your application status, required documents, loan terms, or any concerns you have.";
    } else {
      return "Thank you for your message. I'm reviewing your application carefully. Is there anything specific about your loan application you'd like to discuss?";
    }
  };

  const handleVoiceToggle = () => {
    setIsVoiceMode(!isVoiceMode);
    if (!isVoiceMode) {
      // Start voice recognition
      startVoiceRecognition();
    } else {
      // Stop voice recognition
      stopVoiceRecognition();
    }
  };

  const startVoiceRecognition = () => {
    // Voice recognition implementation
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsVoiceMode(false);
      };

      recognition.start();
    } else {
      alert('Voice recognition is not supported in your browser. Please use Chrome or Edge.');
      setIsVoiceMode(false);
    }
  };

  const stopVoiceRecognition = () => {
    // Stop voice recognition logic
    console.log('Voice recognition stopped');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-yellow-400 text-black p-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
              LM
            </div>
            <div>
              <h3 className="font-bold text-lg">Loan Manager</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Online
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-bold"
          >
            ✕
          </button>
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
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t-2 border-gray-200 rounded-b-2xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold text-gray-500">
              Loan ID: {loanId}
            </span>
            <button
              onClick={handleVoiceToggle}
              className={`ml-auto px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                isVoiceMode
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {isVoiceMode ? "🎤 Stop Voice" : "🎤 Voice Mode"}
            </button>
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message or use voice mode..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Messages are encrypted and monitored for quality assurance
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

