/**
 * Author：zhoushuanglong
 * Time：2018-04-10 15:02
 * Description：nodejs public js
 */

const axios = require('axios')
const fs = require('fs')
const path = require('path')
const md5 = require('md5')
const Base64 = require('js-base64').Base64

const {
    mUrl,
    pcUrl
} = require('../config')

/**
 * JS：axiosAjax({
        type: 'post',
        url: '/info/news/columnadd',
        contentType: 'application/x-www-form-urlencoded',
        formData: true,
        params: {
            dataone: 'one',
            datatwo: 'two'
        },
        fn: function (data) {
            console.log(data)
        }
    })
 */

const getSig = () => {
    let platform = 'pc'
    let appSecret = 'Fbz]OdjAyhpqOIKA'
    let nonceArr = 'abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ1234567890'
    let timestamp = new Date().getTime()
    let nonce = ''
    for (let i = 0; i < 6; i++) {
        let j = Math.round(Math.random() * nonceArr.length)
        nonce += nonceArr[j]
    }
    let sig = md5('platform=' + platform + '&timestamp=' + timestamp + '&nonce=' + nonce + '&' + appSecret)
    let base64 = Base64.encode(JSON.stringify({
        'platform': platform,
        'nonce': nonce,
        'timestamp': timestamp,
        'sig': sig
    }))
    return base64
}

const ajax = (arg) => {
    return new Promise(function (resolve, reject) {
        const {type, url, params, contentType, formData, res} = arg

        let opt = null
        const ajaxType = type.toLowerCase()
        if (ajaxType === 'post') {
            opt = {
                method: type,
                url: url,
                data: params,
                headers: {'Sign-Param': getSig()}
            }
        } else if (ajaxType === 'get') {
            opt = {
                method: type,
                url: url,
                params: params,
                headers: {'Sign-Param': getSig()}
            }
        } else if (ajaxType === 'complexpost') {
            opt = {
                method: 'post',
                url: url,
                params: params,
                headers: {'Sign-Param': getSig()}
            }
        }

        if (formData) {
            let formDataParm = new URLSearchParams()
            for (let key in params) {
                formDataParm.append(key, params[key])
            }

            opt = {
                method: type,
                url: url,
                data: formDataParm,
                headers: {'Sign-Param': getSig()}
            }
        }

        if (contentType) {
            opt.headers = {
                'Content-Type': contentType
            }
        }

        axios(opt).then(function (response) {
            const resData = response.data
            if (resData.code > 0) {
                resolve(resData)
            } else {
                res.render('error', {
                    message: resData.msg,
                    error: {
                        status: resData.code,
                        stack: 'Please pass the correct parameters.'
                    }
                })
            }
        }).catch(function (err) {
            if (res) {
                console.log(`Server-side error, url:"${err.config.url}", msg:${err.message}`)
                res.render('error', {
                    message: 'Request error',
                    error: {
                        status: err.response.status,
                        stack: err.response.data
                    }
                })
            }
        })
    })
}

const axiosAjax = (arg) => {
    const {type, url, params, contentType, formData, fn, res} = arg

    let opt = null
    const ajaxType = type.toLowerCase()
    if (ajaxType === 'post') {
        opt = {
            method: type,
            url: url,
            data: params,
            headers: {'Sign-Param': getSig()}
        }
    } else if (ajaxType === 'get') {
        opt = {
            method: type,
            url: url,
            params: params,
            headers: {'Sign-Param': getSig()}
        }
    } else if (ajaxType === 'complexpost') {
        opt = {
            method: 'post',
            url: url,
            params: params,
            headers: {'Sign-Param': getSig()}
        }
    }

    if (formData) {
        let formDataParm = new URLSearchParams()
        for (let key in params) {
            formDataParm.append(key, params[key])
        }

        opt = {
            method: type,
            url: url,
            data: formDataParm,
            headers: {'Sign-Param': getSig()}
        }
    }

    if (contentType) {
        opt.headers = {
            'Content-Type': contentType
        }
    }

    axios(opt).then(function (response) {
        const data = response.data

        if (fn) {
            fn.call(this, data)
        }
    }).catch(function (err) {
        if (res) {
            console.log(`Server-side error, url:"${err.config.url}", msg:${err.message}`)
            res.render('error', {
                message: 'Request error',
                error: {
                    status: err.response.status,
                    stack: err.response.data
                }
            })
        }
    })
}

// 格式化请求参数
const fomartQuery = (obj) => {
    let str = ''
    for (let [key, val] of Object.entries(obj)) {
        str += `&${key}=${val}`
    }
    return str.substring(1)
}

