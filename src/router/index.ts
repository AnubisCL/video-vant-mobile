/**
 * 设置并配置应用的路由功能。
 *
 * 使用Vue Router创建基于项目公共路径的历史模式路由实例。
 * 集成NProgress，在路由切换时显示加载进度。
 * 利用自定义的store管理路由缓存和路由过渡动画名称。
 */

// 导入Vue Router的createRouter和createWebHistory方法，以及自动化的路由配置。
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'

// 导入NProgress库以在页面加载时显示进度条，并导入其CSS样式。
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 导入自定义类型EnhancedRouteLocation，以及两个自定义store：routeTransitionName和routeCache。
import type { EnhancedRouteLocation } from './types'
import useRouteTransitionNameStore from '@/stores/modules/routeTransitionName'
import useRouteCacheStore from '@/stores/modules/routeCache'
import {localStorage} from "@/utils/local-storage";
import {STORAGE_TOKEN_KEY} from "@/stores/mutation-type";

// 配置NProgress的显示选项，包括显示加载指示器和指定父元素ID。
NProgress.configure({ showSpinner: true, parent: '#app' })

// 创建路由实例，使用history模式，并传入项目的公共路径和自动化生成的路由配置。
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_PUBLIC_PATH),
  routes,
})

// 在每次路由变更前执行的全局钩子。
router.beforeEach((to: EnhancedRouteLocation, from, next) => {
  // 开始显示进度条。
  NProgress.start()

  if (to.meta.level > 0) {
    const token = localStorage.get(STORAGE_TOKEN_KEY)
    if (!token) {
      next({ name: 'login' })
    }
  }
  // 使用routeCacheStore添加当前路由到缓存中。
  const routeCacheStore = useRouteCacheStore()
  routeCacheStore.addRoute(to)

  // 根据路由层级变化设置过渡动画名称。
  const routeTransitionNameStore = useRouteTransitionNameStore()
  if (to.meta.level > from.meta.level) {
    routeTransitionNameStore.setName('slide-fadein-left')
  } else if (to.meta.level < from.meta.level) {
    routeTransitionNameStore.setName('slide-fadein-right')
  } else {
    routeTransitionNameStore.setName('')
  }

  // 调用next()允许路由继续执行。
  next()
})

// 在每次路由变更后执行的全局钩子，完成进度条的显示。
router.afterEach(() => {
  NProgress.done()
})

// 导出路由实例供其他模块使用。
export default router
