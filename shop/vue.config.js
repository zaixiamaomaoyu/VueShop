const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        assets: '@/assets',
        components: '@/components',
        views: '@/views',
        api: '@/api',
        router: '@/router'
      }
    }
  }
}
