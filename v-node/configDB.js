const env = process.env.NODE_ENV

let config = {
    redisIp: '47.52.210.208',
    redisPsd: 'WEuyLV]TEp%xZV4W'
}

if (env === 'production') {
    config = {
        redisIp: '10.10.1.67',
        redisPsd: 'Qwe123KN9YMB'
    }
}

module.exports = config
