<template>
  <div ref="editorContainer" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import * as monaco from 'monaco-editor'

const editorContainer = ref(null)
let editor = null

onMounted(() => {
  if (editorContainer.value) {
    editor = monaco.editor.create(editorContainer.value, {
      value: "// Default content\nconsole.log('Hello, Monaco Editor!')",
      language: 'javascript',
      theme: 'vs-dark',
      automaticLayout: true, // Ensures the editor resizes correctly
    })
  }
})

onUnmounted(() => {
  if (editor) {
    editor.dispose()
  }
})

defineExpose({
  setContent: (content) => {
    if (editor) {
      editor.setValue(content)
    }
  }
})
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
