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
        <MonacoEditor ref="monacoEditorRef" />
      </div>
      <div v-else-if="activeTab === 'Constraints'">
        <em>Constraint form coming soon.</em>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MonacoEditor from './MonacoEditor.vue'

const tabs = ['Source Code', 'Constraints']
const activeTab = ref('Source Code')
const monacoEditorRef = ref(null)

onMounted(() => {
  if (monacoEditorRef.value) {
    monacoEditorRef.value.setContent("// Source code will be displayed here");
  }
})
</script>