<script setup lang="ts">
import { languageColumns, locale } from '@/utils/i18n'
import useAppStore from "@/stores/modules/app";

definePage({
  name: 'profile',
  meta: {
    level: 1,
  },
})

const appStore = useAppStore()
const checked = ref<boolean>(isDark.value)

watch(
  () => isDark.value,
  (newMode) => {
    checked.value = newMode
  },
  { immediate: true },
)

function toggle() {
  toggleDark()
  appStore.switchMode(isDark.value ? 'dark' : 'light')
}

const { t } = useI18n()

const showLanguagePicker = ref(false)
const languageValues = ref<Array<string>>([locale.value])
const language = computed(() => languageColumns.find(l => l.value === locale.value).text)

function onLanguageConfirm(event: { selectedOptions: PickerColumn }) {
  locale.value = event.selectedOptions[0].value as string
  showLanguagePicker.value = false
}
</script>

<template>
  <Container :padding-x="0" :padding-t="16" :padding-b="100">
    <van-cell-group inset>
        <van-cell is-link :value="t('profile.edit')" to="edit">
          <!-- 使用 title 插槽来自定义标题 -->
          <template #title>
            <!-- 设置垂直 -->
            <van-space direction="vertical" fill>
              <!-- todo:头像更换 -->
              <van-image
                round
                lazy-load
                fit="cover"
                width="100"
                height="100"
                src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
              />
              <span class="custom-title">userName</span>
            </van-space>
          </template>
          <template #label>
            <span >This is description.</span>
          </template>
          <template #value>
            <van-space direction="vertical" fill>
              <!-- todo:用户Id展示，角色展示 -->
              <van-tag style="margin-top: 40px; right: 80px;" size="large" type="primary">{{ t('profile.normal') }}</van-tag>
  <!--            <van-tag type="warning">{{ t('profile.vip') }}</van-tag>-->
  <!--            <van-tag type="danger">{{ t('profile.admin') }}</van-tag>-->
            </van-space>
          </template>
          <template #right-icon>
            <van-icon name="setting-o" class="search-icon"/>
          </template>
        </van-cell>
        <van-cell center :title="t('profile.darkMode')">
          <template #right-icon>
            <VanSwitch v-model="checked" size="20px" aria-label="on/off Dark Mode" @click="toggle()" />
          </template>
        </van-cell>
        <van-cell
          is-link
          :title="t('profile.language')"
          :value="language"
          @click="showLanguagePicker = true"
        />
        <!-- todo:收藏 -->
        <van-cell is-link :title="t('profile.collector')">
          <template #right-icon>
            <van-icon name="star-o" class="search-icon"/>
          </template>
        </van-cell>
        <!-- todo:历史观看记录 -->
        <van-cell is-link :title="t('profile.history')">
          <template #right-icon>
            <van-icon name="todo-list-o" class="search-icon"/>
          </template>
        </van-cell>
        <!-- todo:登出 -->
        <van-cell is-link :title="t('profile.signOut')">
          <template #right-icon>
            <van-icon name="down" class="search-icon"/>
          </template>
        </van-cell>

      </van-cell-group>


    <van-popup v-model:show="showLanguagePicker" position="bottom">
      <van-picker
        v-model="languageValues"
        :columns="languageColumns"
        @confirm="onLanguageConfirm"
        @cancel="showLanguagePicker = false"
      />
    </van-popup>
  </Container>
</template>
<style lang="less" scoped>
.custom-title {
  margin-right: 4px;
  vertical-align: middle;
}

.search-icon {
  font-size: 16px;
  line-height: inherit;
}
</style>
