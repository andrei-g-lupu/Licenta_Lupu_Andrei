image_folder = 'C:/Users/Andrei/Downloads/Album_1_an'

output_docx = 'C:/Users/Andrei/Downloads/Album_1_an/output_images.docx'
import os
from PIL import Image
from docx import Document
from docx.shared import Inches
from math import ceil

# === CONFIGURATION ===
Image.MAX_IMAGE_PIXELS = None
input_folder = r"C:/Users/Andrei/Downloads/Album_1_an"
output_base = os.path.join(input_folder, "Album_Part")
images_per_doc = 20  # ~10 pages if 6 images per page (2 per row x 3 rows/page)
max_width = 3.0  # Inches per image column
max_height = 9.0
resize_max_width_px = 2500
resize_max_height_px = 3500

# === Create output folder ===
converted_folder = os.path.join(input_folder, "converted_for_word")
os.makedirs(converted_folder, exist_ok=True)

# === Load and convert images ===
image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.gif'}

image_files = sorted([
    f for f in os.listdir(input_folder)
    if any(f.lower().endswith(ext) for ext in image_extensions)
])

converted_images = []

def flatten_image(input_path, output_path):
    with Image.open(input_path) as img:
        img = img.convert("RGB")
        if resize_max_width_px and resize_max_height_px:
            img.thumbnail((resize_max_width_px, resize_max_height_px))
        img.save(output_path, format="JPEG", quality=95)

for fname in image_files:
    input_path = os.path.join(input_folder, fname)
    output_name = os.path.splitext(fname)[0] + ".jpg"
    output_path = os.path.join(converted_folder, output_name)
    try:
        flatten_image(input_path, output_path)
        converted_images.append(output_path)
        print(f"✔ Converted: {output_name}")
    except Exception as e:
        print(f"⚠️ Skipped {fname}: {e}")

# === Function: Get image size in inches for Word ===
def get_resized_inches(path, max_w, max_h):
    with Image.open(path) as img:
        width, height = img.size
        dpi = img.info.get('dpi', (96, 96))[0]
        width_in = width / dpi
        height_in = height / dpi
        scale = min(max_w / width_in, max_h / height_in, 1.0)
        return (width_in * scale, height_in * scale)

# === Insert into Word Documents in chunks ===
total_parts = ceil(len(converted_images) / images_per_doc)
for part in range(total_parts):
    doc = Document()
    table = doc.add_table(rows=0, cols=2)
    table.autofit = True

    start_idx = part * images_per_doc
    end_idx = min(start_idx + images_per_doc, len(converted_images))

    i = start_idx
    while i < end_idx:
        row = table.add_row()
        cell1 = row.cells[0]
        cell2 = row.cells[1]

        img1 = converted_images[i]
        width1, _ = get_resized_inches(img1, max_width, max_height)
        cell1.paragraphs[0].add_run().add_picture(img1, width=Inches(width1))
        print(f"[{i+1}] Added {os.path.basename(img1)}")

        if i + 1 < end_idx:
            img2 = converted_images[i + 1]
            width2, _ = get_resized_inches(img2, max_width, max_height)
            cell2.paragraphs[0].add_run().add_picture(img2, width=Inches(width2))
            print(f"[{i+2}] Added {os.path.basename(img2)}")
            i += 1

        i += 1

    output_docx = f"{output_base}_{part+1}.docx"
    doc.save(output_docx)
    print(f"\n✅ Saved Word file: {output_docx} ({end_idx - start_idx} images)\n")
