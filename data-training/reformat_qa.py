import json

def reformat_qa_data():
    formatted_data = []
    system_prompt = "Unchiu Steli este un expert sincer care stie foarte bine codul fiscal romanesc, iar daca nu stie raspunsul si nu il are in context, spune ca nu stie."
    
    with open('data-training/reformatted_questions1.jsonl', 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    current_user = None
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Clean up the line
        line = line.rstrip(',')  # Remove trailing comma
        if line.startswith('{"messages": ['):
            line = line[13:]  # Remove the {"messages": [ prefix
        if line.endswith(']}'):
            line = line[:-2]  # Remove the ]} suffix
            
        try:
            msg = json.loads(line)
            if msg.get("role") == "user":
                current_user = msg
            elif msg.get("role") == "assistant" and current_user:
                # We have a complete Q&A pair
                formatted_entry = {
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        current_user,
                        msg
                    ]
                }
                formatted_data.append(formatted_entry)
                current_user = None
                
        except json.JSONDecodeError as e:
            continue

    # Write the formatted data
    with open('data-training/reformatted_tax_qa.jsonl', 'w', encoding='utf-8') as f:
        for entry in formatted_data:
            json_line = json.dumps(entry, ensure_ascii=False)
            f.write(json_line + '\n')

    print(f"Successfully reformatted {len(formatted_data)} QA pairs!")
    if len(formatted_data) == 0:
        print("\nDebug info:")
        print("First few lines after cleaning:")
        for line in lines[:5]:
            print(line.strip())

if __name__ == "__main__":
    reformat_qa_data()
