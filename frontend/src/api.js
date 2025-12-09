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