<script setup lang="ts">
import useUserStore from "@/stores/modules/user";
import {showToast} from "vant";
import {getAvatar, uploadAvatar} from "@/api/user";

definePage({
  name: 'edit',
  meta: {
    level: 2,
    title: '个人信息修改',
    i18n: 'profile.editUserInfo',
  }
})

const userStore = useUserStore();
const { t } = useI18n()

const data = reactive({
  editForm: {
    username: '',
    email: '',
    password: '',
  }
})

onMounted( () => {
  data.editForm.username = userStore.user.username
  data.editForm.email = userStore.user.email
  getAvatarBase64()
})

// 用户头像
const avatar = ref('')
const avatarLoad = ref(false)
async function getAvatarBase64() {
  avatarLoad.value = true
  const res = await getAvatar()
  if (res.success) {
    avatar.value = res.data
  }
  avatarLoad.value = false
}
//上传完成
const afterRead = async (file) => {
  const formData = new FormData();
  formData.append('file', file.file);
  // 此时可以自行将文件上传至服务器
  const res = await uploadAvatar({}, formData)
  if (res.success) {
    await getAvatarBase64()
    showToast('上传成功');
  } else {
    showToast('上传失败');
  }
};

// const beforeRead = (file) => {
//   debugger
//   if (file.type !== 'image/jpeg') {
//     showToast('请上传 jpg 格式图片');
//     return false;
//   }
//   return true;
// };


async function onSubmit() {
  // todo：修改个人信息
}
</script>

<template>
  <Container :padding-x="0">
    <van-form @submit="">
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
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </van-uploader>
          </template>
        </van-field>
        <van-field
          v-model="data.editForm.username"
          :name="t('edit.username')"
          :label="t('edit.username')"
          :placeholder="t('edit.username')"
          :rules="[{ required: true, message: t('edit.usernameMsg') }]"
        />
        <van-field
          v-model="data.editForm.email"
          :name="t('edit.email')"
          :label="t('edit.email')"
          :placeholder="t('edit.email')"
          :rules="[{ required: true, message: t('edit.emailMsg') }]"
        />
        <van-field
          v-model="data.editForm.password"
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
