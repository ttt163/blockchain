/**
 * Author：zhoushuanglong
 * Time：2018-05-18 15:24
 * Description：client
 */

const redis = require('redis')
const {redisIp, redisPsd} = require('../configDB')

const redisServerIP = redisIp
const redisServerPort = '6379'
const redisPassword = redisPsd

const setupRedis = () => {
    const client = redis.createClient(redisServerPort, redisServerIP)
    client.auth(redisPassword)
    client.on('error', function (error) {
        console.log('RedisServer is error!\n' + error)
    })
    client.on('connect', function () {
        console.log('RedisServer is connected!')
    })
    client.on('end', function () {
        console.log('RedisServer is end!')
    })
    client.select('15', function (error) {
        if (error) console.log(error)
        console.log('RedisServer is connected 15!')
    })
    return client
}

module.exports = setupRedis
