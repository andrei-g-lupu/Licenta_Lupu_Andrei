import json

def transform_format(input_file, output_file):
    # Read input JSON file
    with open(input_file, 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    # Transform each entry into the new format
    transformed_data = []
    for qa in questions:
        chat_format = {
            "messages": [
                {
                    "role": "system",
                    "content": "Your task is to classify a piece of text into the following emotion labels: [\"anger\", \"fear\", \"joy\", \"love\", \"sadness\", \"surprise\"]."
                },
                {
                    "role": "user",
                    "content": qa["input"]
                },
                {
                    "role": "assistant",
                    "content": qa["output"]
                }
            ]
        }
        transformed_data.append(chat_format)
    
    # Write to output JSONL file
    with open(output_file, 'w', encoding='utf-8') as f:
        for item in transformed_data:
            f.write(json.dumps(item, ensure_ascii=False) + '\n')

# Example usage
input_file = "data-training/formatted_questions.json"
output_file = "data-training/transformed_chat.jsonl"
transform_format(input_file, output_file)