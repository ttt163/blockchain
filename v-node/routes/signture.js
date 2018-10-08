/**
 * Author：zhoushuanglong
 * Time：2018-05-09 16:54
 * Description：signture
 */

const {promisify} = require('util')
const express = require('express')
const router = express.Router()
const sign = require('../utils/sign')
const request = require('request')
const client = require('../utils/client')()

const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client)
const hmsetAsync = promisify(client.hmset).bind(client)
const hgetallAsync = promisify(client.hgetall).bind(client)

// 服务号3281384901@qq.com密码Linekong2018
const config = {
    appID: 'wxec2dc083d4024311',
    appSecret: 'b78d95fd673f7fe469d2f957e877a34a'
}

// signs分割字符串
const cutMark = 'segmentation-redis-signs'

// 初始化redis的signTemp
setAsync('signs', '')
hmsetAsync('access', {
    'token': '',
    'time': ''
})

/**
 * 请求获取access_token
 */
const getAccessToken = () => {
    const tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.appID + '&secret=' + config.appSecret
    return new Promise((resolve, reject) => {
        request(tokenUrl, function (error, response, data) {
            if (error) console.log(error)

            if (response.statusCode && response.statusCode === 200) {
                const accessToken = JSON.parse(data).access_token
                resolve(accessToken)
            }
        })
    })
}

/**
 * 请求获取Jsapi_Ticket
 * @param {* URL链接} hrefURL
 * @param {* token} accessToken
 */
async function reGetAccessToken () {
    const token = await getAccessToken()
    await hmsetAsync('access', {
        'token': token,
        'time': new Date().getTime()
    })
    return token
}

const getJsapiTicket = (reqUrl, accessToken) => {
    const ticketUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + accessToken + '&type=jsapi'
    return new Promise((resolve, reject) => {
        request(ticketUrl, function (error, response, data) {
            if (error) console.log(error)

            if (response.statusCode && response.statusCode === 200) {
                const content = JSON.parse(data)

                if (content.errcode === 0) {
                    resolve(sign(content.ticket, reqUrl))
                } else if (content.errcode === 40001) {
                    reGetAccessToken().then(function (token) {
                        getJsapiTicket(reqUrl, token)
                    })
                }
            }
        })
    })
}

async function dueClear (reqUrl) {
    const token = await getAccessToken()
    await hmsetAsync('access', {
        'token': token,
        'time': new Date().getTime()
    })
    const signobj = await getJsapiTicket(reqUrl, token)
    await setAsync('signs', [JSON.stringify(signobj)].join(cutMark))

    return signobj
}

async function nodueVerify (access, reqUrl) {
    const getsigns = await getAsync('signs')

    const signs = getsigns.split(cutMark)
    let signIndex = -1
    for (let index in signs) {
        if (JSON.parse(signs[index]).url === reqUrl) {
            signIndex = index
            break
        }
    }

    if (signIndex === -1) {
        const signobj = await getJsapiTicket(reqUrl, access.token)
        signs.push(JSON.stringify(signobj))
        await setAsync('signs', signs.join(cutMark))

        return signobj
    } else {
        return JSON.parse(signs[signIndex])
    }
}

router.post('/', function (req, res, next) {
    const reqUrl = req.body.url

    const deadTime = 6200 * 1000

    hgetallAsync('access').then(function (access) {
        const currentTime = new Date().getTime()
        const timeRemaining = currentTime - access.time < deadTime

        if (!timeRemaining) {
            dueClear(reqUrl).then(function (data) {
                res.json(data)
            })
        } else {
            nodueVerify(access, reqUrl).then(function (data) {
                res.json(data)
            })
        }
    })
})

module.exports = router
