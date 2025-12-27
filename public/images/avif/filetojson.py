import os, json

def dir_to_json(path="."):
    files = []
    for f in os.listdir(path):
        if os.path.isfile(os.path.join(path, f)):
            files.append(f)
    return json.dumps(files, indent=2)

print(dir_to_json())
