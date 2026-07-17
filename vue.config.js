const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // GitHub Pages serves project pages from /<repo-name>/, not the domain root.
  publicPath: process.env.NODE_ENV === 'production' ? '/purrfect-focus/' : '/',
  transpileDependencies: true
})
