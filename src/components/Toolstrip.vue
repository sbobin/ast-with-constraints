<template>
  <div class="toolstrip">
    <button @click="handleOpenFile" :disabled="isOpenFileDisabled">Open File</button>
    <button @click="handleSaveFile" :disabled="isSaveFileDisabled">Save File</button>
    <span v-if="isDirty" class="dirty-indicator">*</span>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue';

// Props to control button states from parent
const props = defineProps({
  isSaveFileDisabled: {
    type: Boolean,
    default: true
  },
  isDirty: {
    type: Boolean,
    default: false
  },
  isOpenFileDisabled: { // Added for consistency, though not strictly in initial plan for disabling open
    type: Boolean,
    default: false
  }
});

// Emits for button actions
const emit = defineEmits(['open-file', 'save-file']);

const handleOpenFile = () => {
  emit('open-file');
};

const handleSaveFile = () => {
  emit('save-file');
};

</script>

<style scoped>
.toolstrip {
  padding: 10px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
}

.toolstrip button {
  margin-right: 10px;
  padding: 5px 10px;
  cursor: pointer;
}

.toolstrip button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.dirty-indicator {
  margin-left: 5px;
  color: red;
  font-weight: bold;
}
</style>
