import { request } from '@/utils/request'

export function getVideoList(params?: any, data?: any) {
  return request({ url: '/video/getVideoList', method: 'post', params, data })
}

export function historyDo(videoId?: any) {
  return request({ url: `/history/do/${videoId}`, method: 'get' })
}

export function historyCount(videoId?: any) {
  return request({ url: `/history/count/${videoId}`, method: 'get' })
}

export function likeDo(actionType?: any, itemId?: any) {
  return request({ url: `/like/do/${actionType}/${itemId}`, method: 'get' })
}

export function removeLike(videoId?: any) {
  return request({ url: `/like/removeLike/${videoId}`, method: 'get' })
}

export function isLike(videoId?: any) {
  return request({ url: `/like/isLike/${videoId}`, method: 'get' })
}

export function likeCount(videoId?: any) {
  return request({ url: `/like/count/${videoId}`, method: 'get' })
}

export function collectDo(videoId?: any) {
  return request({ url: `/collect/do/${videoId}`, method: 'get' })
}

export function removeCollect(videoId?: any) {
  return request({ url: `/collect/removeCollect/${videoId}`, method: 'get' })
}

export function isCollect(videoId?: any) {
  return request({ url: `/collect/isCollect/${videoId}`, method: 'get' })
}
