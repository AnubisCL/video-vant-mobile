import { showNotify } from 'vant'
import { isLogin } from '@/api/auth'
import router from '@/router'
import { translateMessage } from '@/utils/i18n'

let checkLoginTimer: NodeJS.Timeout | null = null
export async function startCheckLoginTimer() {
  checkLoginTimer = setInterval(async () => {
    const res = await isLogin()
    if (res.success) {
      if (res.data === 'false') {
        showNotify({
          type: 'danger',
          message: translateMessage('business.isLoginOut'),
        })
        router.replace('/login')
      }
    }
    else {
      showNotify({
        type: 'danger',
        message: translateMessage('business.isLoginErr'),
      })
      router.replace('/login')
    }
  }, 30000)
}

export function stopCheckLoginTimer() {
  if (checkLoginTimer !== null) {
    clearInterval(checkLoginTimer)
    checkLoginTimer = null
  }
}
