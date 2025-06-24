const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

let mainWindow; // Declare mainWindow at the top level

function createWindow () {
  mainWindow = new BrowserWindow({ // Assign to the top-level mainWindow
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false, // Best practice for security
      contextIsolation: true, // Best practice for security
      preload: path.join(__dirname, 'preload.js') // Specify preload script
    }
  })

  mainWindow.webContents.openDevTools(); // Open dev tools for easier debugging

  const isDev = !app.isPackaged
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    // Make sure 'dist' is the correct output directory from Vite build
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }

  // Handle the close event
  mainWindow.on('close', async (event) => {
    // Send a message to the renderer to check for dirty state
    const isDirty = await mainWindow.webContents.executeJavaScript('window.checkDirtyStateBeforeClose && window.checkDirtyStateBeforeClose();', true)
      .catch(err => {
        console.error("Error executing checkDirtyStateBeforeClose:", err);
        return false; // If script fails, assume not dirty or unable to check, proceed with close.
      });

    if (isDirty) {
      event.preventDefault(); // Prevent the window from closing immediately
      // Renderer will handle the dialog and send 'close-decision'
    }
    // If not dirty, the window closes normally.
  });

  mainWindow.on('closed', () => {
    // Dereference the window object
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Handle open-file dialog
ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'C/C++ Files', extensions: ['c', 'cpp', 'h', 'hpp'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })
  if (canceled || filePaths.length === 0) {
    return { error: 'File selection canceled or no file selected.' }
  }
  const filePath = filePaths[0]
  const fileExtension = path.extname(filePath).toLowerCase()
  const allowedExtensions = ['.c', '.cpp', '.h', '.hpp']

  if (!allowedExtensions.includes(fileExtension)) {
    return { error: `Invalid file type. Please select a C or C++ file (${allowedExtensions.join(', ')}).` }
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return { filePath, content }
  } catch (error) {
    console.error('Failed to read file:', error)
    return { error: `Failed to read file: ${error.message}` }
  }
})

// Handle save-file
ipcMain.handle('file:save', async (event, filePath, content) => {
  if (!filePath) {
    return { error: 'File path is not specified.' };
  }
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true, filePath };
  } catch (error) {
    console.error('Failed to save file:', error);
    return { error: `Failed to save file: ${error.message}` };
  }
});

// IPC handler for showing the unsaved changes dialog
ipcMain.handle('dialog:showUnsavedChanges', async (event, fileName) => {
  const focusedWindow = BrowserWindow.fromWebContents(event.sender);
  const result = await dialog.showMessageBox(focusedWindow, {
    type: 'warning',
    buttons: ['Save', "Don't Save", 'Cancel'],
    title: 'Unsaved Changes',
    message: `You have unsaved changes in "${fileName}". Do you want to save them before closing?`,
    defaultId: 0, // Default to 'Save'
    cancelId: 2   // Corresponds to 'Cancel'
  });
  // result.response will be 0 for 'Save', 1 for "Don't Save", 2 for 'Cancel'
  return result.response;
});

// Listen for the renderer's decision on how to proceed with closing
// This was previously duplicated, ensuring it's here once and correctly placed.
ipcMain.on('close-decision', (event, decision) => {
  if (mainWindow) {
    if (decision === 'force-close') { // User chose "Don't Save" or saving failed/cancelled during prompt
      mainWindow.destroy(); // Bypass 'close' event handlers and force close
    } else if (decision === 'saved-and-close') { // User chose "Save" and it was successful
       mainWindow.destroy();
    }
    // If 'cancel', do nothing, window remains open as event.preventDefault() was called.
  }
});
// The duplicated mainWindow, createWindow, and the second close-decision listener
// that were here have been removed.
// Also, the erroneous duplicated dialog:openFile block at the end has been removed.