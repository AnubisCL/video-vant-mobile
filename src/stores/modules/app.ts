import { defineStore } from 'pinia'
import type { ConfigProviderTheme } from 'vant'

/**
 * 定义应用程序状态的存储接口。
 * 包含切换主题模式的方法。
 */
export interface AppStore {
  switchMode: (val: ConfigProviderTheme) => void
}

// 检测浏览器是否首选暗色主题
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

/**
 * 使用pinia创建一个名为'app'的store。
 * 该store负责管理应用程序的主题模式。
 *
 * @returns 返回包含mode和switchMode方法的对象。
 */
const useAppStore = defineStore('app', () => {
  // 根据浏览器首选主题模式决定初始主题
  const theme = prefersDark ? 'dark' : 'light'
  // 使用ref跟踪当前主题模式
  const mode = ref<ConfigProviderTheme>(theme)

  /**
   * 切换主题模式。
   *
   * @param val 新的主题模式。
   */
  const switchMode = (val: ConfigProviderTheme) => {
    mode.value = val
  }

  return {
    mode,
    switchMode,
  }
}, {
  persist: true, // 持久化存储
})

export default useAppStore
