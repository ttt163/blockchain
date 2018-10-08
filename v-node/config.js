/** 上线前修改此链接为线上链接，复制assets/js/public/simditor.js到node_modules/simditor */
/**
 * 1:dev前删掉devJs内容数组为空数组, 点击dev生成静态资源文件
 * 2:devJs中填写正在开发或需要修改的Js文件名称 eg:['index', 'public/public'], 点击watch监听文件修改. 注: 修改devJs之后需要重启watch
 * 3:启动nodeJs服务, 点击nodemon
 * 4:buildTest测试环境打包, buildPrd正式环境打包, pm2Test测试环境项目启动, pm2Prd线上环境项目启动, start开发环境终端打印log可在chrome浏览器中查看特别json对象(需要chrome做相应配置)
 */

// const devJs = ['marketStatistics', 'm-coinEncyclopedia']
const devJs = []

const env = typeof process.env.NODE_ENV !== 'undefined' ? process.env.NODE_ENV : false

let config = {
    host: '127.0.0.1',
    port: '8090',
    vendors: [
        'babel-polyfill',
        'axios',
        'layui-layer'
    ]
}

let browserEnv = 'development'
if (typeof window !== 'undefined') {
    const host = window.location.host
    if (host.indexOf('huoxing24.vip') > -1) {
        browserEnv = 'test'
    } else if (host.indexOf('huoxing24.com') > -1) {
        browserEnv = 'production'
    }
}

if (env === 'development' || browserEnv === 'development') {
    config = Object.assign(
        config,
        {
            devJs: devJs,
            publicPath: '',
            mUrl: 'm.huoxing24.com',
            pcUrl: 'www.huoxing24.com'
        }
    )
}

if (env === 'test' || browserEnv === 'test') {
    config = Object.assign(
        config,
        {
            devJs: [],
            publicPath: 'http://www.huoxing24.com',
            mUrl: 'm.huoxing24.vip',
            pcUrl: 'www.huoxing24.vip'
        }
    )
}

if (env === 'production' || browserEnv === 'production') {
    config = Object.assign(
        config,
        {
            devJs: [],
            publicPath: 'http://www.huoxing24.com',
            mUrl: 'm.huoxing24.com',
            pcUrl: 'www.huoxing24.com'
        }
    )
}

module.exports = config
