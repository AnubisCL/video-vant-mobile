<script setup lang="ts">
import useUserStore from "@/stores/modules/user";
definePage({
  name: 'collector',
  meta: {
    level: 2,
    title: '收藏记录',
    i18n: 'profile.collector',
  }
})
const userStore = useUserStore();
const { t } = useI18n()

</script>

<template>
  <Container :padding-x="0">
    <!-- todo:收藏 -->
    <h1>收藏记录</h1>
  </Container>
</template>
