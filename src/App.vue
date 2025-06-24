<template>
  <div class="app-layout">
    <Toolstrip
      @open-file="handleOpenFile"
      @save-file="handleSaveFile"
      :isSaveFileDisabled="isSaveDisabled"
      :isDirty="isDirty"
      :isOpenFileDisabled="isLoadingFile"
    />
    <div class="container">
      <aside class="left-panel">
        <LeftPanel />
      </aside>
      <main class="right-panel">
        <RightPanel
          ref="rightPanelRef"
          @editorContentChanged="onEditorContentChanged"
        />
      </main>
    </div>
    <div v-if="errorMessage" class="error-popup">
      {{ errorMessage }}
      <button @click="clearErrorMessage">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LeftPanel from './components/LeftPanel.vue';
import RightPanel from './components/RightPanel.vue';
import Toolstrip from './components/Toolstrip.vue';

const rightPanelRef = ref(null);
const isSaveDisabled = ref(true);
const isDirty = ref(false);
const isLoadingFile = ref(false);
const currentFilePath = ref(null);
const originalContent = ref(''); // To compare for dirty state
const errorMessage = ref('');

const getFileLanguage = (filePath) => {
  if (!filePath) return 'plaintext';
  const extension = filePath.split('.').pop().toLowerCase();
  switch (extension) {
    case 'c':
    case 'h':
      return 'c';
    case 'cpp':
    case 'hpp':
      return 'cpp';
    default:
      return 'plaintext';
  }
};

const handleOpenFile = async () => {
  if (isLoadingFile.value) return;
  errorMessage.value = ''; // Clear previous errors

  // Check for unsaved changes if a file is already open and dirty
  if (isDirty.value && currentFilePath.value) {
    const fileName = getFileName(currentFilePath.value);
    // Response: 0=Save, 1=Don't Save, 2=Cancel
    const userChoice = await window.electronAPI.showUnsavedChangesDialog(fileName);

    if (userChoice === 0) { // Save
      await handleSaveFile();
      if (isDirty.value) { // Check if save was successful (isDirty became false)
        // Save failed or was cancelled, so we don't proceed to open a new file.
        errorMessage.value = "Save operation failed or was cancelled. Cannot open new file.";
        isLoadingFile.value = false; // Ensure isLoadingFile is reset if we bail here
        return;
      }
      // Save successful, proceed to open new file (outside this if block)
    } else if (userChoice === 1) { // Don't Save
      // Mark as not dirty, effectively discarding changes for the current file context
      isDirty.value = false;
      isSaveDisabled.value = true;
      // originalContent doesn't need to change here as we are about to load new content
      console.log("Discarded changes for:", currentFilePath.value);
      // Proceed to open new file (outside this if block)
    } else { // 2 = Cancel or dialog dismissed
      isLoadingFile.value = false; // Ensure isLoadingFile is reset
      return; // Do not proceed to open a new file
    }
  }

  // Proceed with opening a new file
  isLoadingFile.value = true;
  try {
    if (window.electronAPI && window.electronAPI.openFile) {
      const result = await window.electronAPI.openFile();
      if (result.error) {
        console.error('Error opening file:', result.error);
        errorMessage.value = result.error;
        currentFilePath.value = null;
        originalContent.value = '';
        if (rightPanelRef.value) {
          rightPanelRef.value.setEditorContent('// Error loading file. ' + result.error, 'plaintext');
        }
      } else if (result.filePath && result.content !== undefined) {
        currentFilePath.value = result.filePath;
        originalContent.value = result.content;
        const language = getFileLanguage(result.filePath);
        if (rightPanelRef.value) {
          rightPanelRef.value.setEditorContent(result.content, language);
        }
        isDirty.value = false;
        isSaveDisabled.value = true; // Save is disabled until changes are made
        console.log('File opened:', result.filePath);
      }
    } else {
      console.error('electronAPI.openFile is not available');
      errorMessage.value = 'File open functionality is not available.';
    }
  } catch (error) {
    console.error('Failed to open file:', error);
    errorMessage.value = `An unexpected error occurred: ${error.message}`;
    currentFilePath.value = null;
    originalContent.value = '';
     if (rightPanelRef.value) {
        rightPanelRef.value.setEditorContent('// Error loading file.', 'plaintext');
      }
  } finally {
    isLoadingFile.value = false;
  }
};

