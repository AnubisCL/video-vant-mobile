<script setup lang="ts">
import { showToast } from 'vant'
import { ref } from 'vue'
import { createProductInfo, getProductCategory, getProductDetail, getProductList, updateProductInfo } from '@/api/product'
import {
  backOrderInfo,
  cancelOrderInfo,
  clearCartHisInfo,
  confirm,
  doneOrderInfo,
  getCartHisInfo,
  getOrderDetailInfo,
  orderItem,
} from '@/api/order'
import useUserStore from '@/stores/modules/user'
import { getNextDay, getToday } from '@/utils/timeUtil'
import { uploadFile } from '@/api/video'

definePage({
  name: 'menu',
  meta: {
    level: 2,
    title: '菜单',
    i18n: 'home.menu',
  },
})
// todo 国际化 const { t } = useI18n()
const userStore = useUserStore()
const route = useRoute()

// 菜单页面
const leftSidebarItem = ref([])
const activeLeftSidebarIndex = ref(0)
const indexBarList = ref([])
const productIdItemList = ref([])
const cartIconSize = ref(0)
const confirmOrderInfo = reactive({
  orderId: 0,
  orderType: '',
  orderDate: '',
  orderRemark: '',
}) // 当前页面订单Id
// InstanceType<typeof import('vant').IndexBar>：这部分是用来获取 van-index-bar 组件实例的类型。
// typeof import('vant').IndexBar：导入 van-index-bar 组件的类型。
// InstanceType：这是一个 TypeScript 的工具类型，用于从类或构造函数类型中提取实例类型。
const indexBar = ref<InstanceType<typeof import('vant').IndexBar> | null>(null)
// 历史订单详情
const hisOrderCollType = ref([])
const showHisOrderBottom = ref(false)
const hisOrderDetailInfoList = ref([])
const hisOrderStateMap: Map<string, any> = new Map()
hisOrderStateMap.set('WAITING_CONFIRM', { id: 0, tag: '选择菜品', type: 'primary' })
hisOrderStateMap.set('WAITING_COMPLETED', { id: 1, tag: '制作订单', type: 'success' })
hisOrderStateMap.set('COMPLETED', { id: 2, tag: '完成订单', type: 'danger' })
hisOrderStateMap.set('FAILED', { id: 3, tag: '取消订单', type: 'warning' })
// 统计信息
const showEChartBottom = ref(false)
// 购物车
const showConfirmOrderCenterBottom = ref(false)
const showCartBottom = ref(false)
const cartItemList = ref([])
const cartTotalPrice = computed(() => {
  return cartItemList.value.reduce((acc, cur) => acc + cur.price * cur.stock, 0)
})
// 商品详情
const showProductCardBottom = ref(false)
const showAddProductBottom = ref(false)
const showProductForm = computed(() => {
  return showProductCardBottom.value || showAddProductBottom.value
})
const showProductStatusPicker = ref(false)
const categoryColumns = ref([])
const productCardCategory = ref('')
const productCardDetail = ref({
  product: {
    title: '',
    price: 100,
    thumb: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
    tempThumb: '',
    description: '',
    rate: 0,
  },
  productDetail: {},
})
const uploadFileUrl = ref([])

/** --- 菜单页面 start --- */
function leftSidebarChange(index: number) {
  if (indexBar.value) {
    // 定位到List的索引
    indexBar.value.scrollTo(leftSidebarItem.value[index].title)
  }
}

function indexBarChange(index: number) {
  // 定位到左侧边栏的索引
  activeLeftSidebarIndex.value = indexBarList.value.indexOf(`${index}`)
}

