import fs from "node:fs";
import path from "node:path";

console.log("cwd:", process.cwd());
console.log("public/assets/saber exists:", fs.existsSync(path.join(process.cwd(), "public/assets/saber")));
if (fs.existsSync(path.join(process.cwd(), "public/assets/saber"))) {
  console.log("public/assets/saber count:", fs.readdirSync(path.join(process.cwd(), "public/assets/saber")).length);
}
console.log("public/assets/g72 exists:", fs.existsSync(path.join(process.cwd(), "public/assets/g72")));
if (fs.existsSync(path.join(process.cwd(), "public/assets/g72"))) {
  console.log("public/assets/g72 count:", fs.readdirSync(path.join(process.cwd(), "public/assets/g72")).length);
}

// Check AppData
const appData = process.env.APPDATA || "";
const userAssets = path.join(appData, "Quantum TechDocs IETM Level-4", "assets");
const oldUserAssets = path.join(appData, "ietm-electron", "assets");
console.log("userAssets exists:", fs.existsSync(userAssets));
if (fs.existsSync(userAssets)) {
  console.log("userAssets count:", fs.readdirSync(userAssets).length);
}
console.log("oldUserAssets exists:", fs.existsSync(oldUserAssets));
if (fs.existsSync(oldUserAssets)) {
  console.log("oldUserAssets count:", fs.readdirSync(oldUserAssets).length);
}

