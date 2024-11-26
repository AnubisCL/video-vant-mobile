<script setup lang="ts">
import { ref } from 'vue'
import NProgress from 'nprogress'
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

// showNotify，showToast，gameMessage
const wsColumns = [
  { text: '消息通知', value: 'showNotify' },
  { text: '轻提示', value: 'showToast' },
  { text: '弹出框', value: 'showDialog' },
  { text: 'console消息', value: 'gameMessage' },
]
const wsType = ref('showDialog')
const showWsTypePicker = ref(false)

function onWsConfirm({ selectedOptions }) {
  showWsTypePicker.value = false
  wsType.value = selectedOptions[0].value
}

// default、primary、success、warning、danger
const messageTypeColumns = [
  { text: 'default🖤', value: 'default' },
  { text: 'primary💜', value: 'primary' },
  { text: 'success💚', value: 'success' },
  { text: 'warning🧡', value: 'warning' },
  { text: 'danger❤️', value: 'danger' },
]
const messageType = ref('primary')
const showMessageTypePicker = ref(false)

function onMessageTypeConfirm({ selectedOptions }) {
  showMessageTypePicker.value = false
  messageType.value = selectedOptions[0].value
}
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

async function renovate() {
  checked.value = []
  const res = await getOnlineUser()
  if (res.success) {
    list.value = res.data
  }
}

async function sendMessage() {
  if (message.value.length < 1) {
    return
  }
  if (checked.value.length > 0) {
    for (const item of checked.value) {
      await pushWsMsg({}, {
        userId: item.userId,
        type: wsType.value,
        msgType: messageType.value,
        message: message.value,
      })
    }
    checked.value = []
  }
  else {
    await pushWsMsgAll({}, {
      type: wsType.value,
      msgType: messageType.value,
      message: message.value,
    })
  }
}
</script>

<template>
  <Container>
    <van-cell-group inset>
      <van-field
        v-model="wsType"
        is-link
        readonly
        label="类型"
        placeholder="选择类型"
        @click="showWsTypePicker = true"
      />
      <van-popup v-model:show="showWsTypePicker" round position="bottom">
        <van-picker
          :columns="wsColumns"
          @cancel="showWsTypePicker = false"
          @confirm="onWsConfirm"
        />
      </van-popup>
      <van-field
        v-model="messageType"
        is-link
        readonly
        label="消息类型"
        placeholder="选择消息类型"
        @click="showMessageTypePicker = true"
      />
      <van-popup v-model:show="showMessageTypePicker" round position="bottom">
        <van-picker
          :columns="messageTypeColumns"
          @cancel="showMessageTypePicker = false"
          @confirm="onMessageTypeConfirm"
        />
      </van-popup>
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
            {{ checked.length > 0 ? '发送' : '全部发送' }}
          </van-button>
        </template>
      </van-field>

      <van-cell :title="`在线人数：${checked.length}`" value="刷新" @click="renovate" />
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
