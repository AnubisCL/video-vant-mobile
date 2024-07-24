<script setup lang="ts">
import {storeToRefs} from 'pinia'
import useAppStore from '@/stores/modules/app'
import useRouteCache from '@/stores/modules/routeCache'
import useRouteTransitionNameStore from '@/stores/modules/routeTransitionName'
import useAutoThemeSwitcher from '@/hooks/useAutoThemeSwitcher'

// 设置页面头部信息，包括标题、元数据和链接 SEO
useHead({
  title: 'Vide Website Mobile',
  meta: [
    {
      name: 'description',
      content: 'Personal video website',
    },
    {
      name: 'theme-color',
      content: () => isDark.value ? '#00aba9' : '#ffffff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
    },
  ],
})

// 使用app store状态
const appStore = useAppStore()
// storeToRefs 将 pinia 中的 store 对象中的状态转换为具有 .value 的 ref 对象集合
const {mode} = storeToRefs(appStore)

// 使用routeTransitionNameStore状态
const routeTransitionNameStore = useRouteTransitionNameStore()
const {routeTransitionName} = storeToRefs(routeTransitionNameStore)

// 使用自动主题切换功能
const {initializeThemeSwitcher} = useAutoThemeSwitcher(appStore)

// 计算需要缓存的路由名称
const keepAliveRouteNames = computed(() => {
  return useRouteCache().routeCaches as string[]
})

// 页面挂载后初始化主题切换器
onMounted(() => {
  initializeThemeSwitcher()
})
</script>

<template>
  <!-- 提供主题配置的上下文 -->
  <VanConfigProvider :theme="mode">
    <!--TODO 和路由国际化相关-->
    <NavBar/>
    <!-- 根据路由切换组件，并应用过渡效果 -->
    <router-view v-slot="{ Component, route }">
      <!-- 模版语法 -->
      <!-- transition vue 内置组件 用于给插入、更新或移除的元素添加过渡效果。-->
      <!-- :name 属性用来设置过渡动画的类名前缀，例如 routeTransitionName 可能被设置为 'slide'，那么过渡动画的CSS类就会是 .slide-enter-active, .slide-leave-active 等。 -->
      <transition :name="routeTransitionName">
        <!-- Vue的内置组件，用于缓存不活动的组件实例，而不是销毁它们。这对于性能优化很有帮助，尤其是在频繁切换的组件之间，因为它避免了重复的创建和销毁过程。-->
        <!-- :include 属性是一个数组或字符串，指定了应该被缓存的组件名称。 -->
        <keepAlive :include="keepAliveRouteNames">
          <!-- 用于动态组件渲染。:is 属性绑定到一个变量，这个变量在运行时会被解析成实际要渲染的组件名称。-->
          <!-- 这里的 Component 变量应该是一个根据当前路由动态计算出的组件引用。 -->
          <component :is="Component" :key="route.name"/>
        </keepAlive>
      </transition>
    </router-view>
    <!--    -->
    <TabBar/>
  </VanConfigProvider>
</template>
