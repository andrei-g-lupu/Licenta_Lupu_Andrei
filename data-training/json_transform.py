import json

def transform_json(input_file, output_file):
    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    transformed_data = []
    
    for entry in data:
        transformed_entry = {
            "messages": [
                {"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."},
                {"role": "user", "content": entry["input"]},
                {"role": "assistant", "content": entry["output"]}
            ]
        }
        transformed_data.append(transformed_entry)
    
    with open(output_file, "w", encoding="utf-8") as f:
        for item in transformed_data:
            json.dump(item, f, ensure_ascii=False)
            f.write("\n")
    
    print(f"Transformed JSON saved to {output_file}")

# Usage example:
transform_json("data-training/formatted_questions.json", "data-training/reformatted_questions.json")
