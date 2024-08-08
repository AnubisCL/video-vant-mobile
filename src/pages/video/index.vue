<script setup lang="ts">
import {ref} from 'vue';
import {getVideoList} from "@/api/video";
import {showToast} from "vant";
import router from "@/router";

definePage({
  name: 'video',
  meta: {
    level: 1,
    keepAlive: true
  },
})

const {t} = useI18n()
const list = ref([]);
const pageReq = ref({
  current: 1,
  size: 8,
  sortBy: "",
  asc: false
});
const pageRes = ref({
  pages: 0,
  total: 0
});
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const keyword = ref("");

const onSearch = (val) => {
  showToast(val)
  onRefresh()
};
const onCancel = () => {
  showToast('取消')
};

async function onLoad() {
  if (refreshing.value) {
    list.value = [];
    pageReq.value = {
      current: 1,
      size: 4,
      sortBy: "",
      asc: false
    }
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
      pageReq.value.current = pageReq.value.current + 1
      pageRes.value.pages = res.data.pages
      pageRes.value.total = res.data.total
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
};

function setup() {
  return {
    list,
    onLoad,
    loading,
    finished,
    onRefresh,
    refreshing,
  };
}
</script>

<template>
  <Container :padding-x="0" :padding-t="0" :padding-b="100">
    <van-search
      v-model="keyword"
      @search="onSearch"
      @cancel="onCancel"
      :disabled="loading"
      shape="round"
      :background='"#3c9d8b"'
      placeholder="请输入搜索关键词"
    />
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
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
    </van-pull-refresh>
    <van-back-top/>
  </Container>
</template>

