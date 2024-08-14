import { defineStore } from 'pinia'

/**
 * 使用pinia定义一个名为'route-transition-name'的store。
 * 该store用于管理路由过渡名称，提供了一个方法来设置路由过渡的名称。
 */
const useRouteTransitionNameStore = defineStore('route-transition-name', () => {
  /**
   * 用于存储当前路由过渡的名称。
   */
  const routeTransitionName = ref('')

  /**
   * 设置路由过渡的名称。
   * @param name {string} - 要设置的路由过渡名称。
   */
  const setName = (name: string) => {
    routeTransitionName.value = name
  }

  /**
   * 返回store的状态和方法。
   * @returns {object} - 包含routeTransitionName和setName的方法的对象。
   */
  return {
    routeTransitionName,
    setName,
  }
})

export default useRouteTransitionNameStore
