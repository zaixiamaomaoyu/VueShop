import { request } from './request'

const getApi = {
  // 1.2.1. 登录验证接口
  getLogin: function (data) {
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
  },

  // 1.3.1. 用户数据列表
  getUsersList: function (params) {
    return request({
      url: 'users',
      method: 'get',
      params
    })
  },

  // 1.3.2. 添加用户
  addUser: function (data) {
    return request({
      url: 'users',
      method: 'post',
      data
    })
  },

  // 1.3.3. 修改用户状态
  getUserStatus: function (row) {
    return request({
      url: 'users/' + row.id + '/state/' + row.mg_state,
      method: 'put'
    })
  },

  // 1.3.5. 编辑用户提交
  updateUser: function (data) {
    return request({
      url: 'users/' + data.id,
      method: 'put',
      data
    })
  },

  // 1.3.6. 删除单个用户
  deleteUser: function (id) {
    return request({
      url: 'users/' + id,
      method: 'delete'
    })
  }
}

export default getApi
