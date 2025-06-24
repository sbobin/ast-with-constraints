const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (filePath, content) => ipcRenderer.invoke('file:save', filePath, content),
  showUnsavedChangesDialog: (fileName) => ipcRenderer.invoke('dialog:showUnsavedChanges', fileName),
  sendCloseDecision: (decision) => ipcRenderer.send('close-decision', decision),
});

// The function `window.checkDirtyStateBeforeClose` is defined in App.vue (renderer's main world).
// The main process can call it via executeJavaScript.
// Exposing it here via contextBridge is redundant and was potentially problematic.
