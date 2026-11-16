import { decryptData } from "../electron/crypto.js";
import fs from "node:fs";

const file = "C:/Users/akhil/Downloads/SSS_DEFENCE_SABER_.338_SNIPER_RIFLE_SECURE.ietm";
console.log("File size:", fs.statSync(file).size);

const candidates = ["123456", "admin123", "admin", "1234", "12345", "password", "test", "passkey", "123", "1"];
let found = false;
for (const p of candidates) {
  try {
    const data = decryptData(file, p);
    console.log(`Success with passkey '${p}'!`);
    console.log("data.assets length:", data.assets ? data.assets.length : "undefined");
    console.log("data.modules length:", data.modules ? data.modules.length : "undefined");
    found = true;
    break;
  } catch (e) {
    // try next
  }
}
if (!found) {
  console.log("Passkey wasn't in candidate list.");
}
