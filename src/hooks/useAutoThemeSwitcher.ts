/**
 * 使用自动主题切换器。
 *
 * 此函数旨在根据文档根元素的类属性自动切换应用的主题模式（暗色或亮色）。
 * 它通过观察器API监听文档根元素的类属性变化，一旦检测到主题相关的类的变化，
 * 就会调用相应的函数来切换应用的主题模式。
 *
 * @param appStore 应用状态管理对象，用于切换应用的主题模式。
 * @returns {initializeThemeSwitcher} 初始化主题切换器的函数。
 */
import type { AppStore } from '@/stores/modules/app'

export default function useAutoThemeSwitcher(appStore: AppStore) {
  /**
   * 处理文档根元素属性变化的函数。
   *
   * 此函数检查文档根元素是否包含暗色主题的类。如果包含，则切换应用到暗色主题模式；
   * 否则，切换应用到亮色主题模式。
   */
  const handleAttributeChange = () => {
    const rootElement = document.documentElement
    if (rootElement.classList.contains('dark'))
      appStore.switchMode('dark')
    else
      appStore.switchMode('light')
  }

  /**
   * 观察器的配置选项。
   *
   * 此选项指定了观察器应关注文档根元素的类属性变化，并且只观察'class'属性的变化。
   */
  const observerOptions = {
    attributes: true,
    attributeFilter: ['class'],
  }

  /**
   * 创建一个 MutationObserver 实例。
   *
   * 此实例用于观察文档根元素的属性变化，并调用 handleAttributeChange 函数来处理变化。
   */
  const observer = new MutationObserver(handleAttributeChange)

  /**
   * 获取文档根元素。
   *
   * 此元素是被观察的目标元素，它的类属性变化将触发主题切换。
   */
  const targetElement = document.querySelector('html')

  /**
   * 初始化主题切换器。
   *
   * 此函数启动观察器，使其开始监听文档根元素的属性变化。
   */
  const initializeThemeSwitcher = () => {
    observer.observe(targetElement, observerOptions)
  }

  return { initializeThemeSwitcher }
}

