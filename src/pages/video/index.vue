<script setup lang="ts">
import {ref} from 'vue';
import VideoPlayer from '@/components/VideoPlayer.vue'

definePage({
  name: 'video',
  meta: {
    level: 1,
  },
})

const {t} = useI18n()
const list = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

const onLoad = () => {
  setTimeout(() => {
    if (refreshing.value) {
      list.value = [];
      refreshing.value = false;
    }
    for (let i = 0; i < 10; i++) {
      list.value.push(list.value.length + 1);
    }
    loading.value = false;

    if (list.value.length >= 40) {
      finished.value = true;
    }
  }, 1000);
};

const onRefresh = () => {
  // 清空列表数据
  finished.value = false;

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true;
  onLoad();
};

let videoOption = reactive({
  autoplay: false,
  controls: true,
  sources: [
    {
      src: 'http://192.168.1.6:8080/hls/test.m3u8',
      type:'application/x-mpegURL'
    }
  ],
  width:'150px',
  height:'200px'
})

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
      v-model="value"
      shape="round"
      background="#29d"
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
          <van-grid-item v-for="item in list" :key="item" :title="item">
            <!-- todo: 1280x720 video card component -->
            <video-player  :options="videoOption"></video-player>
              </van-grid-item>
            </van-grid>
          </van-list>
        </van-pull-refresh>
    <van-back-top/>
  </Container>
</template>

