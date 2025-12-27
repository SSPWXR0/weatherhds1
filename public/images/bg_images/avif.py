import os
from PIL import Image

TARGET_WIDTH = 1920
TARGET_HEIGHT = 1080
QUALITY = 80

SUPPORTED_EXTS = (".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp")

def center_crop(img, target_w, target_h):
    w, h = img.size
    left = (w - target_w) // 2
    top = (h - target_h) // 2
    right = left + target_w
    bottom = top + target_h
    return img.crop((left, top, right, bottom))

for root, _, files in os.walk("."):
    for filename in files:
        if not filename.lower().endswith(SUPPORTED_EXTS):
            continue

        input_path = os.path.join(root, filename)
        output_path = os.path.splitext(input_path)[0] + ".avif"

        if os.path.exists(output_path):
            continue

        try:
            with Image.open(input_path) as img:
                img = img.convert("RGB")

                scale = max(
                    TARGET_WIDTH / img.width,
                    TARGET_HEIGHT / img.height
                )
                new_size = (
                    int(img.width * scale),
                    int(img.height * scale)
                )

                img = img.resize(new_size, Image.LANCZOS)
                img = center_crop(img, TARGET_WIDTH, TARGET_HEIGHT)

                img.save(
                    output_path,
                    format="AVIF",
                    quality=QUALITY,
                    speed=6
                )

                print(f"Converted: {input_path} → {output_path}")

        except Exception as e:
            print(f"Failed: {input_path} ({e})")
