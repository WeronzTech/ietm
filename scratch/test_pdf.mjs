import { app, BrowserWindow } from 'electron';
import fs from 'fs';
import path from 'path';

async function testPdf() {
  await app.whenReady();
  const win = new BrowserWindow({ show: false, width: 1024, height: 768 });
  await win.loadURL('data:text/html,<h1>Test PDF Generation</h1><p>Electron PDF generator test</p>');
  const data = await win.webContents.printToPDF({ printBackground: true });
  fs.writeFileSync('scratch/test.pdf', data);
  console.log('PDF generated successfully, size:', data.length);
  app.quit();
}

testPdf().catch(err => {
  console.error('PDF error:', err);
  app.quit();
});

