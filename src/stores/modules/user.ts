import { defineStore } from 'pinia'
import { showConfirmDialog, showDialog, showFailToast, showNotify, showSuccessToast, showToast } from 'vant'
import enums from '@/utils/enums'
import { getMenuList, getUserInfo, isLogin, signIn, signOut } from '@/api/auth'
import { localStorage } from '@/utils/local-storage'
import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import router from '@/router'
import { startCheckLoginTimer, stopCheckLoginTimer } from '@/utils/loginChecker'
import { translateMessage } from '@/utils/i18n'
import { useSocket } from '@/hooks/websocket'

interface UserState {
  userId: number
  username: string
  email: string
  state: number
  roleId: number
  roleName: string
  publicKey: string
}

/**
 * 使用 Pinia 创建一个名为 'user' 的 store。
 * 该 store 负责管理用户登录状态和权限。
 *
 * @returns 返回包含 user 状态和相关方法的对象。
 */
const useUserStore = defineStore('user', () => {
  const user = reactive<UserState>({
    userId: 0,
    username: '',
    email: '',
    state: 0,
    roleId: 0,
    roleName: '',
    publicKey: '',
  })

  const permissions = ref<string[]>([])
  const tabBarList = ref<any[]>([])
  const ws = reactive<{
    socket: WebSocket | null
    send: ((data: any) => void) | null
    on: ((event: string, callback: (data: any) => void) => void) | null
    off: ((event: string, callback: (data: any) => void) => void) | null
  }>({
        socket: null,
        send: null,
        on: null,
        off: null,
      })

  /**
   * 初始化 WebSocket 连接
   */
  const initializeWebSocket = async (userId: number) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const { socket, send, on, off } = useSocket(`${protocol}//${location.host}/ws/${userId}`)
    ws.socket = socket
    ws.send = send
    ws.on = on
    ws.off = off

    on('close', () => console.log('WebSocket连接关闭!'))
    on('open', (event: Event) => console.log('WebSocket连接建立', event))
    on('message', (data: WSMessage) => {
      if (data.type === 'showNotify') {
        showNotify({ type: data.msgType, message: data.msg })
      }
      if (data.type === 'showToast') {
        if (data.msgType === 'success') { // 成功
          showSuccessToast(data.msg)
        }
        if (data.msgType === 'danger') { // 失败
          showFailToast(data.msg)
        }
        if (data.msgType === 'default') { // 自定义图标
          showToast({
            message: data.msg,
            icon: 'like-o',
          })
        }
      }
      if (data.type === 'showDialog') {
        if (data.msgType === 'default') { // 默认
          showDialog({ message: data.msg }).then(() => {
            // on close
          })
        }
        if (data.msgType === 'primary') { // 标题
          showDialog({ title: '标题', message: data.msg }).then(() => {
            // on close
          })
        }
        if (data.msgType === 'success') { // 消息确认
          showConfirmDialog({
            title: '标题',
            message: data.msg,
            theme: 'round-button', // 圆角按钮
          })
            .then(() => {
              // on confirm
            })
            .catch(() => {
              // on cancel
            })
        }
      }
      if (data.type === 'gameMessage') {
        console.log('收到游戏消息', JSON.stringify(data))
      }
    })
  }
  /**
   * 关闭WebSocket连接
   */
  const closeWebSocketConnect = async () => {
    if (ws.socket) {
      ws.socket.off('open')
      ws.socket.off('message')
      ws.socket.off('error')
      ws.socket.off('close')
      ws.socket.ws?.close()
    }
    else {
      console.error('关闭WebSocket连接失败！')
    }
  }

  /**
   * 用户登录
   */
  const signInFun = async (userForm: any, signType: string = enums.LOGIN_STATUS.SIGN_IN) => {
    const loginInfo = {
      username: userForm.username,
      email: userForm.email,
      passwordHash: userForm.password,
      signType,
    }

    try {
      const res = await signIn({}, loginInfo)
      if (res.success) {
        // 1. 设置 token
        localStorage.set(STORAGE_TOKEN_KEY, res.data)

        // 2. 获取用户信息
        const resUserInfo = await getUserInfo()
        if (resUserInfo.success) {
          user.userId = resUserInfo.data.userId as number
          user.username = resUserInfo.data.username as string
          user.email = resUserInfo.data.email as string
          user.state = resUserInfo.data.state as number
          user.roleId = resUserInfo.data.roleId as number
          user.roleName = resUserInfo.data.roleName as string
          user.publicKey = resUserInfo.data.publicKey as string
          permissions.value = resUserInfo.data.permissions
        }

        // 3. 获取 tabBar 菜单列表
        const resMenu = await getMenuList('tabBar')
        if (resMenu.success) {
          tabBarList.value = resMenu.data
        }

        // 4. 初始化 WebSocket 连接
        await initializeWebSocket(user.userId)

        // 5. 启动登录检查定时器
        await startCheckLoginTimer()

        // 6. 导航到个人资料页面
        await router.push('/profile')
      }
      else {
        showNotify({
          type: 'danger',
          message: translateMessage('business.loginError'),
        })
      }
    }
    catch (error) {
      console.error('登录失败:', error)
      showNotify({
        type: 'danger',
        message: translateMessage('business.loginError'),
      })
    }
  }

  /**
   * 用户登出
   */
  const signOutFun = async () => {
    try {
      const res = await signOut()
      if (res.success) {
        localStorage.remove(STORAGE_TOKEN_KEY)
        showNotify({
          type: 'success',
          message: translateMessage('business.loginOut'),
        })
        await closeWebSocketConnect()
        stopCheckLoginTimer()
        router.replace('/login')
      }
    }
    catch (error) {
      console.error('登出失败:', error)
      showNotify({
        type: 'danger',
        message: translateMessage('business.logoutError'),
      })
    }
  }

  /**
   * 检查是否已登录
   */
  const isLoginFun = async () => {
    try {
      const res = await isLogin()
      if (res.success) {
        return res.data
      }
      else {
        showNotify({
          type: 'danger',
          message: translateMessage('business.isLoginOut'),
        })
        await closeWebSocketConnect()
        return false
      }
    }
    catch (error) {
      console.error('检查登录状态失败:', error)
      showNotify({
        type: 'danger',
        message: translateMessage('business.checkLoginError'),
      })

      return false
    }
  }

  /**
   * 发送消息
   */
  const sendMsg = async (data: any) => {
    if (ws.send) {
      ws.send(data)
    }
    else {
      console.error('发送消息失败:WebSocket未初始化')
    }
  }

  /**
   * 检查权限
   */
  const checkPermissions = (permission: string) => {
    return permissions.value.includes(permission)
  }

  /**
   * 页面加载时检查用户是否已登录，并重新初始化 WebSocket 连接
   */
  const initializeOnLoad = async () => {
    if (localStorage.get(STORAGE_TOKEN_KEY)) {
      const isLoggedIn = await isLoginFun()
      if (isLoggedIn) {
        const resUserInfo = await getUserInfo()
        if (resUserInfo.success) {
          user.userId = resUserInfo.data.userId as number
          user.username = resUserInfo.data.username as string
          user.email = resUserInfo.data.email as string
          user.state = resUserInfo.data.state as number
          user.roleId = resUserInfo.data.roleId as number
          user.roleName = resUserInfo.data.roleName as string
          user.publicKey = resUserInfo.data.publicKey as string
          permissions.value = resUserInfo.data.permissions

          const resMenu = await getMenuList('tabBar')
          if (resMenu.success) {
            tabBarList.value = resMenu.data
          }

          await initializeWebSocket(user.userId)
          await startCheckLoginTimer()
        }
      }
    }
  }
  // 在页面加载时调用 initializeOnLoad
  onMounted(async () => {
    await initializeOnLoad()
  })
  onUnmounted(async () => {
    await closeWebSocketConnect()
    stopCheckLoginTimer()
  })

  return {
    user,
    permissions,
    tabBarList,
    sendMsg,
    signInFun,
    signOutFun,
    isLoginFun,
    checkPermissions,
  }
}, {
  persist: true,
})

export default useUserStore
