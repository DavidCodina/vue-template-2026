<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref, onMounted } from 'vue'

const progress = ref(0)
const isDownloading = ref(false)

/* ======================
      Props / Emits
====================== */

const { duration = 1000 } = defineProps<{
  duration?: number
}>()

/* ======================
  Methods / Functions
====================== */

function startDownload() {
  if (isDownloading.value) return

  isDownloading.value = true
  progress.value = 0
  const startedAt = performance.now()
  // const duration = 1000

  function advance(now: number) {
    const nextProgress = Math.min(((now - startedAt) / duration) * 100, 100)
    progress.value = nextProgress

    if (nextProgress < 100) {
      window.requestAnimationFrame(advance)
    } else {
      window.setTimeout(() => (isDownloading.value = false), 350)
    }
  }

  window.requestAnimationFrame(advance)
}

/* ======================
     Lifecycle Hooks
====================== */

onMounted(() => {
  startDownload()
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div>
    <div
      class="bg-card h-2 w-full overflow-hidden rounded-full border"
      role="progressbar"
      aria-label="Download progress"
      :aria-valuemin="0"
      :aria-valuemax="100"
      :aria-valuenow="Math.round(progress)"
    >
      <span class="bg-primary-500 block h-full" :style="{ width: `${progress}%` }" />
    </div>

    <div class="text-primary-500 text-center font-mono text-lg">{{ Math.trunc(progress) }}%</div>
  </div>
</template>
