/**
 * 导入全局状态管理实例，此实例用于管理应用程序的状态。
 */
import store from 'store'

/**
 * 导入过期插件，此插件为存储的状态添加过期功能，
 * 可以自动移除已过期的状态。
 */
import expirePlugin from 'store/plugins/expire'

/**
 * 将过期插件添加到状态管理实例中。
 * 这使得状态管理器支持状态过期的功能，可以自动清理过期的状态以释放存储空间。
 */
store.addPlugin(expirePlugin)

/**
 * 导出状态管理实例为 'localStorage'。
 * 'localStorage' 是一个命名导出，用于外部访问状态管理实例。
 */
export { store as localStorage }

/**
 * 默认导出状态管理实例。
 * 默认导出允许其他模块以更灵活的方式导入此实例，可以直接使用而无需指定名称。
 */
export default store
