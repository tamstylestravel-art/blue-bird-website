const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Window controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  
  openExternal: (url) => ipcRenderer.send('open-external', url),
  
  checkLocalVersion: () => ipcRenderer.invoke('check-local-version'),
  checkPremiereRunning: () => ipcRenderer.invoke('check-premiere-running'),
  
  startUpdate: (url) => ipcRenderer.send('start-update', url),
  
  showAlert: (options) => ipcRenderer.invoke('show-alert', options),
  
  onUpdateProgress: (callback) => ipcRenderer.on('update-progress', (event, data) => callback(data)),
  onUpdateComplete: (callback) => ipcRenderer.on('update-complete', (event, data) => callback(data)),
  
  fetchRemoteVersion: async (idToken) => {
    try {
      // In development, you might want to use http://localhost:3000/api/plugin-info
      // In production, use https://bluebirdpicturesstudio.com/api/plugin-info
      const res = await fetch('http://localhost:3000/api/plugin-info', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      const data = await res.json();
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
});
