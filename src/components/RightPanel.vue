<template>
  <div>
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="['tab-button', { active: activeTab === tab }]"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <div class="tab-content">
      <div v-if="activeTab === 'Source Code'" style="height: 100%;">
        <MonacoEditor
          ref="monacoEditorRef"
          @contentChanged="onEditorContentChanged"
        />
      </div>
      <div v-else-if="activeTab === 'Constraints'">
        <em>Constraint form coming soon.</em>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose, defineEmits } from 'vue'
import MonacoEditor from './MonacoEditor.vue'

const tabs = ['Source Code', 'Constraints']
const activeTab = ref('Source Code')
const monacoEditorRef = ref(null)
const emit = defineEmits(['editorContentChanged']);

const setEditorContent = (content, language) => {
  if (monacoEditorRef.value) {
    monacoEditorRef.value.setContent(content, language);
    // Ensure the "Source Code" tab is active when content is set
    activeTab.value = 'Source Code';
  }
};

const getEditorContent = () => {
  return monacoEditorRef.value ? monacoEditorRef.value.getContent() : '';
};

const onEditorContentChanged = (newContent) => {
  emit('editorContentChanged', newContent);
};

defineExpose({
  setEditorContent,
  getEditorContent
});

</script>