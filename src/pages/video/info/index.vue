<script setup lang="ts">
import { ref } from 'vue';
import VideoPlayer from '@/components/VideoPlayer.vue'
import { useRoute } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import type {BarrageInstance} from "vant";
import {
  collectDo,
  historyCount,
  historyDo,
  isCollect,
  isLike,
  likeCount,
  likeDo,
  removeCollect,
  removeLike
} from "@/api/video"; // 延迟加载NProgress样式

definePage({
  name: 'videoInfo',
  meta: {
    level: 2,
    title: '视频详情',
    i18n: 'video.info',
    keepAlive: true
  }
})

const route = useRoute();
const item = reactive({
  id: '',
  title: '',
  videoUrl: '',
  imageUrl: ''
})
const isReady = ref(false)
const videoOption = reactive({
  controls: true, // 是否显示控制条
  preload: 'none', //预加载
  poster: '', // 视频封面图地址
  autoplay: false, //自动播放
  fluid: true, // 自适应宽高
  language: 'zh-CN', // 设置语言
  muted: true, // 是否静音
  inactivityTimeout: false,
  sources: [],
  width:'100%',
  height:'100%'
})


onMounted( () => {
  NProgress.start()
  item.id = splitVideoId
  item.title = route.query.title
  item.videoUrl = route.query.videoUrl
  videoOption.sources = [{
    src: route.query.videoUrl,
    type:'application/x-mpegURL',
    // type: 'video/mp4'
  }]
  videoOption.poster = route.query.imageUrl
  route.meta.title = item.title
  initVideoInfo()
  historyDo(item.id)
  NProgress.done()
})

const likeNum = ref(0)
const historyNum = ref(0)
const isLikeStatus = ref(false)
const isStarStatus = ref(false)
async function initVideoInfo() {
  let count = await likeCount(item.id);
  if (count.success) {
    likeItem.badge = count.data
  }

  let his = await historyCount(item.id);
  if (his.success) {
    historyItem.badge = his.data
  }

  //获取视频点赞&收藏状态
  let resLike = await isLike(item.id)
  if (resLike.success) {
    isLikeStatus.value = resLike.data
    if (resLike.data) {
      likeItem.iconColor = 'red'
      likeItem.icon = 'like'
    }
  }
  let resCollect = await isCollect(item.id)
  if (resCollect.success) {
    isStarStatus.value = resCollect.data
    if (resCollect.data) {
      starItem.iconColor = 'yellow'
      starItem.icon = 'star'
    }
  }
}

const splitVideoId = computed(() => {
  return route.query.videoUrl.split('/')[4]
})

const defaultList = [
  { id: 100, text: '轻量' },
  { id: 101, text: '可定制的' },
  { id: 102, text: '移动端' },
  { id: 103, text: 'Vue' },
  { id: 104, text: '组件库' },
  { id: 105, text: 'VantUI' },
  { id: 106, text: '666' }
];

const list = ref([...defaultList]);
const barrage = ref<BarrageInstance>();
const isPlay = ref(false);

const add = () => {
  for (let i = 0; i < 5; i++) {
    list.value.push({ id: Math.random(), text: 'Barrage' });
  }
};

watch(isPlay, () => {
  if (isPlay.value) {
    barrage.value?.play()
  } else {
    barrage.value?.pause()
  }
});

function copyId(id: string) {
  //Ts + vue3 将Id复制到剪贴板
  navigator.clipboard.writeText(id).then(() => {
    console.log('ID copied to clipboard');
  }, (err) => {
    console.error('Failed to copy text: ', err);
  });
}

const likeItem = reactive({
  iconColor: '',
  icon: 'like-o',
  badge: 0
})
const starItem = reactive({
  iconColor: '',
  icon: 'star-o',
  badge: 0
})
const historyItem = reactive({
  iconColor: '#ee3f0a',
  icon: 'fire-o',
  badge: 0
})

const toLike = async () => {
  if (isLikeStatus.value) {
    let res = await removeLike(item.id)
    if (res.success) {
      likeItem.iconColor = ''
      likeItem.icon = 'like-o'
      isLikeStatus.value = false
      likeItem.badge = likeItem.badge - 1
    }
  } else {
    let res = await likeDo('video', item.id)
    if (res.success) {
      likeItem.iconColor = '#ee0a0a'
      likeItem.icon = 'like'
      isLikeStatus.value = true
      likeItem.badge = likeItem.badge + 1
    }
  }
}
const toStar = async () =>  {
  if (isStarStatus.value) {
    let res = await removeCollect(item.id)
    if (res.success) {
      starItem.iconColor = ''
      starItem.icon = 'star-o'
      isStarStatus.value = false
      starItem.badge = starItem.badge - 1
    }
  } else {
    let res = await collectDo(item.id)
    if (res.success) {
      starItem.iconColor = '#eed00a'
      starItem.icon = 'star'
      isStarStatus.value = true
      starItem.badge = starItem.badge + 1
    }
  }
}

</script>

<template>
  <Container :padding-x="0">
    <van-barrage ref="barrage" v-model="list" :auto-play="false" rows="5" >
      <video-player :options="videoOption"></video-player>
    </van-barrage>

    <van-row justify="center">
      <van-col style="text-align: center;" span="5">
        <van-button style="margin: 7px 0;" size="mini" round type="default" :icon="historyItem.icon" :color="historyItem.iconColor">
          <van-rolling-text :start-num="0" :target-num="historyItem.badge" />
        </van-button>
      </van-col>
      <van-col style="text-align: center;" span="5" offset="7">
        <van-button style="margin: 7px 0;" size="mini" round type="default" @click="toLike" :icon="likeItem.icon" :color="likeItem.iconColor">
          <van-rolling-text :start-num="0" :target-num="likeItem.badge" />
        </van-button>
      </van-col>
      <van-col style="text-align: center;" >
        <van-button style="margin: 7px 0;" size="mini" round type="default" @click="toStar" :icon="starItem.icon" :color="starItem.iconColor">
          <van-rolling-text :start-num="0" :target-num="starItem.badge" />
        </van-button>
      </van-col>
    </van-row>
    <van-row justify="center">
      <van-col style="margin: 5px 0;" span="20">
        <van-text-ellipsis :content="item.title" expand-text="展开" collapse-text="收起" />
      </van-col>
    </van-row>


    <van-cell-group inset style="margin-top: 4px;">
      <van-cell is-link :title="'ID: ' + item.id" @click="copyId(item.id)" />
    </van-cell-group>

    <van-cell-group inset style="margin-top: 4px;">
      <van-cell is-link title="弹幕" value="添加" :aria-disabled="isPlay" @click="add"/>
      <van-cell is-link title="弹幕" :value="isPlay ? '暂停' : '开始'" @click="isPlay = !isPlay"/>
    </van-cell-group>

  </Container>
</template>

