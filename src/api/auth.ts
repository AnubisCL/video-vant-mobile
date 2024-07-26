import { request } from '@/utils/request'

export function signIn(params?: any, data?: any) {
  return request({ url: '/authentication/signIn', method: 'post', params, data })
}

export function doLogin(params?: any, data?: any) {
  return request({ url: '/authentication/doLogin', method: 'post', params, data })
}

export function signOut(params?: any, data?: any) {
  return request({ url: '/authentication/signOut', method: 'get', params, data })
}
export function isLogin(params?: any, data?: any) {
  return request({ url: '/authentication/isLogin', method: 'get', params, data })
}

export function getUserInfo(params?: any, data?: any) {
  return request({ url: '/authentication/getUserInfo', method: 'get', params, data })
}
export function getPermissionList(params?: any, data?: any) {
  return request({ url: '/authentication/getPermissionList', method: 'get', params, data })
}
export function getMenuList(params?: any, data?: any) {
  return request({ url: '/authentication/getMenuList', method: 'get', params, data })
}

