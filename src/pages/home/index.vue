<script setup lang="ts">
import { getMenuList } from '@/api/auth'

definePage({
  name: 'home',
  meta: {
    level: 1,
  },
})

const { t } = useI18n()
const menuItems = ref([])

onMounted(() => {
  initMenuList()
})

async function initMenuList() {
  const resMenu = await getMenuList('page')
  if (resMenu.success) {
    // cell 菜单Router控制
    const menuList = resMenu.data
    // 转换菜单数据
    menuItems.value = menuList.map(e => ({
      title: t(e.menuTitle),
      route: e.menuPath,
      icon: e.menuIcon,
    }))
  }
}
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
