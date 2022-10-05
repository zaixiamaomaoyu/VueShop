import { request } from './request'

const getApi = {
  getLogin: function (data) {
    console.log(data)
    return request({
      url: 'login',
      method: 'post',
      data
    })
  }
}

export default getApi
