<script setup lang="ts">
/**
 * 使用 `useRoute` 和 `useRouter` 来获取路由信息和进行路由操作。
 * 使用 `useI18n` 来获取国际化工具方法。
 * 定义 `onBack` 函数来处理返回操作，如果历史记录中有上一页，则返回上一页，否则返回到应用的根路径。
 * 计算属性 `title` 根据当前路由的元信息来决定导航栏的标题，支持国际化。
 */
const route = useRoute()
const router = useRouter()

function onBack() {
  /**
   * 如果浏览器历史记录中有上一页，则返回上一页，否则返回到应用的根路径。
   * 这种方法提供了更灵活的返回操作处理。
   */
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}

const { t } = useI18n()

const title = computed(() => {
  /**
   * 根据路由的元信息来决定导航栏的标题。
   * 如果路由元信息中提供了 i18n 键，则使用国际化方法来获取标题；
   * 否则，如果提供了 title 键，则直接使用该标题；
   * 如果没有任何提供，则导航栏标题为空。
   */
  if (!route.meta)
    return ''

  return route.meta.i18n ? t(route.meta.i18n) : (route.meta.title || '')
})
</script>

<template>
  <!-- left-arrow 返回上级 -->
  <!-- fixed 固定在顶部 -->
  <VanNavBar
    v-show="title"
    :title="title"
    :fixed="true"
    clickable left-arrow
    @click-left="onBack"
  />
</template>