// 左侧边栏 标识 菜单列表 标识
function updateIndexBarBadgeAndProductIdItemTag() {
  // 创建一个 Map 来存储产品 ID 和对应的库存
  const productMap: Map<number, any> = new Map()
  cartItemList.value.forEach((item) => {
    leftSidebarItem.value.find(sidber => sidber.id === item.categoryId).badge = item.stock
    // 遍历 cartItemList 并填充 productMap
    productMap.set(item.productId, item.stock)
  })
  // 遍历 productIdItemList 并更新 cardList
  productIdItemList.value.forEach((item) => {
    item.cardList.forEach((card) => {
      // 检查 productMap 是否包含指定的 key
      if (productMap.has(card.productId)) {
        card.stock = productMap.get(card.productId)
        card.tag = '已选择'
      }
    })
  })
}
// 显示商品详情
async function showProductCardDetail(idx1: number, idx2: any) {
  // 显示商品详情
  const product = productIdItemList.value[idx1].cardList[idx2]
  const productDetailRes = await getProductDetail(product.productDetailId)
  if (productDetailRes.success) {
    showProductCardBottom.value = true
    productCardDetail.value = {
      product,
      productDetail: productDetailRes.data,
    }
    uploadFileUrl.value = [{ url: product.thumb }]
    categoryColumns.value.forEach((colum) => {
      if (colum.value === product.categoryId) {
        productCardCategory.value = colum.text
      }
    })
  }
}
async function createProductCardDetail() {
  showAddProductBottom.value = true
  productCardDetail.value = {
    product: {
      title: '',
      price: 1,
      thumb: '',
      tempThumb: '',
      description: '',
      rate: 0,
    },
    productDetail: {},
  }
  uploadFileUrl.value = []
}
async function closeProductForm() {
  showProductCardBottom.value = false
  showAddProductBottom.value = false
}
/** --- 菜单页面 end --- */

/** --- 购物车 start --- */
async function updateCartInfo() {
  const cartRes = await getCartHisInfo(userStore.user.userId)
  if (cartRes.success) {
    cartItemList.value = cartRes.data.cartItemList
    confirmOrderInfo.orderId = cartRes.data.currentOrderId
    // 左侧边栏 标识 菜单列表 标识 购物车badge
    updateIndexBarBadgeAndProductIdItemTag()
    cartIconSize.value = cartItemList.value.length
  }
}

async function clearCart() {
  const res = await clearCartHisInfo(userStore.user.userId)
  if (res.success) {
    await initMenuInfo()
    showCartBottom.value = false
  }
}

async function addCart(idx1: number, idx2: any) {
  const product = productIdItemList.value[idx1].cardList[idx2]
  const productId = product.productId
  const res = await orderItem({
    type: 'add',
    productId,
    userId: userStore.user.userId,
    orderId: confirmOrderInfo.orderId,
  })
  if (res.success) {
    showToast('添加到购物车成功')
    leftSidebarItem.value[idx1].badge++
    productIdItemList.value[idx1].cardList[idx2].stock++
    productIdItemList.value[idx1].cardList[idx2].tag = '已选择'
    await updateCartInfo()
  }
  else {
    showToast('请勿重复添加')
  }
}

async function subCart(idx1: number, idx2: any) {
  const product = productIdItemList.value[idx1].cardList[idx2]
  const productId = product.productId
  const res = await orderItem({
    type: 'sub',
    productId,
    userId: userStore.user.userId,
    orderId: confirmOrderInfo.orderId,
  })
  if (res.success) {
    leftSidebarItem.value[idx1].badge--
    const stock = productIdItemList.value[idx1].cardList[idx2].stock
    if (stock !== 0) {
      productIdItemList.value[idx1].cardList[idx2].stock--
    }
    productIdItemList.value[idx1].cardList[idx2].tag = ''
    await updateCartInfo()
  }
  else {
    showToast('请勿重复删除')
  }
}

async function onSubmitCart() {
  showConfirmOrderCenterBottom.value = true
}

async function onSubmitOrder() {
  const res = await confirm({}, confirmOrderInfo)
  if (res.success) {
    showToast(`订单号：${res.data.orderId}，下单成功`)
    await initMenuInfo()
    showConfirmOrderCenterBottom.value = false
  }
}
/** --- 购物车 end --- */

/** --- 商品详情 start --- */
function onConfirmCategory({ selectedOptions }) {
  productCardCategory.value = selectedOptions[0]?.text
  productCardDetail.value.product.categoryId = selectedOptions[0]?.value
  showProductStatusPicker.value = false
}

async function onUpdateProductDetail() {
  const product = productCardDetail.value.product
  product.thumb = productCardDetail.value.product.tempThumb
  const res = await updateProductInfo({}, product)
  if (res.success) {
    showToast('商品信息更新成功')
  }
  await initMenuInfo()
  showProductCardBottom.value = false
  showAddProductBottom.value = false
}

async function onCreateProductDetail() {
  const product = productCardDetail.value.product
  product.thumb = productCardDetail.value.product.tempThumb
  const res = await createProductInfo({}, product)
  if (res.success) {
    showToast('商品信息新增成功')
  }
  await initMenuInfo()
  showProductCardBottom.value = false
  showAddProductBottom.value = false
}

