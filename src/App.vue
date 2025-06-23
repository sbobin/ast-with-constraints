<template>
  <div class="container">
    <aside class="left-panel">
      <LeftPanel />
    </aside>
    <main class="right-panel">
      <RightPanel />
    </main>
  </div>
</template>

<script setup>
import LeftPanel from './components/LeftPanel.vue'
import RightPanel from './components/RightPanel.vue'
</script>