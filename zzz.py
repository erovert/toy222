import os
import re

# your main website folder
ROOT_DIR = "./"

def fix_content(content):
    
    # ==========================
    # 1. Fix internal href links
    # ==========================
    content = re.sub(
        r'href="(/[^"?#]+)(?<!/)"',
        lambda m: f'href="{m.group(1)}/"' 
        if m.group(1) != "/" and "." not in m.group(1)
        else m.group(0),
        content
    )

    # ==========================
    # 2. Fix canonical
    # ==========================
    content = re.sub(
        r'<link rel="canonical" href="(https://[^"]+?)(?<!/)">',
        r'<link rel="canonical" href="\1/">',
        content
    )

    # ==========================
    # 3. Fix og:url
    # ==========================
    content = re.sub(
        r'<meta property="og:url" content="(https://[^"]+?)(?<!/)">',
        r'<meta property="og:url" content="\1/">',
        content
    )

    # ==========================
    # 4. Fix JSON-LD URLs
    # ==========================
    content = re.sub(
        r'"(url|@id)"\s*:\s*"(https://[^"]+?)(?<!/)"',
        r'"\1": "\2/"',
        content
    )

    return content


def process_files():
    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)

                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()

                new_content = fix_content(content)

                if content != new_content:
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"✅ Fixed: {path}")
                else:
                    print(f"✔ No change: {path}")


if __name__ == "__main__":
    process_files()
    print("🎉 DONE — All files processed safely")