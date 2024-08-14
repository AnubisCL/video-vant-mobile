<script setup lang="ts">
import { showToast } from 'vant'
import useUserStore from '@/stores/modules/user'
import { getAvatar, updateUserInfo, uploadAvatar } from '@/api/user'
import enums from '@/utils/enums'

definePage({
  name: 'edit',
  meta: {
    level: 2,
    title: '个人信息修改',
    i18n: 'profile.editUserInfo',
  },
})

const userStore = useUserStore()
const { t } = useI18n()

const editForm = reactive({
  username: '',
  email: '',
  password: '',
})
// 用户头像
const avatar = ref('')
const avatarLoad = ref(false)

onMounted(() => {
  editForm.username = userStore.user.username
  editForm.email = userStore.user.email
  getAvatarBase64()
})

// 获取头像
async function getAvatarBase64() {
  avatarLoad.value = true
  const res = await getAvatar()
  if (res.success) {
    avatar.value = res.data
  }
  avatarLoad.value = false
}

// 上传完成
async function afterRead(file: any) {
  const formData = new FormData()
  formData.append('file', file.file)
  // 此时可以自行将文件上传至服务器
  const res = await uploadAvatar({}, formData)
  if (res.success) {
    await getAvatarBase64()
    showToast(t('button.uploadSuc'))
  }
  else {
    showToast(t('button.uploadErr'))
  }
}

// 提交
async function onSubmit() {
  const res = await updateUserInfo({}, {
    username: editForm.username,
    email: editForm.email,
    password: editForm.password,
    signType: enums.LOGIN_STATUS.LOGIN_IN,
  })
  if (res.success) {
    showToast(t('button.editSuc'))
  }
  else {
    showToast(t('button.editErr'))
  }
}

// const beforeRead = (file) => {
//   debugger
//   if (file.type !== 'image/jpeg') {
//     showToast('请上传 jpg 格式图片');
//     return false;
//   }
//   return true;
// };
</script>

<template>
  <Container :padding-x="0">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field name="uploader" :label="t('edit.avatar')">
          <template #input>
            <van-uploader :after-read="afterRead">
              <van-image
                round
                lazy-load
                :show-loading="avatarLoad"
                fit="cover"
                width="100"
                height="100"
                :src="avatar"
              >
                <template #loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </van-uploader>
          </template>
        </van-field>
        <van-field
          v-model="editForm.username"
          :name="t('edit.username')"
          :label="t('edit.username')"
          :placeholder="t('edit.username')"
          :rules="[{ required: true, message: t('edit.usernameMsg') }]"
        />
        <van-field
          v-model="editForm.email"
          :name="t('edit.email')"
          :label="t('edit.email')"
          :placeholder="t('edit.email')"
          :rules="[{ required: true, message: t('edit.emailMsg') }]"
        />
        <van-field
          v-model="editForm.password"
          type="password"
          :name="t('edit.password')"
          :label="t('edit.password')"
          :placeholder="t('edit.password')"
          :rules="[{ required: true, message: t('edit.passwordMsg') }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          {{ t('button.edit') }}
        </van-button>
      </div>
    </van-form>
  </Container>
</template>
