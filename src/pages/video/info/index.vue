<script setup lang="ts">
import { ref } from 'vue';
import VideoPlayer from '@/components/VideoPlayer.vue'
import { useRoute } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import type {BarrageInstance} from "vant"; // 延迟加载NProgress样式

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


onMounted(() => {
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
  NProgress.done()
})

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

const likeIcon = ref()
const starIcon = ref()
const likeItem = reactive({
  iconColor: '',
  icon: 'like-o'
})
const starItem = reactive({
  iconColor: '',
  icon: 'star-o'
})

const toLike = () => {
  if (likeIcon.value.iconColor !== 'red') {
    likeItem.iconColor = 'red'
    likeItem.icon = 'like'
  } else {
    likeItem.iconColor = ''
    likeItem.icon = 'like-o'
  }

}
const toStar = () =>  {
  if (starIcon.value.iconColor !== 'yellow') {
    starItem.iconColor = 'yellow'
    starItem.icon = 'star'
  } else {
    starItem.iconColor = ''
    starItem.icon = 'star-o'
  }
}

</script>

<template>
  <Container :padding-x="0">
    <van-barrage ref="barrage" v-model="list" :auto-play="false" rows="5" >
      <video-player :options="videoOption"></video-player>
    </van-barrage>

    <van-row>
      <van-col span="20">
        <van-grid style="margin: 8px 16px" square clickable :column-num="10" icon-size="14px" >
          <van-grid-item ref="likeIcon" border="false" :icon="likeItem.icon" @click="toLike" :icon-color="likeItem.iconColor"/>
          <van-grid-item ref="starIcon" border="false" :icon="starItem.icon" @click="toStar" :icon-color="starItem.iconColor"/>
        </van-grid>
      </van-col>
      <van-col style="display: block; position: absolute; margin: 12px 0 0 80px;" span="20">{{ item.title }}</van-col>
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

