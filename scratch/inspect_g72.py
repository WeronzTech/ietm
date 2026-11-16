import pypdf
import os

pdf_path = "SSS_DEFENCE_G72_SMG_USER_MANUAL.pdf"
if not os.path.exists(pdf_path):
    print("File not found:", pdf_path)
    exit(1)

reader = pypdf.PdfReader(pdf_path)
print(f"Total pages: {len(reader.pages)}")

os.makedirs("scratch/g72_extracted", exist_ok=True)
os.makedirs("public/assets/g72", exist_ok=True)

with open("scratch/g72_extracted/text_dump.txt", "w", encoding="utf-8") as f:
    for i, page in enumerate(reader.pages):
        txt = page.extract_text() or ""
        f.write(f"\n--- PAGE {i+1} ---\n")
        f.write(txt)
        img_names = []
        try:
            for img_idx, img in enumerate(page.images):
                img_name = f"page_{i+1}_img_{img_idx+1}_{img.name}"
                img_save_path = os.path.join("public/assets/g72", img_name)
                with open(img_save_path, "wb") as img_f:
                    img_f.write(img.data)
                img_names.append(img_name)
        except Exception as e:
            print(f"Error extracting images from page {i+1}: {e}")
        print(f"Page {i+1}: text_len={len(txt)}, images={len(img_names)} -> {img_names}")

print("\nDone extracting text and images!")
