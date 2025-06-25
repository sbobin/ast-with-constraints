const { contextBridge, ipcRenderer } = require('electron'); // Ensure ipcRenderer is required

try {
  console.log('Preload script: Attempting to expose electronAPI...');
  contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    saveFile: (filePath, content) => ipcRenderer.invoke('file:save', filePath, content),
    showUnsavedChangesDialog: (fileName) => ipcRenderer.invoke('dialog:showUnsavedChanges', fileName),
    sendCloseDecision: (decision) => ipcRenderer.send('close-decision', decision),
  });
  console.log('Preload script: electronAPI exposed successfully.');
} catch (error) {
  console.error('Preload script: ERROR exposing electronAPI -', error);
}

console.log('Preload script: Execution finished.');