/**
 * java: pc接口代理
 */
const ajaxJavaUrl = `http://${pcUrl}`
const proxyJavaApi = [
    '/*',
    '/*/*',
    '/*/*/*',
    '/*/*/*/*',
    '/*/*/*/*/*'
]

// 默认tdk
const webInfo = {
    title: '火星财经-区块链先锋门户',
    keywords: '区块链,比特币,Bitcoin,数字货币,王峰十问,以太坊,ETH,EOS,莱特币,瑞波币,挖矿,区块链是什么,区块链技术,区块链开发,比特币行情,比特币价格,比特币价格,监管,金融局',
    description: '火星财经系集新闻、资讯、数据等于一体的区块链产业信息服务平台。由资深互联网团队倾力打造，已完成来自IDG等投资机构的多轮融资。致力于为中国及全球用户提供快速、全面、深度的资讯及数据服务，推动区块链产业迅猛发展'
}

// 行情tdk
const getMarksWebInfo = (symbol, eName, cName) => {
    let tNameStr = ''
    let kNameStr = ''
    let dNameStr = ''
    if (!cName) {
        if (!eName) {
            tNameStr = `${symbol}`
            kNameStr = `${symbol}`
            dNameStr = `${symbol}`
        } else {
            tNameStr = `${eName}_${symbol}`
            kNameStr = `${eName}，${symbol}`
            dNameStr = `${eName}`
        }
    } else {
        if (!eName) {
            tNameStr = `${cName}_${symbol}`
            kNameStr = `${cName}，${symbol}`
            dNameStr = `${cName}`
        } else {
            tNameStr = `${cName}_${eName}_${symbol}`
            kNameStr = `${cName}，${eName}，${symbol}`
            dNameStr = `${cName}_${eName}`
        }
    }
    return {
        title: `${tNameStr} 最新价格_行情走势图_币值分析_火星财经`,
        keywords: `${kNameStr}，${dNameStr}价格，${dNameStr}行情，${dNameStr}是什么，${dNameStr}交易网，${dNameStr}交易平台，如何购买${dNameStr}，${dNameStr}官网，${dNameStr}价格，${dNameStr}骗局`,
        description: `火星财经是集${dNameStr}新闻、${dNameStr}资讯、${dNameStr}行情、${dNameStr}数据等区块链信息的专业服务平台，致力于为区块链创业者以及数字货币投资者提供最新最及时的${dNameStr}项目报道、${dNameStr}投资顾问、${dNameStr}项目分析、${dNameStr}市场行情`
    }
}

// 专题
const getHotWebInfo = (tags, topicName) => {
    return {
        title: `${!topicName ? tags : topicName}_火星财经`,
        keywords: `${tags}，${tags}是什么，火星财经`,
        description: !topicName ? `${tags}，${tags}是什么，火星财经是集新闻、资讯、行情、数据等区块链信息的专业服务平台，致力于为区块链创业者以及数字货币投资者提供最新最及时的项目报道、投资顾问、项目分析、市场行情` : topicName
    }
}

// 快讯，行情，新闻，视频 TDK
const getTDK = (tTitle, kKeywords, dDescription) => {
    return {
        title: `${tTitle}_火星财经`,
        keywords: `${kKeywords}`,
        description: `${dDescription}`
    }
}

/**
 * JS：pageRender({
 *     req: req,
 *     res: res,
 *     mRender: function(){},
 *     pcRender: function(){}
 * })
 */

const onlineMUrl = mUrl
const onlinePcUrl = pcUrl

const isPc = (userAgentStr) => {
    const userAgent = userAgentStr.toLowerCase()

    const Agents = ['android', 'iphone', 'ipod', 'windows phone']
    let flag = true
    for (let i = 0; i < Agents.length; i++) {
        if (userAgent.indexOf(Agents[i]) > -1) {
            flag = false
            break
        }
    }
    return flag
}

const routerPcM = [
    'newsdetail',
    'liveNewsDetail',
    'livenews',
    'news',
    'video',
    'videoDetails',
    'liveDetail',
    'liveList',
    'mtc',
    'mtc2',
    'mtc3',
    'mtc4',
    'mtc5',
    'mtcsign',
    'mtcsign2',
    'mtcsign3',
    'mtcsign4',
    'mtcsign5',
    'chinaTour',
    'huodong',
    'huodongDetail',
    'summit',
    'zt/NY2018'
]

