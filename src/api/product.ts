import { request } from '@/utils/request'

export function getProductCategory(params?: any, data?: any) {
  return request({ url: '/product/getProductCategory', method: 'get', params, data })
}

export function getProductList(params?: any, data?: any) {
  return request({ url: '/product/getProductList', method: 'get', params, data })
}

export function getProductDetail(productDetailId?: number) {
  return request({ url: `/product/getProductDetail/${productDetailId}`, method: 'get' })
}

export function updateProductInfo(params?: any, data?: any) {
  return request({ url: `/product/updateProductInfo`, method: 'post', params, data })
}