// 上传菜品图片
// 上传完成
async function afterRead(file: any) {
  const formData = new FormData()
  formData.append('file', file.file)
  // 此时可以自行将文件上传至服务器
  const res = await uploadFile({}, formData)
  if (res.success) {
    productCardDetail.value.product.thumb = res.data.replaceFileUrl
    productCardDetail.value.product.tempThumb = res.data.fileUrl
    uploadFileUrl.value = [{ url: res.data.replaceFileUrl }]
    showToast('上传成功')
  }
  else {
    showToast('上传失败')
  }
}
/** --- 商品详情 end --- */

/** --- 历史订单详情 start --- */
async function getHisOrderDetailInfoList() {
  const orderDetailRes = await getOrderDetailInfo(userStore.user.userId)
  if (orderDetailRes.success) {
    hisOrderDetailInfoList.value = orderDetailRes.data
    hisOrderCollType.value = []
    for (let i: number = 0; i < hisOrderDetailInfoList.value.length; i++) {
      if (hisOrderDetailInfoList.value[i].orderInfo.orderStatus === 'WAITING_COMPLETED') {
        hisOrderCollType.value.push(String(i + 1))
        break
      }
    }
  }
}
async function doneOrder(index: number) {
  const promise = await doneOrderInfo(hisOrderDetailInfoList.value[index].orderInfo.orderId)
  if (promise.success) {
    showToast('订单已完成')
    await getHisOrderDetailInfoList()
  }
}
async function cancelOrder(index: number) {
  const promise = await cancelOrderInfo(hisOrderDetailInfoList.value[index].orderInfo.orderId)
  if (promise.success) {
    showToast('订单已取消')
    await getHisOrderDetailInfoList()
  }
}
async function backOrder(index: number) {
  const promise = await backOrderInfo(hisOrderDetailInfoList.value[index].orderInfo.orderId)
  if (promise.success) {
    showToast('订单已回退')
    await initMenuInfo()
  }
}
/** --- 历史订单详情 end --- */

/** --- 统计信息 start --- */

/** --- 统计信息 end --- */
// 初始化页面
onMounted(() => {
  initMenuInfo()
  if (route.hash === '#order') {
    showHisOrderBottom.value = true
  }
})
async function initMenuInfo() {
  // 菜单分类
  const pcRes = await getProductCategory()
  if (pcRes.success) {
    leftSidebarItem.value = pcRes.data.map((item) => {
      return {
        id: item.categoryId,
        title: item.categoryName,
        badge: 0,
        isDisable: false,
      }
    })
    categoryColumns.value = leftSidebarItem.value.map((e) => {
      return {
        text: e.title,
        value: e.id,
      }
    })
    indexBarList.value = leftSidebarItem.value.map(e => e.title)
  }
  // 菜单列表
  const menuRes = await getProductList()
  if (menuRes.success) {
    productIdItemList.value = menuRes.data
  }
  // 获取上次选择的购物车信息
  await updateCartInfo()
  // 获取之前的订单信息
  await getHisOrderDetailInfoList()
  // todo 获取统计信息
}
</script>

