const API_BASE_URL = "http://127.0.0.1:8000";

export const submitLoanApplication = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/loans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) throw new Error("Submission failed");
  return response.json();
};

export const checkLoanStatus = async (loanId) => {
  const response = await fetch(`${API_BASE_URL}/loans/${loanId}`);
  if (!response.ok) throw new Error("Status check failed");
  return response.json();
};

export const sendChatMessage = async (loanId, message) => {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      loan_id: loanId,
      message: message,
    }),
  });
  if (!response.ok) throw new Error("Chat message failed");
  return response.json();
};

export const sendChatbotMessage = async (message, conversationHistory, collectedData) => {
  const response = await fetch(`${API_BASE_URL}/chatbot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message,
      conversation_history: conversationHistory,
      collected_data: collectedData,
    }),
  });
  if (!response.ok) throw new Error("Chatbot message failed");
  return response.json();
};