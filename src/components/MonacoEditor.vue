<template>
  <div ref="editorContainer" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import * as monaco from 'monaco-editor'

const editorContainer = ref(null)
let editor = null
const emit = defineEmits(['contentChanged']);

onMounted(() => {
  if (editorContainer.value) {
    editor = monaco.editor.create(editorContainer.value, {
      value: "// Please open a C/C++ file.",
      language: 'plaintext', // Default to plaintext, will be updated
      theme: 'vs-dark',
      automaticLayout: true,
    });

    editor.onDidChangeModelContent(() => {
      emit('contentChanged', editor.getValue());
    });
  }
})

onUnmounted(() => {
  if (editor) {
    editor.dispose()
  }
})

const setContent = (content, language = 'cpp') => { // Default to cpp, can be c
  if (editor) {
    const currentModel = editor.getModel();
    if (currentModel) {
        monaco.editor.setModelLanguage(currentModel, language);
    }
    editor.setValue(content);
  }
};

const getContent = () => {
  return editor ? editor.getValue() : '';
};

defineExpose({
  setContent,
  getContent
})
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
