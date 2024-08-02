<script setup lang="ts">
import {ref} from 'vue';
import VideoPlayer from '@/components/VideoPlayer.vue'
import {getVideoList} from "@/api/video";
import {showToast} from "vant";

definePage({
  name: 'video',
  meta: {
    level: 1,
  },
})

const {t} = useI18n()
const list = ref([]);
const pageReq = ref({
  current: 1,
  size: 4,
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
  let res = await getVideoList({},{
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
        <van-grid :border="false" :column-num="1" :gutter="3">
          <van-grid-item v-for="item in list" :key="item.videoId" :title="item.title">
            <video-player :options="{
                  controls: true, // 是否显示控制条
                  preload: 'none', //预加载
                  poster: item.imageUrl, // 视频封面图地址
                  autoplay: false, //自动播放
                  fluid: true, // 自适应宽高
                  language: 'zh-CN', // 设置语言
                  muted: true, // 是否静音
                  inactivityTimeout: false,
                  sources: [
                    {
                      src: item.videoUrl,
                      type:'application/x-mpegURL',
                      // type: 'video/mp4'
                    }
                  ],
                  width:'100%',
                  height:'100%'
                }"></video-player>
              </van-grid-item>
            </van-grid>
          </van-list>
        </van-pull-refresh>
    <van-back-top/>
  </Container>
</template>

