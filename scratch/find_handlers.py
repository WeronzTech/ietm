import re

c = open('electron/main.js', 'r', encoding='utf-8').read()
matches = re.findall(r'ipcMain\.(?:handle|on)\(["\']([^"\']+)["\']', c)
for m in matches:
    if any(k in m.lower() for k in ['export', 'import', 'pack', 'manual', 'asset', 'image']):
        print("Handler:", m)

