// electron/crypto.js
import crypto from "node:crypto";
import fs from "node:fs";

const ALGORITHM = "aes-256-gcm";

export function encryptData(data, password, outputPath) {
  // 1. Generate Salt and Key
  const salt = crypto.randomBytes(64);
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha512");
  const iv = crypto.randomBytes(16);

  // 2. Encrypt
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(data), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  // 3. Pack Payload (Salt + IV + Tag + EncryptedData)
  const payload = Buffer.concat([salt, iv, tag, encrypted]);
  fs.writeFileSync(outputPath, payload);
}

export function decryptData(inputPath, password) {
  // 1. Read File
  const buffer = fs.readFileSync(inputPath);

  // 2. Extract Parts
  const salt = buffer.subarray(0, 64);
  const iv = buffer.subarray(64, 80);
  const tag = buffer.subarray(80, 96);
  const encryptedText = buffer.subarray(96);

  // 3. Derive Key
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha512");

  // 4. Decrypt
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);
  return JSON.parse(decrypted.toString("utf8"));
}
