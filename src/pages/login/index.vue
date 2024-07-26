<script setup lang="ts">
import useUserStore from "@/stores/modules/user";
import { localStorage } from '@/utils/local-storage';
import { HISTORY_ACCOUNT, HISTORY_PASSWORD } from '@/stores/mutation-type'

definePage({
  name: 'login',
  meta: {
    level: 0,
  }
})

const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()

const data = reactive({
  userForm: {
    account: '',
    password: ''
  },
  loginLoading: false
})

onMounted(() =>{
  data.userForm.account = localStorage.get(HISTORY_ACCOUNT)
  data.userForm.password = localStorage.get(HISTORY_PASSWORD)
})

async function onSubmit() {
  data.loginLoading = true
  const isEmail = data.userForm.account.indexOf('@') > 0
  await userStore.signIn({
    username: isEmail ? randomUsername() : data.userForm.account,
    email: isEmail ? data.userForm.account : '',
    password: data.userForm.password
  });
  localStorage.set(HISTORY_ACCOUNT, data.userForm.account)
  localStorage.set(HISTORY_PASSWORD, data.userForm.password)
  data.loginLoading = false
  await router.push('/')
}

//生成随机用户名
function randomUsername() {
  const randomString = Math.random().toString(36).substring(2, 10);
  return `user_${randomString}`;
}

</script>

<template>
  <Container :padding-x="0">

    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="data.userForm.account"
          left-icon="contact"
          :name="t('edit.account')"
          :label="t('edit.account')"
          :placeholder="t('edit.emailOrUsername')"
          :rules="[{ required: true, message: t('edit.emailOrUsernameMsg') }]"
        />
        <van-field
          v-model="data.userForm.password"
          left-icon="closed-eye"
          type="password"
          :name="t('edit.password')"
          :label="t('edit.password')"
          :placeholder="t('edit.password')"
          :rules="[{ required: true, message: t('edit.passwordMsg') }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block :loading="data.loginLoading" native-type="submit" type="primary" loading-text="登录中..." >
          登录
        </van-button>
      </div>
    </van-form>
  </Container>
</template>

