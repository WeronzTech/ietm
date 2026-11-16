import fs from "node:fs";
import path from "node:path";

console.log("dist exists:", fs.existsSync("dist"));
console.log("dist/assets/saber exists:", fs.existsSync("dist/assets/saber"));
console.log("dist/assets/g72 exists:", fs.existsSync("dist/assets/g72"));
if (fs.existsSync("dist/assets/saber")) {
  console.log("dist/assets/saber count:", fs.readdirSync("dist/assets/saber").length);
}
if (fs.existsSync("dist/assets/g72")) {
  console.log("dist/assets/g72 count:", fs.readdirSync("dist/assets/g72").length);
}

