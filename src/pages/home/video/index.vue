<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'
import NProgress from 'nprogress'
import { getVideoList } from '@/api/video'
import router from '@/router'

definePage({
  name: 'video',
  meta: {
    level: 2,
    title: '视频',
    i18n: 'home.video',
  },
})

const { t } = useI18n()
const list = ref([])
const pageReq = reactive({
  current: 0,
  size: 10,
  sortBy: '',
  asc: false,
})
const pageRes = reactive({
  pages: 0,
  total: 0,
})
const keyword = ref('')
const loading = ref(false)

onMounted(() => {
  initPageHis()
  nextPage()
})

function initPageHis(): void {
  const hisKeyword = localStorage.getItem('vide-keyword')
  const hisPageReq = JSON.parse(localStorage.getItem('vide-pageReq'))
  const hisPageRes = JSON.parse(localStorage.getItem('vide-pageRes'))
  if (hisPageReq !== null && hisPageRes !== null && hisKeyword !== null) {
    if (hisKeyword !== keyword.value) {
      keyword.value = hisKeyword
    }
    if (pageReq.current !== hisPageReq.current) {
      pageReq.current = hisPageReq.current
      pageReq.size = hisPageReq.size
      pageReq.sortBy = hisPageReq.sortBy
      pageReq.asc = hisPageReq.asc
    }
    if (pageRes.pages !== hisPageRes.pages) {
      pageRes.pages = hisPageRes.pages
      pageRes.total = hisPageRes.total
    }
  }
}

// 搜索
function onSearch(val: any) {
  loading.value = true
  showToast(val)
  pageReq.current = 0
  nextPage()
  loading.value = false
}

// 取消搜索
function onCancel() {
  showToast(t('button.cancel'))
}

// 分页获取视频
async function nextPage() {
  NProgress.start()
  list.value = []
  const res = await getVideoList({}, {
    keyword: keyword.value,
    page: pageReq,
  })
  if (res.success) {
    const records = res.data.records
    if (records.length > 0) {
      records.forEach((item: any) => {
        list.value.push(item)
      })
      pageRes.pages = res.data.pages
      pageRes.total = res.data.total
    }
    else {
      showToast(t('video.noMore'))
    }
    localStorage.setItem('vide-keyword', keyword.value)
    localStorage.setItem('vide-pageReq', JSON.stringify(pageReq))
    localStorage.setItem('vide-pageRes', JSON.stringify(pageRes))
  }
  else {
    showToast(t('video.error'))
  }
  NProgress.done()
}
</script>

<template>
  <Container :padding-x="0" :padding-b="0">
    <van-search
      v-model="keyword"
      :disabled="loading"
      shape="round"
      background="#be99ff"
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @cancel="onCancel"
    />
    <van-grid :border="false" :column-num="2" :gutter="3">
      <van-grid-item v-for="item in list" :key="item.videoId" :text="item.title">
        <van-image
          lazy-load
          :src="item.imageUrl"
          fit="cover"
          width="9rem"
          height="7rem"
          @click="router.push({ path: '/home/video/info',
                                query: {
                                  videoId: item.videoId,
                                  title: item.title,
                                  videoUrl: item.videoUrl,
                                  imageUrl: item.imageUrl,
                                } })"
        >
          <template #loading>
            <van-loading type="spinner" size="20" />
          </template>
        </van-image>
        <van-row justify="center" style="margin-top: 10px;">
          <span>{{ item.title }}</span>
        </van-row>
      </van-grid-item>
    </van-grid>
    <van-pagination
      v-model="pageReq.current"
      style="margin: 10px 0;"
      :items-per-page="pageReq.size"
      :total-items="pageRes.total"
      :page-count="pageRes.pages"
      show-page-size="7"
      @change="nextPage"
    >
      <template #prev-text>
        <van-icon name="arrow-left" />
      </template>
      <template #next-text>
        <van-icon name="arrow" />
      </template>
      <template #page="{ text }">
        {{ text }}
      </template>
    </van-pagination>
    <van-back-top />
  </Container>
</template>