<template>
  <Container :padding-x="0" :padding-b="100">
    <van-row>
      <van-col span="4">
        <van-sticky :offset-top="46">
          <van-sidebar v-model="activeLeftSidebarIndex" @change="leftSidebarChange">
            <van-sidebar-item
              v-for="(item, index) in leftSidebarItem" :key="index" :title="item.title" :dot="item.badge > 0"
              :disabled="item.isDisable"
            />
          </van-sidebar>
        </van-sticky>
      </van-col>
      <van-col span="18" offset="2">
        <van-index-bar
          ref="indexBar" z-index="-1" :sticky-offset-top="46" :index-list="indexBarList"
          @change="indexBarChange"
        >
          <div v-for="(item, idx1) in productIdItemList" :key="idx1">
            <van-index-anchor :index="item.index" />
            <van-card
              v-for="(card, idx2) in item.cardList" :key="idx2"
              :num="card.stock"
              :tag="card.tag"
              :price="card.price / 100"
              :desc="card.description"
              :title="card.title"
              :thumb="card.thumb"
              @click-thumb="showProductCardDetail(idx1, idx2)"
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
        icon="cart-o" text="购物车" style="margin-right: 10px; padding-left: 10px;" :badge="cartIconSize"
        @click="showCartBottom = true"
      />
      <van-action-bar-icon
        icon="new-o" text="新增菜品" style="margin-right: 10px; padding-left: 10px;" @click="createProductCardDetail"
      />
      <van-action-bar-button color="#7232dd" type="warning" text="查看订单" @click="showHisOrderBottom = true" />
      <!--      <van-action-bar-button color="#8F6EBA" type="warning" text="统计信息" @click="showEChartBottom = true" /> -->
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
      <van-swipe-cell>
        <div v-for="(card, idx1) in cartItemList" :key="idx1">
          <van-card
            v-if="card.stock !== 0"
            :centered="true"
            :num="card.stock"
            :price="card.price / 100"
            :desc="card.description"
            :title="card.title"
            :thumb="card.thumb"
          />
        </div>
      </van-swipe-cell>
      <van-submit-bar :price="cartTotalPrice" button-text="提交订单" :disabled="cartIconSize === 0" @submit="onSubmitCart">
        <van-button size="mini" type="danger" text="清空购物车" @click="clearCart" />
      </van-submit-bar>
    </van-popup>
    <!-- 圆角弹窗（居中） -->
    <van-popup v-model:show="showConfirmOrderCenterBottom" closeable close-icon="close" round :style="{ padding: '20px' }">
      <van-form @submit="onSubmitOrder">
        <van-cell-group inset>
          <van-field
            v-model="confirmOrderInfo.orderDate"
            name="订单日期"
            label="订单日期"
            placeholder="YYYY-MM-dd"
            :rules="[{ required: true, message: '填写订单日期(YYYY-MM-dd)' }]"
          />
          <van-space style="padding: 0 16px;">
            <van-button size="mini" plain type="primary" @click="confirmOrderInfo.orderDate = getToday()">
              {{ getToday() }}
            </van-button>
            <van-button size="mini" plain type="primary" @click="confirmOrderInfo.orderDate = getNextDay()">
              {{ getNextDay() }}
            </van-button>
          </van-space>
          <van-field
            v-model="confirmOrderInfo.orderType"
            is-link
            readonly
            name="订单类别"
            label="订单类别"
            placeholder="（早/中/晚）"
          />
          <van-space style="padding: 0 16px;">
            <van-button size="mini" plain type="primary" @click="confirmOrderInfo.orderType = '早'">
              早
            </van-button>
            <van-button size="mini" plain type="primary" @click="confirmOrderInfo.orderType = '中'">
              中
            </van-button>
            <van-button size="mini" plain type="primary" @click="confirmOrderInfo.orderType = '晚'">
              晚
            </van-button>
          </van-space>
          <van-field
            v-model="confirmOrderInfo.orderRemark"
            rows="1"
            autosize
            label="订单备注"
            type="textarea"
            placeholder="订单备注"
          />
          <van-space style="padding: 0 16px;">
            <van-button size="mini" plain type="primary" @click="confirmOrderInfo.orderRemark = '备注'">
              默认
            </van-button>
          </van-space>
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">
            下单
          </van-button>
        </div>
      </van-form>
    </van-popup>
    <!-- 右侧弹出 历史订单详情 -->
    <van-popup
      v-model:show="showHisOrderBottom"
      position="right"
      round
      closeable
      close-icon-position="bottom-left"
      :style="{ width: '100%', height: '100%' }"
    >
      <van-collapse v-model="hisOrderCollType">
        <van-collapse-item v-for="(item, index) in hisOrderDetailInfoList" :key="index" :title="`订单号: ${item.orderInfo.orderId}`" :name="`${String(index + 1)}`">
          <template #title>
            <van-space>
              <van-highlight :keywords="`${item.orderInfo.orderId}`" :source-string="`订单号: ${item.orderInfo.orderId}`" />
              <van-tag plain :type="hisOrderStateMap.get(item.orderInfo.orderStatus).type">
                {{ hisOrderStateMap.get(item.orderInfo.orderStatus).tag }}
              </van-tag>
              <van-tag color="#7232dd" plain>
                {{ item.orderInfo.orderType }}
              </van-tag>
            </van-space>
          </template>
          <template #value>
            <van-tag color="#ffe1e1" text-color="#ad0000">
              {{ item.orderInfo.orderDate }}
            </van-tag>
          </template>
          <van-steps :active="hisOrderStateMap.get(item.orderInfo.orderStatus).id">
            <van-step>选择菜品</van-step>
            <van-step>制作订单</van-step>
            <van-step v-if="item.orderInfo.orderStatus !== 'FAILED'">
              完成订单
            </van-step>
            <van-step v-else>
              取消订单
            </van-step>
          </van-steps>
          <div v-for="(card, idx2) in item.orderItemList" :key="idx2">
            <van-card
              :centered="true"
              :num="card.orderItem.quantity"
              :price="card.product.price / 100"
              :desc="card.product.description"
              :title="card.product.title"
              :thumb="card.product.thumb"
            />
          </div>
          <van-cell-group inset>
            <van-cell title="总价格：" :value="`${item.orderInfo.totalPrice / 100} 元`" />
            <van-cell title="订单备注：" :value="item.orderInfo.orderRemark" />
          </van-cell-group>
          <van-row v-if="item.orderInfo.orderStatus === 'WAITING_COMPLETED'" justify="end">
            <van-col span="4">
              <van-button size="mini" type="success" text="制作完成" @click="doneOrder(index)" />
            </van-col>
            <van-col span="4">
              <van-button size="mini" type="danger" text="取消订单" @click="cancelOrder(index)" />
            </van-col>
            <van-col span="4">
              <van-button size="mini" type="warning" text="回退订单" @click="backOrder(index)" />
            </van-col>
          </van-row>
        </van-collapse-item>
      </van-collapse>
    </van-popup>
    <!-- 左侧弹出 统计信息 -->
    <van-popup
      v-model:show="showEChartBottom"
      position="left"
      round
      closeable
      close-icon-position="bottom-left"
      :style="{ width: '100%', height: '100%' }"
    />
    <!--  顶部弹出 商品详情  -->
    <!--  底部弹出 新增商品  -->
    <van-popup
      v-model:show="showProductForm"
      round
      closeable
      position="top"
      close-icon-position="bottom-left"
      :style="{ width: '100%', height: '95%' }"
      @click-overlay="closeProductForm"
      @click-close-icon="closeProductForm"
    >
      <van-form @submit="showProductCardBottom ? onUpdateProductDetail() : onCreateProductDetail()">
        <van-cell-group inset>
          <van-field name="uploader" label="菜品图片">
            <template #input>
              <van-uploader v-model="uploadFileUrl" :max-size="5000 * 1024" multiple :max-count="1" :after-read="afterRead" />
              <!--              <van-uploader :max-size="5000 * 1024" :after-read="afterRead">
                <van-image
                  lazy-load
                  :show-loading="avatarLoad"
                  fit="cover"
                  width="100"
                  height="100"
                  :src="productCardDetail.product.thumb"
                >
                  <template #loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </van-uploader> -->
            </template>
          </van-field>
          <van-field
            v-model="productCardDetail.product.title"
            name="菜品名称"
            label="菜品名称"
            :placeholder="productCardDetail.product.title"
            :rules="[{ required: true, message: '填写' }]"
          />
          <van-field
            v-model="productCardCategory"
            is-link
            readonly
            name="菜品类别"
            label="菜品类别"
            placeholder="点击选择菜品类别"
            @click="showProductStatusPicker = true"
          />
          <van-popup v-model:show="showProductStatusPicker" position="bottom">
            <van-picker
              :columns="categoryColumns"
              @confirm="onConfirmCategory"
              @cancel="showProductStatusPicker = false"
            />
          </van-popup>
          <!--          <van-field -->
          <!--              v-model="productCardDetail.product.price" -->
          <!--              name="菜品价格" -->
          <!--              label="菜品价格" -->
          <!--              :placeholder="productCardDetail.product.price" -->
          <!--              :rules="[{ required: true, message: '填写价格' }]" -->
          <!--          /> -->
          <van-field name="rate" label="菜品评分">
            <template #input>
              <van-rate v-model="productCardDetail.product.rate" allow-half clearable />
            </template>
          </van-field>
          <van-field
            v-model="productCardDetail.product.description"
            rows="1"
            autosize
            label="菜品描述"
            type="textarea"
            placeholder="填写菜品描述"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">
            {{ showAddProductBottom ? '更新商品信息' : '添加商品信息' }}
          </van-button>
        </div>
      </van-form>
    </van-popup>
  </Container>
</template>

<style scoped lang="less">

</style>
