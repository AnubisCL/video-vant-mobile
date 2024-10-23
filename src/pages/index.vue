<script setup lang="ts">
import useUserStore from '@/stores/modules/user'
import { localStorage } from '@/utils/local-storage'
import { HISTORY_ACCOUNT, HISTORY_PASSWORD, SAVE_PASSWORD } from '@/stores/mutation-type'

definePage({
  name: 'login',
  meta: {
    level: 0,
  },
})

const userStore = useUserStore()
const { t } = useI18n()
const userForm = reactive({
  account: '',
  password: '',
})
const loginLoading = ref(false)
const savePassword = ref(false)

onMounted(() => {
  const save = localStorage.get(SAVE_PASSWORD)
  if (save !== null) {
    savePassword.value = save
  }
  userForm.account = localStorage.get(HISTORY_ACCOUNT)
  if (savePassword.value === true) {
    userForm.password = localStorage.get(HISTORY_PASSWORD)
  }
})

// 登录
async function onSubmit() {
  loginLoading.value = true
  const isEmail = userForm.account.indexOf('@') > 0
  await userStore.signInFun({
    username: isEmail ? randomUsername() : userForm.account,
    email: isEmail ? userForm.account : '',
    password: userForm.password,
  })
  localStorage.set(HISTORY_ACCOUNT, userForm.account)
  if (savePassword.value === true) {
    localStorage.set(HISTORY_PASSWORD, userForm.password)
  }
  loginLoading.value = false
  localStorage.set(SAVE_PASSWORD, savePassword.value)
}

// 生成随机用户名
function randomUsername() {
  const randomString = Math.random().toString(36).substring(2, 10)
  return `user_${randomString}`
}
</script>

<template>
  <Container :padding-x="0">
    <!--      style="background-image: " -->
    <div style="">
      <Vue3Lottie
        animation-link="./src/composables/humber.json"
        :height="200"
        :width="200"
        :auto-play="true"
      />
      <h1 style="color: #674188; text-align: center; margin: 0 0 30px 0; ">
        Login In
      </h1>
      <van-form style="text-align: center; padding: 0 30px;" @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="userForm.account"
            left-icon="contact"
            :name="t('edit.account')"
            :label="t('edit.account')"
            :placeholder="t('edit.emailOrUsername')"
            :rules="[{ required: true, message: t('edit.emailOrUsernameMsg') }]"
          />
          <van-field
            v-model="userForm.password"
            left-icon="closed-eye"
            type="password"
            :name="t('edit.password')"
            :label="t('edit.password')"
            :placeholder="t('edit.password')"
            :rules="[{ required: true, message: t('edit.passwordMsg') }]"
          />
        </van-cell-group>
        <div style="margin: 26px 16px;">
          <van-button
            round block :loading="loginLoading" native-type="submit"
            type="primary" loading-text="登录中..."
          >
            登录
          </van-button>
          <van-checkbox v-model="savePassword" style="margin: 7px 0;" checked-color="#674188">
            记住密码
          </van-checkbox>
        </div>
      </van-form>
    </div>
  </Container>
</template>
