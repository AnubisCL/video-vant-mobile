import { defineStore } from 'pinia'
import type { RouteRecordName } from 'vue-router'
import type { EnhancedRouteLocation } from '@/router/types'

/**
 * 使用pinia定义一个名为'route-cache'的store。
 * 该store用于管理需要被缓存的路由记录。
 */
const useRouteCacheStore = defineStore('route-cache', () => {
  // 使用ref创建一个存储路由名称的数组，用于保存需要被缓存的路由记录。
  const routeCaches = ref<RouteRecordName[]>([])

  /**
   * 将给定的路由添加到缓存列表中。
   * 如果路由已经存在于列表中，则不进行任何操作。
   * 如果路由的元信息中指定了keepAlive为true，则将其添加到缓存列表中。
   * @param route 要添加到缓存的路由位置。
   */
  const addRoute = (route: EnhancedRouteLocation) => {
    // 检查路由是否已经存在于缓存列表中，如果存在则不添加。
    if (routeCaches.value.includes(route.name))
      return

    // 如果路由的meta信息中包含keepAlive属性，则将其名称添加到缓存列表中。
    if (route?.meta?.keepAlive)
      routeCaches.value.push(route.name)
  }

  // 返回路由缓存数组和添加路由到缓存的方法。
  return {
    routeCaches,
    addRoute,
  }
})

export default useRouteCacheStore
