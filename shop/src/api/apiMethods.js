import { request } from './request'

const getApi = {
  // 1.2.1. 登录验证接口
  getLogin: function (data) {
    console.log(data)
    return request({
      url: 'login',
      method: 'post',
      data
    })
  },

  // 1.4.2. 左侧菜单权限
  getMenusList: function () {
    return request({
      url: 'menus',
      method: 'get'
    })
  }
}

export default getApi
