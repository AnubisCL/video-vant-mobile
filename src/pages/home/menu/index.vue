<script setup lang="ts">
import { showToast } from 'vant'
import { ref } from 'vue'
import { getProductCategory, getProductList } from '@/api/product'

definePage({
  name: 'menu',
  meta: {
    level: 2,
    title: '菜单',
    i18n: 'home.menu',
  },
})
// const { t } = useI18n()
const collType = ref(['1'])
const showCartBottom = ref(false)
const showCardBottom = ref(false)
const showOrderBottom = ref(false)
const showEchartBottom = ref(false)
// const checkedAllCart = ref(false);
const activeSidebar = ref(0)
const cartSize = ref(0)

// need init data
const sidebarItem: any = ref([])
const indexList: any = ref([])
const indexItemList = ref([])
const cardPropsDetail = reactive({ title: '' })

onMounted(() => {
  initMenuInfo()
})

async function initMenuInfo() {
  const pcRes = await getProductCategory()
  if (pcRes.success) {
    sidebarItem.value = pcRes.data.map((item) => {
      return {
        id: item.categoryId,
        title: item.categoryName,
        badge: 0,
        isDisable: false,
      }
    })
    indexList.value = sidebarItem.value.map(e => e.title)
  }

  const menuRes = await getProductList()
  if (menuRes.success) {
    indexItemList.value = menuRes.data
  }
}

// InstanceType<typeof import('vant').IndexBar>：这部分是用来获取 van-index-bar 组件实例的类型。
// typeof import('vant').IndexBar：导入 van-index-bar 组件的类型。
// InstanceType：这是一个 TypeScript 的工具类型，用于从类或构造函数类型中提取实例类型。
const indexBar = ref<InstanceType<typeof import('vant').IndexBar> | null>(null)

function sidebarChange(index: number) {
  if (indexBar.value) {
    // 定位到List的索引
    indexBar.value.scrollTo(sidebarItem.value[index].title)
  }
}

function indexAnchorChange(index: number) {
  // 定位到左侧边栏的索引
  activeSidebar.value = indexList.value.indexOf(`${index}`)
}

function addCart(idx1: number, idx2: number) {
  const stock = indexItemList.value[idx1].cardList[idx2].stock
  if (stock === 0) {
    showToast('添加到购物车成功')
    cartSize.value++
    sidebarItem.value[idx1].badge++
    indexItemList.value[idx1].cardList[idx2].stock++
    indexItemList.value[idx1].cardList[idx2].tag = '已选择'
  }
  else {
    showToast('请勿重复添加')
  }
}

function subCart(idx1: number, idx2: number) {
  const stock = indexItemList.value[idx1].cardList[idx2].stock
  if (stock === 1) {
    cartSize.value--
    sidebarItem.value[idx1].badge--
    indexItemList.value[idx1].cardList[idx2].stock--
    indexItemList.value[idx1].cardList[idx2].tag = ''
  }
  else {
    showToast('请勿重复删除')
  }
}

function showCardDetail(idx1: number, idx2: number) {
  // todo 显示商品详情
  showCardBottom.value = true
  cardPropsDetail.title = indexItemList.value[idx1].cardList[idx2].title
}

function onSubmitCart() {

  // todo 下单
}
</script>

