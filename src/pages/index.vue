<script setup lang="ts">

definePage({
  name: 'home',
  meta: {
    level: 1,
  },
})

const { t } = useI18n()

const menuItems = computed(() => ([
  { title: t('home.mockGuide'), route: 'mock' },
  { title: t('home.echartsDemo'), route: 'charts' },
  { title: t('home.unocssExample'), route: 'unocss' },
  { title: t('home.persistPiniaState'), route: 'counter' },
  { title: t('home.404Demo'), route: 'unknown' },
  { title: t('home.keepAlive'), route: 'keepalive' },
]))
</script>

<template>
  <Container :padding-x="0">
    <VanCellGroup inset>
      <template v-for="item in menuItems" :key="item.route">
        <VanCell :title="item.title" :to="item.route" is-link />
      </template>
    </VanCellGroup>
  </Container>
</template>
