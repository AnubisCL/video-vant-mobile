import { request } from '@/utils/request'

export function getProductCategory(params?: any, data?: any) {
  return request({ url: '/product/getProductCategory', method: 'get', params, data })
}

export function getProductList(params?: any, data?: any) {
  return request({ url: '/product/getProductList', method: 'get', params, data })
}
