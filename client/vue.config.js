const { defineConfig } = require('@vue/cli-service')
const target = 'http://localhost:3000';

module.exports = defineConfig({
  transpileDependencies: true,

  devServer : {
    proxy : {
      '^/api' : {
        target,
        changeOrigin : true,
        ws : false,
        pathRewrite : { '^/api' :'/' }
      }
    }
  },
  css: {
    loaderOptions: {
        sass: {
            additionalData: `
      @import "@/assets/scss/variables.scss";
    `
        }
    }
  },

  pluginOptions: {
    vuetify: {}
  },
})
