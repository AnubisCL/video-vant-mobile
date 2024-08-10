<script setup lang="ts">
import useUserStore from "@/stores/modules/user";
definePage({
  name: 'history',
  meta: {
    level: 2,
    title: '历史记录',
    i18n: 'profile.history',
  }
})
const userStore = useUserStore();
const { t } = useI18n()

</script>

<template>
  <Container :padding-x="0">
    <!-- todo:历史观看记录 -->
    <h1>历史记录</h1>
  </Container>
</template>
