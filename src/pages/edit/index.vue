<script setup lang="ts">
import {storeToRefs} from "pinia";
import useUserStore from "@/stores/modules/user";

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
})


async function onSubmit() {
//   todo：修改个人信息
}
</script>

<template>
  <Container :padding-x="0">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
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
