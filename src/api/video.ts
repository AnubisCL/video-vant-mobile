import { request } from '@/utils/request'

export function getVideoList(params?: any, data?: any) {
  return request({ url: '/video/getVideoList', method: 'post', params, data })
}

