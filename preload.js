const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (filePath, content) => ipcRenderer.invoke('file:save', filePath, content),
  showUnsavedChangesDialog: (fileName) => ipcRenderer.invoke('dialog:showUnsavedChanges', fileName),
  sendCloseDecision: (decision) => ipcRenderer.send('close-decision', decision),
});

// Expose a function for the main process to call to check dirty state
// This function will be responsible for showing the dialog if needed
contextBridge.exposeInMainWorld('checkDirtyStateBeforeClose', async () => {
  // This will be properly implemented in App.vue or similar
  // It needs access to the 'isDirty' state and 'handleSaveFile' function
  // For now, this is just a placeholder, the actual logic will be in the Vue app
  // The Vue app will call electronAPI.showUnsavedChangesDialog and electronAPI.sendCloseDecision

  // This function needs to be defined in the renderer context, e.g., on window object
  // and made accessible to executeJavaScript.
  // The actual implementation will be in App.vue's setup.
  if (window.appIsDirty && typeof window.appShowUnsavedDialog === 'function') {
    return await window.appShowUnsavedDialog(); // Returns true if close should be prevented, false otherwise
  }
  return false; // Not dirty, or handler not ready, allow close
});
