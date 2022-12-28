module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    publicPath: '/',
    devServer: {
      // host: 'localhost',
      port: 9797, // 端口号
      open: false, // 配置自动启动浏览器
      overlay: {
        warnings: false,
        errors: true
      },
    },
  }
}
