import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { app, BrowserWindow } = require("electron");
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false });
  await win.loadFile(path.join(__dirname, "../dist/index.html"));

  const result = await win.webContents.executeJavaScript(`
    new Promise(resolve => {
      const img = document.createElement('img');
      img.onload = () => resolve({ status: 'loaded', src: img.src, w: img.naturalWidth });
      img.onerror = () => resolve({ status: 'error', src: img.src, w: img.naturalWidth });
      img.src = '/assets/saber/page_1_img_2_Im2.jpg';
      document.body.appendChild(img);
    })
  `);
  console.log("Image load test result:", result);
  app.quit();
});