const handleSaveFile = async () => {
  if (!currentFilePath.value || !isDirty.value) {
    console.log("Save file: No file path or not dirty.");
    return;
  }

  if (rightPanelRef.value && window.electronAPI && window.electronAPI.saveFile) {
    const currentContent = rightPanelRef.value.getEditorContent();
    try {
      isLoadingFile.value = true; // Reuse isLoadingFile to disable open/save during save
      errorMessage.value = '';

      const result = await window.electronAPI.saveFile(currentFilePath.value, currentContent);

      if (result.error) {
        console.error('Error saving file:', result.error);
        errorMessage.value = `Failed to save file: ${result.error}`;
      } else if (result.success) {
        originalContent.value = currentContent; // Update original content to current
        isDirty.value = false;
        isSaveDisabled.value = true; // Disable save button as content is no longer dirty
        console.log('File saved:', result.filePath);
        // Optionally, display a success message
      }
    } catch (error) {
      console.error('Failed to save file:', error);
      errorMessage.value = `An unexpected error occurred while saving: ${error.message}`;
    } finally {
      isLoadingFile.value = false;
    }
  } else {
    console.error('Cannot save: Right panel ref or saveFile API not available.');
    errorMessage.value = 'Save functionality is not available.';
  }
};

const onEditorContentChanged = (newContent) => {
  if (currentFilePath.value) { // Only track dirty state if a file is loaded
    isDirty.value = newContent !== originalContent.value;
    isSaveDisabled.value = !isDirty.value;
  } else {
    isDirty.value = false;
    isSaveDisabled.value = true;
  }
};

const clearErrorMessage = () => {
  errorMessage.value = '';
};

// --- Unsaved Changes on Exit Logic ---
// Expose reactive state and save handler to the window object for preload script access
window.appIsDirty = isDirty; // This is a ref, so direct assignment might not be reactive in window.
                              // Let's use a computed property or a function for window.checkDirtyStateBeforeClose

const getFileName = (filePath) => {
  if (!filePath) return 'current file';
  return filePath.split(/[/\\]/).pop();
}

// This function will be called by checkDirtyStateBeforeClose from preload.js
// It returns true if the close should be prevented (dialog shown), false otherwise.
window.appShowUnsavedDialog = async () => {
  if (!isDirty.value) {
    return false; // Not dirty, allow close immediately
  }

  const fileName = getFileName(currentFilePath.value);
  // Response: 0=Save, 1=Don't Save, 2=Cancel
  const userChoice = await window.electronAPI.showUnsavedChangesDialog(fileName);

  if (userChoice === 0) { // Save
    if (currentFilePath.value) {
      await handleSaveFile(); // Attempt to save
      if (!isDirty.value) { // Check if save was successful (isDirty became false)
        window.electronAPI.sendCloseDecision('saved-and-close');
        return false; // Allow close now (main process will destroy window)
      } else {
        // Save failed or was cancelled by user (if save itself had a dialog, e.g. save as)
        // For now, assume save failure means we cancel the close to let user resolve
        console.warn("Save operation failed or was cancelled during exit. Close cancelled.");
        // We don't send a decision, effectively cancelling the close from renderer side
        return true; // Prevent close, user needs to resolve save issue or choose another option
      }
    } else {
      // No current file path (e.g. new unsaved file), should ideally trigger "Save As"
      // For now, treat as "Don't Save" because handleSaveFile won't work without a path.
      console.warn("Cannot save, no file path. Treating as Don't Save for exit.");
      window.electronAPI.sendCloseDecision('force-close');
      return false; // Allow close (main process will destroy)
    }
  } else if (userChoice === 1) { // Don't Save
    window.electronAPI.sendCloseDecision('force-close');
    return false; // Allow close (main process will destroy)
  } else { // 2 = Cancel or dialog dismissed
    // No decision sent, or send 'cancel' if main process needs it.
    // The main process currently only acts on 'force-close' or 'saved-and-close'.
    // Doing nothing here means the event.preventDefault() in main remains in effect.
    return true; // Prevent close
  }
};

// Need to make sure window.appIsDirty is reactive or checked correctly.
// The executeJavaScript in main process will get a snapshot.
// A better way for checkDirtyStateBeforeClose is to directly call a method that returns the current isDirty value.
// Let's redefine checkDirtyStateBeforeClose in preload to call a new specific function for checking dirty state.
// And then call appShowUnsavedDialog if dirty.

// Simpler approach for window.checkDirtyStateBeforeClose:
// It will be called from electron.js. If it returns true, electron.js prevents default.
// The function itself will handle the dialog and IPC responses.
window.checkDirtyStateBeforeClose = async () => {
  if (isDirty.value) {
    // Show dialog and handle logic internally
    return await window.appShowUnsavedDialog();
  }
  return false; // Not dirty, allow close.
};


</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Make app layout take full viewport height */
}

.container {
  display: flex;
  flex-grow: 1; /* Allows container to fill remaining space */
  overflow: hidden; /* Prevent content from overflowing */
}

.left-panel {
  width: 30%; /* Example width */
  overflow-y: auto;
}

.right-panel {
  width: 70%; /* Example width */
  display: flex;
  flex-direction: column;
}

.error-popup {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ffdddd;
  border: 1px solid #ff0000;
  color: #d8000c;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  z-index: 1000;
  display: flex;
  align-items: center;
}

.error-popup button {
  margin-left: 15px;
  padding: 5px 10px;
  background-color: #d8000c;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
</style>