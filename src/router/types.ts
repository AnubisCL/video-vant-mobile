/**
 * 导入类型定义，用于增强路由位置信息。
 * @import type { RouteLocationNormalized } from 'vue-router'
 */

/**
 * 定义了增强的路由位置类型，它扩展了vue-router的RouteLocationNormalized类型。
 * 此类型添加了额外的元数据字段，用于路由的更细致控制和管理。
 */
export type EnhancedRouteLocation = RouteLocationNormalized & {
  /**
   * 允许为路由添加自定义元数据。
   * 这些元数据可以用于各种目的，如路由级别的权限控制，路由的命名，以及是否应该保持路由的组件 alive。
   */
  meta: {
    /**
     * 可选字段，用于指定路由的优先级或重要性。
     * 这个值的的具体含义依赖于应用的具体实现，可以是数字或其他任意类型。
     */
    level?: number | unknown

    /**
     * 可选字段，用于给路由指定一个名称。
     * 这个名称可以用于路由的导航或标识。
     */
    name?: string

    /**
     * 可选字段，指示是否应该将路由对应的组件进行缓存。
     * 当设置为true时，对应的组件会在路由变化时不会被销毁，而是保持 alive 状态。
     */
    keepAlive?: boolean
  }
}
