import json

def fix_json_file():
    # Read the original file
    with open('data-training/reformatted_questions1.json', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Parse the content as JSON array
    try:
        data = json.loads(content)
    except json.JSONDecodeError as e:
        print(f"Error at position {e.pos}: {e.msg}")
        # Print the problematic section
        print(content[max(0, e.pos-100):min(len(content), e.pos+100)])
        return

    # Write back with proper formatting
    with open('data-training/reformatted_questions1.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    
    print("JSON file has been fixed and reformatted!")

if __name__ == "__main__":
    fix_json_file()