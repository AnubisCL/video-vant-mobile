<script setup lang="ts">
import { ref } from 'vue'
import NProgress from 'nprogress'
import { showToast } from 'vant'
import { getOnlineUser, pushWsMsg, pushWsMsgAll } from '@/api/user'

definePage({
  name: 'online',
  meta: {
    level: 2,
    title: '在线管理',
    i18n: 'home.online',
  },
})

const list = ref([])
const message = ref('')

const checked = ref([])
const checkboxRefs = ref([])
function toggle(index) {
  checkboxRefs.value[index].toggle()
}

onMounted(() => {
  initData()
})
onBeforeUpdate(() => {
  checkboxRefs.value = []
})
async function initData() {
  NProgress.start()
  await renovate()
  NProgress.done()
}

const onlineCount = computed(() => {
  return checked.value.length
})

async function renovate() {
  const res = await getOnlineUser()
  if (res.success) {
    list.value = res.data
  }
}

async function sendMessage() {
  if (message.value.length < 1) {
    return
  }
  if (onlineCount.value > 0) {
    for (const item of checked.value) {
      await pushWsMsg({}, {
        userId: item.userId,
        type: 'showNotify',
        msgType: 'danger',
        message: message.value,
      })
    }
    checked.value = []
  }
  else {
    const res = await pushWsMsgAll({}, {
      type: 'showNotify',
      msgType: 'danger',
      message: message.value,
    })
    if (res.success) {
      showToast('全部发送成功')
    }
  }
}
</script>

<template>
  <Container>
    <van-cell-group inset>
      <van-field
        v-model="message"
        rows="3"
        autosize
        label="消息通知："
        type="textarea"
        maxlength="150"
        placeholder="请输入通知"
        show-word-limit
      >
        <template #button>
          <van-button size="small" type="danger" @click="sendMessage">
            {{ onlineCount > 0 ? '发送' : '全部发送' }}
          </van-button>
        </template>
      </van-field>

      <van-cell :title="`在线人数：${onlineCount}`" value="刷新" @click="renovate" />
    </van-cell-group>

    <van-checkbox-group
      v-model="checked"
    >
      <van-cell-group inset>
        <van-cell
          v-for="(item, index) in list"
          :key="index"
          clickable
          :title="item.username"
          @click="toggle(index)"
        >
          <template #right-icon>
            <van-checkbox
              :ref="el => checkboxRefs[index] = el"
              :name="item"
              @click.stop
            />
          </template>
        </van-cell>
      </van-cell-group>
    </van-checkbox-group>
  </Container>
</template>
