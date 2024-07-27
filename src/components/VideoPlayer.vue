<template>
  <video ref="rVideoPlayer" class="video-js vjs-default-skin"></video>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted,defineProps } from 'vue'
import videoJs from 'video.js'
const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  }
})

const rVideoPlayer = ref<Element>()
let player = ref()
onMounted(() => {
  player.value = videoJs(rVideoPlayer.value as Element, props.options)
})
onUnmounted(() => {
  if (player.value) {
    player.value.dispose()
  }
})
</script>
