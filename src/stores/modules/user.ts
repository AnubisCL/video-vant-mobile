import { defineStore } from 'pinia'
import enums from '@/utils/enums'
import {getMenuList, getUserInfo, isLogin, signIn, signOut} from "@/api/auth";
import {showNotify} from "vant";
import {localStorage} from "@/utils/local-storage";
import {STORAGE_TOKEN_KEY} from "@/stores/mutation-type";
import router from "@/router";
import {startCheckLoginTimer, stopCheckLoginTimer} from "@/utils/loginChecker";

const useUserStore = defineStore('user', {
  state: () => reactive({
      user: {
        userId: null,
        username: '',
        email: '',
        state: 0,
        roleId: 0,
        roleName: ''
      },
      permission: []
  }),
  getters: {
    getPermission() {
      return this.user.permission
    }
  },
  actions: {
    async signIn(user: any, signType: string = enums.LOGIN_STATUS.SIGN_IN) {
      const loginInfo = {
        username: user.username,
        email: user.email,
        passwordHash: user.password,
        signType: signType
      }
      let res = await signIn({}, loginInfo)
      if (res.success) {
        // 1.token
        localStorage.set(STORAGE_TOKEN_KEY, res.data)
        // 2.setUserInfo
        let resUserInfo = await getUserInfo()
        if (resUserInfo.success) {
          this.user.userId = resUserInfo.data.userId
          this.user.username = resUserInfo.data.username
          this.user.email = resUserInfo.data.email
          this.user.state = resUserInfo.data.state
          this.user.roleId = resUserInfo.data.roleId
          this.user.roleName = resUserInfo.data.roleName
          this.permission = resUserInfo.data.permission
        }
        // 3.menu
        let resMenu = await getMenuList()
        if (resMenu.success) {
          //todo：菜单Router控制
          console.log("menu=>"+resMenu.data)
        }
        await startCheckLoginTimer()
        await router.push('/')
      } else {
        showNotify({
          type: 'danger',
          message: res.message
        })
      }
    },
    async signOut() {
      let res = await signOut()
      if (res.success) {
        localStorage.set(STORAGE_TOKEN_KEY, '')
        showNotify({
          type: 'success',
          message: res.message
        })
        await stopCheckLoginTimer()
      }
    },
    async isLogin() {
      let res = await isLogin()
      if (res.success) {
        return res.data == 'true'
      } else {
        showNotify({
          type: 'danger',
          message: res.message
        })
        return false
      }
    }
  }
}, {
  persist: true,
})

export default useUserStore
