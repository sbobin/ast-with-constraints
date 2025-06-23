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
      <div v-if="activeTab === 'Source Code'">
        <em>Source code view coming soon.</em>
      </div>
      <div v-else-if="activeTab === 'Constraints'">
        <em>Constraint form coming soon.</em>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const tabs = ['Source Code', 'Constraints']
const activeTab = ref('Source Code')
</script>