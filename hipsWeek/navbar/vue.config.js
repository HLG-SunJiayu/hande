module.exports = {
    publicPath: '',
    // 不需要生产环境的 source map，将其设置为 false 以加速生产环境构建
    productionSourceMap: false,
    devServer: {
        open: true,
        port: '9595'
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            // config.plugins = [...config.plugins, ...plugins]
        }
    }
}