<template>
  <Container :padding-x="0" :padding-b="100">
    <van-row>
      <van-col span="4">
        <van-sticky :offset-top="46">
          <van-sidebar v-model="activeSidebar" @change="sidebarChange">
            <van-sidebar-item
              v-for="(item, index) in sidebarItem" :key="index" :title="item.title" :dot="item.badge > 0"
              :disabled="item.isDisable"
            />
          </van-sidebar>
        </van-sticky>
      </van-col>
      <van-col span="18" offset="2">
        <van-index-bar
          ref="indexBar" z-index="-1" :sticky-offset-top="46" :index-list="indexList"
          @change="indexAnchorChange"
        >
          <div v-for="(item, idx1) in indexItemList" :key="idx1">
            <van-index-anchor :index="item.index" />
            <van-card
              v-for="(card, idx2) in item.cardList" :key="idx2"
              :num="card.stock"
              :tag="card.tag"
              :price="card.price / 100"
              :desc="card.description"
              :title="card.title"
              :thumb="card.thumb"
              @click-thumb="showCardDetail(idx1, idx2)"
            >
              <template #tags>
                <!--                <van-tag style="margin: 0 3px;" color="#7232dd" v-for="tag in card.tags" plain :type="tag.type">{{ tag.text }}</van-tag> -->
                <van-rate v-model="card.rate" readonly allow-half />
              </template>
              <template #footer>
                <van-button
                  color="#7232dd" type="primary" size="mini" round plain icon="plus"
                  @click="addCart(idx1, idx2)"
                />
                <van-button
                  color="#7232dd" type="primary" size="mini" round plain icon="minus"
                  @click="subCart(idx1, idx2)"
                />
              </template>
            </van-card>
          </div>
        </van-index-bar>
      </van-col>
    </van-row>
    <!-- 底部按钮 -->
    <van-action-bar>
      <van-action-bar-icon
        icon="cart-o" text="购物车" style="margin-right: 70px; padding-left: 10px;" :badge="cartSize"
        @click="showCartBottom = true"
      />
      <van-action-bar-button color="#7232dd" type="warning" text="查看订单" @click="showOrderBottom = true" />
      <van-action-bar-button color="#8F6EBA" type="warning" text="统计信息" @click="showEchartBottom = true" />
      <van-action-bar-button color="#be99ff" type="danger" text="立即下单" @click="showCartBottom = true" />
    </van-action-bar>
    <!-- 购物车 -->
    <van-popup
      v-model:show="showCartBottom"
      round
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '93%' }"
    >
      <!--      <van-steps :active="cartSize === 0 ? 0 : 1"> -->
      <!--        <van-step>选择菜品</van-step> -->
      <!--        <van-step>提交订单</van-step> -->
      <!--        <van-step>制作订单</van-step> -->
      <!--        <van-step>完成订单</van-step> -->
      <!--      </van-steps> -->
      <van-swipe-cell>
        <div v-for="(item, idx1) in indexItemList" :key="idx1">
          <div v-for="(card, idx2) in item.cardList" :key="idx2">
            <van-card
              v-if="card.stock !== 0"
              class="goods-card"
              :num="card.stock"
              :price="card.price"
              :desc="card.description"
              :title="card.title"
              :thumb="card.thumb"
            />
          </div>
        </div>
      </van-swipe-cell>
      <van-submit-bar :price="0" button-text="提交订单" :disabled="cartSize === 0" @submit="onSubmitCart">
        <!--        <van-checkbox v-model="checkedAllCart">全选</van-checkbox> -->
      </van-submit-bar>
    </van-popup>
    <!-- 右侧弹出 -->
    <van-popup
      v-model:show="showOrderBottom"
      position="right"
      round
      closeable
      close-icon-position="bottom-left"
      :style="{ width: '100%', height: '100%' }"
    >
      <van-collapse v-model="collType">
        <van-collapse-item title="标题1" name="1">
          代码是写出来给人看的，附带能在机器上运行。
        </van-collapse-item>
        <van-collapse-item title="标题2" name="2">
          技术无非就是那些开发它的人的共同灵魂。
        </van-collapse-item>
        <van-collapse-item title="标题3" name="3">
          在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。
        </van-collapse-item>
      </van-collapse>
    </van-popup>

    <van-popup
      v-model:show="showEchartBottom"
      position="left"
      round
      closeable
      close-icon-position="bottom-left"
      :style="{ width: '100%', height: '100%' }"
    />
    <!--  商品详情  -->
    <van-popup
      v-model:show="showCardBottom"
      position="top"
      round
      closeable
      close-icon-position="bottom-left"
      :style="{ width: '100%', height: '95%' }"
    >
      <h3>商品详情 {{ cardPropsDetail.title }}</h3>
    </van-popup>
  </Container>
</template>

<style scoped lang="less">

</style>
