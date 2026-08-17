const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const AdmZip = require('adm-zip');
const { exec } = require('child_process');

// Define custom protocol
const PROTOCOL_PREFIX = 'bluebirdhub';
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(PROTOCOL_PREFIX, process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient(PROTOCOL_PREFIX);
}

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();

let mainWindow;

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  function createWindow() {
    mainWindow = new BrowserWindow({
      width: 600,
      height: 600,
      icon: path.join(__dirname, 'assets', 'bird.ico'),
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true
      },
      frame: false,
      resizable: true,
      backgroundColor: '#222222',
      show: false
    });

    mainWindow.loadFile('index.html');
    
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });
  }

  app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Titlebar actions
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  app.quit();
});

ipcMain.on('open-external', (event, url) => {
  shell.openExternal(url);
});

ipcMain.handle('show-alert', async (event, options) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return await dialog.showMessageBox(win, options);
});

// Plugin paths
const targetExtensionPath = path.join(
  app.getPath('appData'), 
  'Adobe', 'CEP', 'extensions', 'blue-bird-composer'
);

// Check current version
ipcMain.handle('check-local-version', async () => {
  const packagePath = path.join(targetExtensionPath, 'package.json');
  if (fs.existsSync(packagePath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      return { installed: true, version: pkg.version };
    } catch (e) {
      return { installed: false, version: null };
    }
  }
  return { installed: false, version: null };
});

// Check if Premiere Pro is running
ipcMain.handle('check-premiere-running', async () => {
  return new Promise((resolve) => {
    const isWin = process.platform === 'win32';
    const cmd = isWin ? 'tasklist' : 'ps aux';
    
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return resolve(false);
      }
      const isRunning = stdout.toLowerCase().includes('premiere');
      resolve(isRunning);
    });
  });
});

// Start Update
ipcMain.on('start-update', async (event, url) => {
  const tempZipPath = path.join(app.getPath('temp'), `blue-bird-update-${Date.now()}.zip`);
  
  try {
    event.sender.send('update-progress', { status: 'Downloading...', percent: 0 });

    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });

    const totalLength = response.headers['content-length'];
    let downloaded = 0;

    const writer = fs.createWriteStream(tempZipPath);

    response.data.on('data', (chunk) => {
      downloaded += chunk.length;
      if (totalLength) {
        const percent = Math.round((downloaded / totalLength) * 100);
        event.sender.send('update-progress', { status: 'Downloading...', percent });
      }
    });

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    event.sender.send('update-progress', { status: 'Extracting...', percent: 100 });
    
    // Extract
    const zip = new AdmZip(tempZipPath);
    
    // Ensure target exists
    if (!fs.existsSync(targetExtensionPath)) {
      fs.mkdirSync(targetExtensionPath, { recursive: true });
    }

    // Since Premiere is closed, we can just extract and overwrite safely
    zip.extractAllTo(targetExtensionPath, true);

    // Cleanup temp
    if (fs.existsSync(tempZipPath)) {
      fs.unlinkSync(tempZipPath);
    }

    event.sender.send('update-complete', { success: true });
  } catch (error) {
    console.error(error);
    event.sender.send('update-complete', { success: false, error: error.message });
  }
});
