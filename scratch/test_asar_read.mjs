import fs from "node:fs";
import path from "node:path";

const asarPath = path.resolve("release/win-unpacked/resources/app.asar");
console.log("asar exists:", fs.existsSync(asarPath));

const innerDist = path.join(asarPath, "dist", "assets", "saber", "page_1_img_2_Im2.jpg");
console.log("innerDist exists:", fs.existsSync(innerDist));
console.log("innerDist stat:", fs.existsSync(innerDist) ? fs.statSync(innerDist).size : "none");

