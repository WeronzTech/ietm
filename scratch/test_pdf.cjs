const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

app.whenReady().then(async () => {
  try {
    const win = new BrowserWindow({ show: false, width: 1024, height: 768 });
    await win.loadURL('data:text/html,<h1>Test PDF Generation</h1><p>Electron PDF generator test</p>');
    const data = await win.webContents.printToPDF({ printBackground: true });
    fs.writeFileSync('scratch/test.pdf', data);
    console.log('PDF generated successfully, size:', data.length);
  } catch (err) {
    console.error('Error generating PDF:', err);
  } finally {
    app.quit();
  }
});

