<script setup lang="ts">
import { ref } from 'vue'
import { getVideoList } from '@/api/video'
import router from '@/router'

definePage({
  name: 'collector',
  meta: {
    level: 2,
    title: '收藏记录',
    i18n: 'profile.collector',
  },
})

const list = ref([])

const pageReq = reactive({
  current: 1,
  size: 4,
  sortBy: '',
  asc: false,
})
const pageRes = reactive({
  pages: 0,
  total: 0,
})
const keyword = ref('')
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
async function onLoad() {
  if (refreshing.value) {
    list.value = []
    pageReq.current = 1
    pageReq.size = 4
    pageReq.sortBy = ''
    pageReq.asc = false
    refreshing.value = false
  }
  const res = await getVideoList({}, {
    keyword: keyword.value,
    page: pageReq,
    isCollect: true,
  })
  if (res.success) {
    const records = res.data.records
    if (records.length > 0) {
      records.forEach((item: any) => {
        list.value.push(item)
      })
      pageReq.current = pageReq.current + 1
      pageRes.pages = res.data.pages
      pageRes.total = res.data.total
    }
    else {
      finished.value = true
    }
  }
  loading.value = false
}

function onRefresh() {
  // 清空列表数据
  finished.value = false
  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true
  onLoad()
}
</script>

<template>
  <Container :padding-x="0">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-grid :border="false" :column-num="1" :gutter="3">
          <van-grid-item v-for="item in list" :key="item.videoId" :title="item.title">
            <van-space align="start">
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
              <van-row justify="center">
                <van-space direction="vertical" fill>
                  <span>{{ item.title }}</span>
                  <span style="margin-bottom: 0px">{{ item.date }}</span>
                </van-space>
              </van-row>
            </van-space>
          </van-grid-item>
        </van-grid>
      </van-list>
    </van-pull-refresh>
    <van-back-top />
  </Container>
</template>
