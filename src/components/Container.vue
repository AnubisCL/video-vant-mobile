<script setup lang="ts">
/**
 * 组件定义Props
 *
 * @prop {number} paddingT - 上内边距的值，默认为46。用于设置组件上边界的内边距。
 * @prop {number} paddingB - 下内边距的值，默认为0。用于设置组件上边界的内边距。
 * @prop {number} paddingX - 水平内边距的值，默认为16。用于设置组件左右两边的内边距。
 */
defineProps({
  paddingT: {
    type: Number,
    default: 46,
  },
  paddingB: {
    type: Number,
    default: 0,
  },
  paddingX: {
    type: Number,
    default: 16,
  },
})
</script>

<template>
  <!-- 主要内容容器，具有绝对定位和垂直方向的滚动条 -->
  <main
    class="absolute left-0 h-full w-full overflow-y-auto"
    :style="`padding-top: ${paddingT}px; padding-left: ${paddingX}px; padding-right: ${paddingX}px; padding-bottom: ${paddingB}px;`"
  >
    <!-- 使用插槽来传入组件的具体内容 -->
    <slot />
  </main>
</template>
