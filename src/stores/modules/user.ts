import { defineStore } from 'pinia'
import { showNotify } from 'vant'
import enums from '@/utils/enums'
import { getMenuList, getUserInfo, isLogin, signIn, signOut } from '@/api/auth'
import { localStorage } from '@/utils/local-storage'
import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import router from '@/router'
import { startCheckLoginTimer, stopCheckLoginTimer } from '@/utils/loginChecker'
import { translateMessage } from '@/utils/i18n'

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
 * 使用pinia创建一个名为'user'的store。
 * 该store负责管理用户登录状态和权限。
 *
 * @returns 返回包含user状态和相关方法的对象。
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
  const permissions = ref([])
  const tabBarList = ref([])
  const signInFun = async (userForm: any, signType: string = enums.LOGIN_STATUS.SIGN_IN) => {
    const loginInfo = {
      username: userForm.username,
      email: userForm.email,
      passwordHash: userForm.password,
      signType,
    }
    const res = await signIn({}, loginInfo)
    if (res.success) {
      // 1.token
      localStorage.set(STORAGE_TOKEN_KEY, res.data)
      // 2.setUserInfo
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
      const resMenu = await getMenuList('tabBar')
      if (resMenu.success) {
        // tabBar 菜单Router控制
        tabBarList.value = resMenu.data
      }
      await startCheckLoginTimer()
      await router.push('/profile')
    }
    else {
      showNotify({
        type: 'danger',
        message: translateMessage('business.loginError'),
      })
    }
  }
  const signOutFun = async () => {
    const res = await signOut()
    if (res.success) {
      localStorage.remove(STORAGE_TOKEN_KEY)
      showNotify({
        type: 'success',
        message: translateMessage('business.loginOut'),
      })
      stopCheckLoginTimer()
      router.replace('/login')
    }
  }
  const isLoginFun = async () => {
    const res = await isLogin()
    if (res.success) {
      return res.data === 'true'
    }
    else {
      showNotify({
        type: 'danger',
        message: translateMessage('business.isLoginOut'),
      })
      return false
    }
  }
  const checkPermissions = (permission: string) => {
    return permissions.value.includes(permission)
  }
  return {
    user,
    permissions,
    tabBarList,
    signInFun,
    signOutFun,
    isLoginFun,
    checkPermissions,
  }
}, {
  persist: true,
})

export default useUserStore
