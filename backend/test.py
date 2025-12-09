# test.py
from agents.orch import run_pipeline

dummy_user = {
    "name": "Arjun",
    "pan": "ABCDE1234F",
    "income": 10000,
    "amount": 60000  # This is 6x income, so your dummy rule should REJECT it
}

result = run_pipeline("test_id_123", dummy_user)
print("\nFINAL RESULT:", result)