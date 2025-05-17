input_doc = 'C:/Users/Andrei/Downloads/Album_1_an/output_images.docx'
import win32com.client
import os

def split_doc_by_pages(input_path, output_dir, pages_per_split=5):
    word = win32com.client.Dispatch("Word.Application")
    word.Visible = False
    word.DisplayAlerts = 0

    try:
        doc = word.Documents.Open(input_path)
        total_pages = doc.ComputeStatistics(2)  # 2 = wdStatisticPages

        os.makedirs(output_dir, exist_ok=True)

        for start_page in range(1, total_pages + 1, pages_per_split):
            end_page = min(start_page + pages_per_split - 1, total_pages)
            new_doc = word.Documents.Add()

            # Copy the page range
            doc.Range(doc.GoTo(1, 1, start_page), doc.GoTo(1, 1, end_page + 1)).Copy()
            new_doc.Range(0, 0).Paste()

            output_file = os.path.join(output_dir, f"split_{start_page}_to_{end_page}.docx")
            new_doc.SaveAs(output_file, FileFormat=12)  # 12 = wdFormatDocumentDefault (.docx)
            new_doc.Close()
            print(f"Saved: {output_file}")

        doc.Close(False)

    except Exception as e:
        print(f"Error: {e}")
    finally:
        word.Quit()

# === Example Usage ===
input_path = 'C:/Users/Andrei/Downloads/Album_1_an/output_images.docx'
output_dir = 'C:/Users/Andrei/Downloads/Album_1_an'
split_doc_by_pages(input_path, output_dir, pages_per_split=5)
