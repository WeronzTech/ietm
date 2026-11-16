import os
import re

package_json = open("package.json", "r", encoding="utf-8").read()
import json
pkg = json.loads(package_json)
prod_deps = set(pkg.get("dependencies", {}).keys())

print("Production dependencies in package.json:")
for d in sorted(prod_deps):
    print(" -", d)

print("\nScanning electron/ files:")
builtin_modules = {
    "node:path", "path", "node:fs", "fs", "node:url", "url", "node:buffer", "buffer", 
    "node:process", "process", "node:crypto", "crypto", "node:os", "os", "node:http", "http",
    "node:net", "net", "electron"
}

all_found = {}
for f in os.listdir("electron"):
    if f.endswith(".js") or f.endswith(".mjs"):
        c = open(os.path.join("electron", f), "r", encoding="utf-8").read()
        # Find all import ... from "..."
        for m in re.finditer(r'from\s+["\']([^"\']+)["\']', c):
            mod = m.group(1)
            if not mod.startswith("."):
                all_found.setdefault(mod, []).append(f)
        # Find require("...")
        for m in re.finditer(r'require\(["\']([^"\']+)["\']\)', c):
            mod = m.group(1)
            if not mod.startswith("."):
                all_found.setdefault(mod, []).append(f)

for mod, files in sorted(all_found.items()):
    status = "BUILTIN" if mod in builtin_modules else ("OK (in dependencies)" if mod in prod_deps else "MISSING!")
    print(f"{mod:35} -> {status} (used in {files})")

