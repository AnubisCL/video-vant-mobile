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

// 监听 options 变化
watch(
  () => props.options,
  (newOptions) => {
    if (player.value) {
      // 如果 player 已经存在，则更新配置
      player.value.dispose() // 先销毁旧的 player
      if (newOptions.sources.length >0) {
        player.value = videoJs(rVideoPlayer.value as Element, newOptions)
      } else {
        console.log('update no source')
      }
    } else {
      if (newOptions.sources.length >0) {
        // 如果 player 还不存在，则创建新的 player
        player.value = videoJs(rVideoPlayer.value as Element, newOptions)
      } else {
        console.log('no source')
      }
    }
  },
  { immediate: true, deep: true } // 立即执行一次以初始化 player
)

// onMounted(() => {
//   if (props.options.sources.length > 0) {
//     player.value = videoJs(rVideoPlayer.value as Element, props.options)
//   }
// })
//
// // 或者使用 onUpdated
// onUpdated(() => {
//   if (rVideoPlayer.value && player.value) {
//     player.value.dispose() // 先销毁旧的 player
//     player.value = videoJs(rVideoPlayer.value as Element, props.options)
//   }
// })

onUnmounted(() => {
  if (player.value) {
    player.value.dispose()
  }
})
</script>
