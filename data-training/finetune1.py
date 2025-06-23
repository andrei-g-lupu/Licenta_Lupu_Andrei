import os
import json
import dotenv
from openai import OpenAI

# Load environment variables
dotenv.load_dotenv()

# Initialize OpenAI client
client = OpenAI(
    api_key=os.environ.get('OPENAI_API_KEY')
)
messages=[
    
]

def prepare_training_data():
    # Read the entire file as a single JSON array
    with open('data-training/transformed_chat.jsonl', 'r', encoding='utf-8') as f:
        training_data = json.load(f)
    
    return training_data

def create_fine_tuning_job():
    # Create the fine-tuning job
    job = client.fine_tuning.jobs.create(
        training_file=messages,
        model="gpt-4o-2024-08-06",  # Base model
        hyperparameters={
            "n_epochs": 3,
            "batch_size": 4,
            "learning_rate_multiplier": 0.1
        }
    )
    
    print(f"Fine-tuning job created with ID: {job.id}")
    return job.id

def monitor_fine_tuning(job_id):
    # Get the status of the fine-tuning job
    job = client.fine_tuning.jobs.retrieve(job_id)
    print(f"Status: {job.status}")
    
    # If you want to list all events
    events = client.fine_tuning.jobs.list_events(job_id)
    for event in events:
        print(f"Event: {event.message}")

if __name__ == "__main__":
    # First, prepare the training data
    training_data = prepare_training_data()
    
    # Create and start the fine-tuning job
    job_id = create_fine_tuning_job()
    
    # Monitor the progress
    monitor_fine_tuning(job_id)