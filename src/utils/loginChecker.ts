import { showNotify } from 'vant'
import { useI18n } from 'vue-i18n'
import { isLogin } from '@/api/auth'
import router from '@/router'

let checkLoginTimer: NodeJS.Timeout | null = null
export async function startCheckLoginTimer() {
  const { t } = useI18n()
  checkLoginTimer = setInterval(async () => {
    const res = await isLogin()
    if (res.success) {
      if (res.data === 'false') {
        showNotify({
          type: 'danger',
          message: t('business.isLoginOut'),
        })
        router.replace('/login')
      }
    }
    else {
      showNotify({
        type: 'danger',
        message: t('business.isLoginErr'),
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
