import { request } from '@/utils/request'
import { sm4Crypto } from '@/utils/sm4Util'

export function signIn(params?: any, data?: any) {
  const sm4Res: string = sm4Crypto.encrypt(JSON.stringify(data))
  const _data: any = { encryptData: sm4Res }
  return request({ url: '/authentication/signIn', method: 'post', params, data: _data })
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

export function getMenuList(menuType: string) {
  return request({ url: `/authentication/getMenuList/${menuType}`, method: 'get' })
}
