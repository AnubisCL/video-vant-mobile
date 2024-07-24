 template
<script setup lang="ts">
  // 使用 useI18n 函数来获取国际化操作方法
  const { t } = useI18n()

  // 初始化激活的标签页索引
  const active = ref(0)

  // 使用 useRoute 函数来获取当前路由信息
  const route = useRoute()

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
    <van-tabbar-item replace to="/">
      {{ t('layouts.home') }}
      <!-- 自定义首页图标的显示方式 -->
      <template #icon>
        <van-icon name="home-o"/>
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/video">
      {{ t('layouts.video') }}
      <!-- 自定义个人资料图标的显示方式 -->
      <template #icon>
        <van-icon name="video-o"/>
      </template>
    </van-tabbar-item>
    <!-- 个人资料标签项，同样使用 replace 和 to 属性来指定跳转行为和路径 -->
    <!-- 使用 t 方法来获取国际化后的标签文本 -->
    <van-tabbar-item replace to="/profile">
      {{ t('layouts.profile') }}
      <!-- 自定义个人资料图标的显示方式 -->
      <template #icon>
        <van-icon name="user-o"/>
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>
