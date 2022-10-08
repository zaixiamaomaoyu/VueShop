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
  },

  // 1.3.7. 分配用户角色
  setUserRole: function (id, data) {
    return request({
      url: `users/${id}/role`,
      method: 'put',
      data
    })
  },

  // ## 1.4. 权限管理
  // 1.4.1. 所有权限列表
  getRights: function () {
    return request({
      url: 'rights/list',
      method: 'get'
    })
  },

  // 树形结构
  getRightsByTree: function () {
    return request({
      url: 'rights/tree',
      method: 'get'
    })
  },

  // 1.5. 角色管理
  // 1.5.1. 角色列表
  getRoles: function () {
    return request({
      url: 'roles',
      method: 'get'
    })
  },

  // 1.5.2. 添加角色
  addRoles: function (data) {
    return request({
      url: 'roles',
      method: 'post',
      data
    })
  },
  // 1.5.4. 编辑提交角色
  editRoles: function (data) {
    return request({
      url: `roles/${data.id}`,
      method: 'put',
      data
    })
  },

  // 1.5.5. 删除角色
  deleteRoles: function (id) {
    return request({
      url: `roles/${id}`,
      method: 'delete'
    })
  },

  // 1.5.6. 角色授权
  setRoles: function (roleId, data) {
    console.log(data)
    return request({
      url: `roles/${roleId}/rights`,
      method: 'post',
      data
    })
  },

  // 1.5.7. 删除角色指定权限
  deleteRoleById: function (roleId, rightId) {
    return request({
      // url: 'roles/' + roleId + '/rights/' + rightId,
      url: `roles/${roleId}/rights/${rightId}`,
      method: 'delete'
    })
  },

  // 1.6.1. 商品分类数据列表
  getCateList: function (params) {
    return request({
      url: 'categories',
      method: 'get',
      params
    })
  },

  // 1.6.2. 添加分类
  addCate: function (data) {
    return request({
      url: 'categories',
      method: 'post',
      data
    })
  },

  // 1.6.4. 编辑提交分类
  editCate: function (data) {
    return request({
      url: `categories/${data.cat_id}`,
      method: 'put',
      data
    })
  },

  // 1.6.5. 删除分类
  deleteCate: function (data) {
    return request({
      url: `categories/${data.cat_id}`,
      method: 'delete'
    })
  }
}

export default getApi
