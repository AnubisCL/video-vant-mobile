<script setup lang="ts">
import { languageColumns, locale } from '@/utils/i18n'
import useAppStore from "@/stores/modules/app";
import useUserStore from "@/stores/modules/user";
import {getAvatar} from "@/api/user";

definePage({
  name: 'profile',
  meta: {
    level: 1,
  },
})

const appStore = useAppStore()
const userStore = useUserStore()
const checked = ref<boolean>(isDark.value)
const { t } = useI18n()
const router = useRouter()
const showLanguagePicker = ref(false)
const languageValues = ref<Array<string>>([locale.value])
const language = computed(() => languageColumns.find(l => l.value === locale.value).text)

const data = reactive({
  user: {
    username: '',
    email: '',
    roleId: 0
  }
})

onMounted( () => {
  data.user.username = userStore.user.username
  data.user.email = userStore.user.email
  data.user.roleId = userStore.user.roleId
  getAvatarBase64()
})
// 用户头像
const avatar = ref('')
async function getAvatarBase64() {
  const res = await getAvatar()
  if (res.success) {
    avatar.value = res.data
  }
}
// 暗黑模式
watch(() => isDark.value,
  (newMode) => {
    checked.value = newMode
  },
  { immediate: true },
)
function toggle() {
  toggleDark()
  appStore.switchMode(isDark.value ? 'dark' : 'light')
}
//国际化
function onLanguageConfirm(event: { selectedOptions: PickerColumn }) {
  locale.value = event.selectedOptions[0].value as string
  showLanguagePicker.value = false
}
//退出登录
async function signOut() {
  await userStore.signOut()
  await router.replace('/login')
}
</script>

<template>
  <Container :padding-x="0" :padding-t="16" :padding-b="100">
    <van-cell-group inset>
        <van-cell :value="t('profile.edit')">
          <template #title>
            <!-- 设置垂直 -->
            <van-space direction="vertical" fill>
              <van-image
                round
                lazy-load
                fit="cover"
                width="100"
                height="100"
                :src="avatar"
              />
              <span class="custom-title">{{ data.user.username }}</span>
            </van-space>
          </template>
          <template #label>
            <span >{{ data.user.email }}</span>
          </template>
          <template #value>
            <van-space direction="vertical" fill>
              <van-tag v-if="data.user.roleId == 1" style="margin-top: 40px; right: 80px;" size="large" type="danger">{{ t('profile.admin') }}</van-tag>
              <van-tag v-if="data.user.roleId == 2 || data.user.roleId == 4" style="margin-top: 40px; right: 80px;" size="large" type="primary">{{ t('profile.normal') }}</van-tag>
              <van-tag v-if="data.user.roleId == 3" style="margin-top: 40px; right: 80px;" size="large" type="warning">{{ t('profile.vip') }}</van-tag>
            </van-space>
          </template>
          <template #right-icon>
            <van-icon @click="router.push('/profile/edit')" name="setting-o" class="search-icon"/>
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
        <van-cell is-link :title="t('profile.collector')" @click="router.push('/profile/star')">
          <template #right-icon>
            <van-icon name="star-o" class="search-icon"/>
          </template>
        </van-cell>
        <!-- todo:历史观看记录 -->
        <van-cell is-link :title="t('profile.history')" @click="router.push('/profile/history')">
          <template #right-icon>
            <van-icon name="browsing-history-o" class="search-icon"/>
          </template>
        </van-cell>
        <van-cell is-link :title="t('profile.signOut')" @click="signOut">
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
