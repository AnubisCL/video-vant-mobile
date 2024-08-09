import { request } from '@/utils/request'

export function uploadAvatar(params?: any, data?: any) {
  // 注意这里的内容类型
  return request({ url: '/user/upload-avatar', method: 'post', params, data, headers: { 'Content-Type': 'multipart/form-data' } })
}

export function getAvatar(params?: any, data?: any) {
  return request({ url: '/user/get-avatar', method: 'get', params, data })
}

