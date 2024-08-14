<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'
import NProgress from 'nprogress'
import { getVideoList } from '@/api/video'
import router from '@/router'

definePage({
  name: 'video',
  meta: {
    level: 1,
    keepAlive: true,
  },
})

const { t } = useI18n()
const list = ref([])
const pageReq = reactive({
  current: 0,
  size: 8,
  sortBy: '',
  asc: false,
})
const pageRes = reactive({
  pages: 0,
  total: 0,
})
const keyword = ref('')
const loading = ref(false)
const searchBgColor = ref('rgba(60,99,157,0.94)')

onMounted(() => {
  nextPage()
})

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
  }
  else {
    showToast(t('video.error'))
  }
  NProgress.done()
}

/*
const finished = ref(false);
const refreshing = ref(false);
async function onLoad() {
  if (refreshing.value) {
    list.value = [];
    pageReq.current = 1
    pageReq.size = 4
    pageReq.sortBy = ""
    pageReq.asc = false
    refreshing.value = false;
  }
  let res = await getVideoList({}, {
    keyword: keyword.value,
    page: pageReq.value
  })
  if (res.success) {
    const records = res.data.records
    if (records.length > 0) {
      records.forEach((item: any) => {
        list.value.push(item);
      });
      pageReq.current = pageReq.current + 1
      pageRes.pages = res.data.pages
      pageRes.total = res.data.total
    } else {
      finished.value = true;
    }
  }
  loading.value = false;
}

const onRefresh = () => {
  // 清空列表数据
  finished.value = false;

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true;
  onLoad();
}; */
</script>

<template>
  <Container :padding-x="0" :padding-t="0" :padding-b="100">
    <!-- todo: 搜索bug，结果需要刷新才显示  -->
    <van-search
      v-model="keyword"
      :disabled="loading"
      shape="round"
      :background="searchBgColor"
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @cancel="onCancel"
    />
    <van-grid :border="false" :column-num="2" :gutter="3">
      <van-grid-item v-for="item in list" :key="item.videoId" :title="item.title">
        <van-image
          lazy-load
          :src="item.imageUrl"
          fit="cover"
          width="100%"
          height="100%"
          @click="router.push({ path: '/video/info',
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
      </van-grid-item>
    </van-grid>
    <van-pagination
      v-model="pageReq.current"
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
    <!--    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-grid :border="false" :column-num="2" :gutter="3">
              <van-grid-item v-for="item in list" :key="item.videoId" :title="item.title">
                <van-image lazy-load
                           @click="router.push({path: '/video/info', query: {
                             videoId: item.videoId,
                             title: item.title,
                             videoUrl: item.videoUrl,
                             imageUrl: item.imageUrl
                           }})"
                           :src="item.imageUrl"
                           fit="cover"
                           width="100%"
                           height="100%">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </van-grid-item>
            </van-grid>
          </van-list>
        </van-pull-refresh> -->
    <van-back-top />
  </Container>
</template>
