import axios from 'axios'
export function request (config) {
  const instance = axios.create({
    timeout: 5000,
    baseURL: 'http://127.0.0.1:8888/api/private/v1/'
  })

  instance.interceptors.request.use(config => {
    return config
  }, err => {
    return Promise.reject(err)
  })

  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    return Promise.reject(err)
  })

  return instance(config)
}
