const { contextBridge } = require('electron');

try {
  console.log('Preload script: Attempting to expose testAPI...');
  contextBridge.exposeInMainWorld('testAPI', {
    greeting: 'Hello from preload',
    version: 1
  });
  console.log('Preload script: testAPI exposed successfully.');
} catch (error) {
  console.error('Preload script: ERROR exposing testAPI -', error);
}

// Original electronAPI exposure is commented out for this test
/*
const { ipcRenderer } = require('electron'); // ipcRenderer would be needed if we uncomment below
contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (filePath, content) => ipcRenderer.invoke('file:save', filePath, content),
  showUnsavedChangesDialog: (fileName) => ipcRenderer.invoke('dialog:showUnsavedChanges', fileName),
  sendCloseDecision: (decision) => ipcRenderer.send('close-decision', decision),
});
*/
console.log('Preload script: Execution finished.');