const pageRender = (arg) => {
    const {req, res, mRender, pcRender, redirect} = arg
    const protocol = req.protocol
    const domain = req.headers.host
    const userAgent = req.headers['user-agent']
    const originalUrl = req.originalUrl

    if (redirect) {
        if (isPc(userAgent)) {
            pcRender()
        } else {
            mRender()
        }
    } else {
        let isRouterPcM = false
        for (let value of routerPcM) {
            if (originalUrl.indexOf(value) > -1) {
                isRouterPcM = true
                break
            }
        }

        if (isPc(userAgent)) {
            if (domain.indexOf(onlineMUrl) > -1) {
                if (isRouterPcM) {
                    res.redirect(protocol + '://' + onlinePcUrl + originalUrl)
                } else {
                    res.redirect(protocol + '://' + onlinePcUrl)
                }
            }
            pcRender()
        } else {
            if (domain.indexOf(onlinePcUrl) > -1) {
                if (isRouterPcM) {
                    res.redirect(protocol + '://' + onlineMUrl + originalUrl)
                } else {
                    res.redirect(protocol + '://' + onlineMUrl)
                }
            }
            mRender()
        }
    }
}

// 创建多级目录
const mkDirs = (dirname, callback) => {
    fs.stat(dirname, (err, stats) => {
        if (!err) {
            callback()
        } else {
            mkDirs(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback)
            })
        }
    })
}

const getHost = (req) => {
    return `${req.protocol}://${req.headers.host}`
}

/**
 * Intro: time format
 */
const formatTime = (date, str) => {
    let _str = !str ? '-' : str
    const zero = (m) => {
        return m < 10 ? '0' + m : m
    }
    let time = new Date(parseInt(date / 1000) * 1000)
    let y = time.getFullYear()
    let m = time.getMonth() + 1
    let d = time.getDate()
    if (date) {
        return y + _str + zero(m) + _str + zero(d)
    } else {
        return ''
    }
}
const getTime = (publishTime, requestTime, justNow, minuteAgo, hourAgo) => {
    let limit = parseInt((requestTime - publishTime)) / 1000
    let content = ''
    if (limit < 60) {
        content = justNow
    } else if (limit >= 60 && limit < 3600) {
        content = Math.floor(limit / 60) + minuteAgo
    } else if (limit >= 3600 && limit < 86400) {
        content = Math.floor(limit / 3600) + hourAgo
    } else {
        content = formatTime(publishTime)
    }
    return content
}
// 获取字符长度
const GetLength = (str) => {
    let realLength = 0
    let len = str.length
    let charCode = -1
    for (let i = 0; i < len; i++) {
        charCode = str.charCodeAt(i)
        if (charCode >= 0 && charCode <= 128) {
            realLength += 1
        } else {
            realLength += 2
        }
    }
    return realLength
}
const getTimeContent = (publishTime, requestTime) => {
    let limit = parseInt((requestTime - publishTime)) / 1000
    let content = ''
    if (limit < 60) {
        content = '刚刚'
    } else if (limit >= 60 && limit < 3600) {
        content = Math.floor(limit / 60) + '分钟前'
    } else if (limit >= 3600 && limit < 86400) {
        content = Math.floor(limit / 3600) + '小时前'
    } else {
        content = formatTime(publishTime)
    }
    return content
}

// 格式化价格 保留6位有效数字
const formatPrice = (val) => {
    if (!val) {
        return 0
    }
    let price = Number(val)
    if (isNaN(price)) {
        return 0
    }
    if (val > 1) {
        price = price.toPrecision(6)
    } else {
        let valStr = val.toString()
        let str = valStr.substring(valStr.indexOf('.') + 1)
        if (str > 5) {
            price = price.toFixed(5)
        } else {
            price = val
        }
    }
    return price
}

const numTrans = (num) => {
    if (num > 99999999) {
        return {value: formatPrice(num / 100000000), label: '亿'}
    } else if (num > 9999 && num < 99999999) {
        return {value: formatPrice(num / 10000), label: '万'}
    } else {
        return {value: formatPrice(num), label: ''}
    }
}

const newsTitleArr = [
    {label: '头条', value: '0'},
    {label: '行情', value: '14'},
    {label: '研报', value: '15'},
    {label: '项目', value: '3'},
    {label: '人物', value: '4'},
    {label: '宏观', value: '17'},
    {label: '王峰十问', value: '9'},
    {label: '英文版', value: '19'}
]

module.exports = {
    mkDirs,
    ajaxJavaUrl,
    proxyJavaApi,
    axiosAjax,
    ajax,
    webInfo,
    pageRender,
    getHost,
    getTime,
    formatTime,
    GetLength,
    getTimeContent,
    formatPrice,
    numTrans,
    newsTitleArr,
    getMarksWebInfo,
    getHotWebInfo,
    fomartQuery,
    getTDK
}
