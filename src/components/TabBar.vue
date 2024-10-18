 template
<script setup lang="ts">
const props = defineProps({
  tabBarList: {
    type: Object,
    default: () => ({}),
  },
})
const active = ref(0)
const tabBarList = ref([])

// 使用 useRoute 函数来获取当前路由信息
const route = useRoute()

// 监听 options 变化
watch(
  () => props.tabBarList,
  (newOptions: any) => {
    tabBarList.value = newOptions
  },
  { immediate: true, deep: true }, // 立即执行一次以初始化
)
const { t } = useI18n()

// 计算属性 display 用于决定是否显示 tabbar
// 根据路由的 meta 信息中的 level 来决定是否显示，仅在 level 不为 2 时显示
const display = computed(() => {
  if (route.meta.level && route.meta.level !== 2)
    return true
  return false
})
</script>

<template>
  <!-- 使用 van-tabbar 组件来显示底部导航栏，根据 display 的值决定是否显示 -->
  <van-tabbar v-show="display" v-model="active" route>
    <!-- 首页标签项，通过 to 属性指定跳转路径，使用 replace 属性以替换历史记录的方式跳转 -->
    <!-- 使用 t 方法来获取国际化后的标签文本 -->
    <van-tabbar-item v-for="item in tabBarList" :key="item.menuPath" replace :to="item.menuPath">
      {{ t(item.menuTitle) }}
      <template #icon>
        <van-icon :name="item.menuIcon" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>
