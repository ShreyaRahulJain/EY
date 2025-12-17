import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

def get_supabase_client() -> Client:
    """
    Initialize and return Supabase client
    """
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    
    if not supabase_url or not supabase_key:
        print("WARNING: Supabase credentials not found. Using in-memory storage.")
        return None
    
    return create_client(supabase_url, supabase_key)

# Database operations
class SupabaseDB:
    def __init__(self):
        self.client = get_supabase_client()
    
    def save_loan_application(self, loan_id: str, loan_data: dict):
        """Save loan application to Supabase"""
        if not self.client:
            return None
        
        try:
            response = self.client.table('loan_applications').insert({
                'loan_id': loan_id,
                'applicant_name': loan_data['data']['name'],
                'pan': loan_data['data']['pan'],
                'income': loan_data['data']['income'],
                'amount': loan_data['data']['amount'],
                'purpose': loan_data['data']['purpose'],
                'status': loan_data['status'],
                'explanation': loan_data.get('explanation', ''),
                'timeline': loan_data.get('timeline', []),
                'document_name': loan_data['data'].get('document_name', '')
            }).execute()
            return response
        except Exception as e:
            print(f"Error saving to Supabase: {e}")
            return None
    
    def update_loan_status(self, loan_id: str, status: str, explanation: str, timeline: list):
        """Update loan application status"""
        if not self.client:
            return None
        
        try:
            response = self.client.table('loan_applications').update({
                'status': status,
                'explanation': explanation,
                'timeline': timeline
            }).eq('loan_id', loan_id).execute()
            return response
        except Exception as e:
            print(f"Error updating Supabase: {e}")
            return None
    
    def get_loan_application(self, loan_id: str):
        """Retrieve loan application from Supabase"""
        if not self.client:
            return None
        
        try:
            response = self.client.table('loan_applications').select('*').eq('loan_id', loan_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error fetching from Supabase: {e}")
            return None
    
    def save_chat_message(self, loan_id: str, sender: str, message: str):
        """Save chat message to Supabase"""
        if not self.client:
            return None
        
        try:
            response = self.client.table('chat_messages').insert({
                'loan_id': loan_id,
                'sender': sender,
                'message': message
            }).execute()
            return response
        except Exception as e:
            print(f"Error saving chat message: {e}")
            return None
    
    def get_chat_history(self, loan_id: str):
        """Retrieve chat history for a loan application"""
        if not self.client:
            return []
        
        try:
            response = self.client.table('chat_messages').select('*').eq('loan_id', loan_id).order('created_at').execute()
            return response.data
        except Exception as e:
            print(f"Error fetching chat history: {e}")
            return []

