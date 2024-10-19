import { request } from '@/utils/request'

export function getCartHisInfo(userId: number) {
  return request({ url: `/order/getCartHisInfo/${userId}`, method: 'get' })
}

export function clearCartHisInfo(userId: number) {
  return request({ url: `/order/clearCartHisInfo/${userId}`, method: 'get' })
}

export function orderItem(params?: any) {
  return request({ url: `/order/orderItem/${params.type}/${params.userId}/${params.orderId}/${params.productId}`, method: 'get' })
}

export function confirm(orderId: number) {
  return request({ url: `/order/confirm/${orderId}`, method: 'get' })
}
