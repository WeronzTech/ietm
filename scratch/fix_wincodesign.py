import subprocess
import os
import shutil

src = r"C:\Users\akhil\AppData\Local\electron-builder\Cache\winCodeSign\168540159.7z"
dest = r"C:\Users\akhil\AppData\Local\electron-builder\Cache\winCodeSign\winCodeSign-2.6.0"

os.makedirs(dest, exist_ok=True)

seven_zip = os.path.abspath(r"node_modules\7zip-bin\win\x64\7za.exe")

cmd = [
    seven_zip,
    "x",
    "-bd",
    "-y",
    "-xr!*libcrypto.dylib",
    "-xr!*libssl.dylib",
    src,
    f"-o{dest}"
]

print("Running command:", " ".join(cmd))
res = subprocess.run(cmd, capture_output=True, text=True)
print("Exit code:", res.returncode)
print("Stdout:", res.stdout[-500:])
if res.stderr:
    print("Stderr:", res.stderr)

# Also create dummy or copy files for the two dylibs just in case
d1012 = os.path.join(dest, "darwin", "10.12", "lib")
if os.path.exists(d1012):
    crypto_1 = os.path.join(d1012, "libcrypto.1.0.0.dylib")
    crypto_sym = os.path.join(d1012, "libcrypto.dylib")
    if os.path.exists(crypto_1) and not os.path.exists(crypto_sym):
        shutil.copyfile(crypto_1, crypto_sym)
        print("Copied libcrypto.1.0.0.dylib to libcrypto.dylib")

    ssl_1 = os.path.join(d1012, "libssl.1.0.0.dylib")
    ssl_sym = os.path.join(d1012, "libssl.dylib")
    if os.path.exists(ssl_1) and not os.path.exists(ssl_sym):
        shutil.copyfile(ssl_1, ssl_sym)
        print("Copied libssl.1.0.0.dylib to libssl.dylib")

print("Done preparing winCodeSign-2.6.0!")

