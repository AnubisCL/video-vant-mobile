<script setup lang="ts">
definePage({
  name: 'edit',
  meta: {
    level: 2,
    title: '个人信息修改',
    i18n: 'profile.editUserInfo',
  },
})

const { t } = useI18n() //todo：国际化
</script>

<template>
  <Container :padding-x="0">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="email"
          name="邮箱"
          label="邮箱"
          placeholder="邮箱"
          :rules="[{ required: true, message: '请填写用邮箱' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          修改
        </van-button>
      </div>
    </van-form>
  </Container>
</template>
