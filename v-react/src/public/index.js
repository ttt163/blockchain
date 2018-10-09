/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：public function
 */

import axios from 'axios'
import Cookies from 'js-cookie'
import '../../node_modules/layui-layer/dist/layer.js'

export const format = (date, str) => {
    let _str = !str ? '-' : str
    const zero = (m) => {
        return m < 10 ? '0' + m : m
    }
    let time = new Date(date)
    let y = time.getFullYear()
    let m = time.getMonth() + 1
    let d = time.getDate()
    if (date) {
        return y + _str + zero(m) + _str + zero(d)
    } else {
        return ''
    }
}

export const getTime = (publishTime, requestTime, justNow, minuteAgo, hourAgo) => {
    let limit = parseInt((requestTime - publishTime)) / 1000
    let content = ''
    if (limit < 60) {
        content = justNow
    } else if (limit >= 60 && limit < 3600) {
        content = Math.floor(limit / 60) + minuteAgo
    } else if (limit >= 3600 && limit < 86400) {
        content = Math.floor(limit / 3600) + hourAgo
    } else {
        content = format(publishTime)
    }
    return content
}

export const keyLight = (content, key, color) => {
    let bgColor = color || '#e61e1e'
    let sKey = `<span style='color: ${bgColor}'>${key}</span>`
    let rStr = new RegExp(key, 'ig')
    let sText = content.replace(rStr, sKey) // 替换key
    return sText
}

export const axiosAjax = (type, url, params, fn, noloading) => {
    let ajaxLoadingStr = `<div class="lk-loading ajax active" id="ajaxLoading">
    <div class="lk-loading-center">
        <div class="lk-loading-center-absolute">
            <div class="round round-one"></div>
            <div class="round round-two"></div>
            <div class="round round-three"></div>
        </div>
    </div>
</div>`

    if (noloading) {
        ajaxLoadingStr = '<div id="ajaxLoading"></div>'
    }

    if ($('#ajaxLoading').length === 0) {
        $('body').append(ajaxLoadingStr)
    }

    const param = type.toLowerCase() === 'post'
    axios(param ? {
        method: type,
        url: url,
        data: params
    } : {
        method: type,
        url: url,
        params: params
    }).then(function (response) {
        $('#ajaxLoading').remove()

        const data = response.data

        if (data.code === -4) {
            Cookies.remove('hx_user_token')
            Cookies.remove('hx_user_id')
            Cookies.remove('hx_user_nickname')
            Cookies.remove('hx_user_url')
            Cookies.remove('hx_user_phone')
            Cookies.remove('hx_user_realAuth')
            Cookies.remove('hx_user_createTime')
            layer.msg('登录过期，请注销后重新登录~')
            if (window.location.href.indexOf('newsdetail') !== -1) {
                fn.call(this, data)
            }
            return false
        }
        fn.call(this, data)
    }).catch(function (error) {
        console.log(error)
    })
}

export const axiosAjaxNoLoading = (type, url, params, fn) => {
    const param = type.toLowerCase() === 'post'
    axios(param ? {
        method: type,
        url: url,
        data: params
    } : {
        method: type,
        url: url,
        params: params
    }).then(function (response) {
        const data = response.data

        if (data.code === -4) {
            Cookies.remove('hx_user_token')
            Cookies.remove('hx_user_id')
            Cookies.remove('hx_user_nickname')
            Cookies.remove('hx_user_url')
            Cookies.remove('hx_user_phone')
            Cookies.remove('hx_user_realAuth')
            Cookies.remove('hx_user_createTime')
            layer.msg('登录过期，请注销后重新登录~')
            if (window.location.href.indexOf('newsdetail') !== -1) {
                fn.call(this, data)
            }
            return false
        }
        fn.call(this, data)
    }).catch(function (error) {
        console.log(error)
    })
}

export const axiosPostAjax = (type, url, params, fn) => {
    const ajaxLoadingStr = `<div class="lk-loading ajax active" id="ajaxLoading">
    <div class="lk-loading-center">
        <div class="lk-loading-center-absolute">
            <div class="round round-one"></div>
            <div class="round round-two"></div>
            <div class="round round-three"></div>
        </div>
    </div>
</div>`

    if ($('#ajaxLoading').length === 0) {
        $('body').append(ajaxLoadingStr)
    }

    axios({
        method: type,
        url: url,
        params: params
    }).then(function (response) {
        $('#ajaxLoading').remove()
        const data = response.data
        if (data.code === -4) {
            layer.msg('登录过期，请注销后重新登录~')
            return false
        }
        fn.call(this, data)
    }).catch(function (error) {
        console.log(error)
    })
}

export const axiosArticleAjax = (type, url, params, fn, contentType) => {
    const ajaxLoadingStr = `<div class="lk-loading ajax active" id="ajaxLoading">
    <div class="lk-loading-center">
        <div class="lk-loading-center-absolute">
            <div class="round round-one"></div>
            <div class="round round-two"></div>
            <div class="round round-three"></div>
        </div>
    </div>
</div>`

    if ($('#ajaxLoading').length === 0) {
        $('body').append(ajaxLoadingStr)
    }

    const param = type.toLowerCase() === 'post'
    const dataParam = {
        method: type,
        url: url,
        data: params
    }
    if (contentType) {
        dataParam.headers = {
            'Content-Type': contentType
        }
    }
    axios(param ? dataParam : {
        method: type,
        url: url,
        params: params
    }).then(function (response) {
        $('#ajaxLoading').remove()
        const data = response.data
        if (data.code === -4) {
            layer.msg('登录过期，请注销后重新登录~')
            return false
        }
        fn.call(this, data)
    }).catch(function (error) {
        console.log(error)
    })
}

export const axiosFormData = (type, url, params, fn) => {
    axios({
        method: type,
        url: url,
        data: params,
        headers: {'Content-Type': 'multipart/form-data'}
    }).then(function (response) {
        const data = response.data
        if (data.code === -4) {
            layer.msg('登录过期，请注销后重新登录~')
            return false
        }
        fn.call(this, data)
    }).catch(function (error) {
        console.log(error)
    })
}

// 计算前7天日期
export const sevenDays = () => {
    const formatDate = (y, m, d) => {
        const newM = m < 10 ? `0${m + 1}` : m + 1
        const newD = d < 10 ? `0${d}` : d

        return `${y}-${newM}-${newD}`
    }

    let dateArray = []
    for (let i = 0; i < 7; i++) {
        const caDate = new Date()
        caDate.setDate(caDate.getDate() - i)
        dateArray.push(formatDate(caDate.getFullYear(), caDate.getMonth(), caDate.getDate()))
    }

    return dateArray
}

// 生成全局唯一标识符
export const generateUUID = () => {
    let d = new Date().getTime()
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
}

// 加0
export const add0 = (num) => {
    return num >= 10 ? num : '0' + num
}

// 获取时分
export const getHourMinute = (time) => {
    const timeTemp = new Date(time)
    return `${add0(timeTemp.getHours())}:${add0(timeTemp.getMinutes())}`
}

// 判断两个对象是否相等
export const compareObject = function (x, y) {
    if (x === y) {
        return true
    }

    if (!(x instanceof Object) || !(y instanceof Object)) {
        return false
    }

    if (x.constructor !== y.constructor) {
        return false
    }

    let p
    for (p in x) {
        if (x.hasOwnProperty(p)) {
            if (!y.hasOwnProperty(p)) {
                return false
            }
            if (x[p] === y[p]) {
                continue
            }
            if (typeof (x[p]) === 'function' && x[p].toString() === y[p].toString()) {
                continue
            }
            if (typeof (x[p]) !== 'object') {
                return false
            }
            if (!compareObject(x[p], y[p])) {
                return false
            }
        }
    }

    for (p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
            return false
        }
    }
    return true
}

export const numTrans = (num) => {
    if (num > 99999999) {
        return (num / 100000000).toFixed(3)
    } else if (num > 9999 && num < 99999999) {
        return (num / 10000).toFixed(3)
    } else {
        return num
    }
}

export const isPc = () => {
    const userAgent = window.navigator.userAgent.toLowerCase()

    const Agents = ['android', 'iphone', 'ipad', 'ipod', 'windows phone']
    let flag = true
    for (let i = 0; i < Agents.length; i++) {
        if (userAgent.indexOf(Agents[i]) > 0) {
            flag = false
            break
        }
    }
    return flag
}

// 超出字数显示省略号
export const cutString = (str, len) => {
    // length属性读出来的汉字长度为1
    if (str.length * 2 <= len) {
        return str
    }
    let strlen = 0
    let s = ''
    for (let i = 0; i < str.length; i++) {
        s = s + str.charAt(i)
        if (str.charCodeAt(i) > 128) {
            strlen = strlen + 2
            if (strlen >= len) {
                return s.substring(0, s.length - 1) + '...'
            }
        } else {
            strlen = strlen + 1
            if (strlen >= len) {
                return s.substring(0, s.length - 2) + '...'
            }
        }
    }
    return s
}

// 验证手机号
export const isPoneAvailable = (pone) => {
    const myreg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (!myreg.test(pone)) {
        return false
    } else {
        return true
    }
}

// 判断是否为对象字符串
export const isJsonString = (str) => {
    try {
        if (typeof JSON.parse(str) === 'object') {
            return true
        }
    } catch (e) {
        console.log(e)
    }
    return false
}

// 新闻频道
export const titleArr = [
    {label: '头条', value: '0'},
    // {label: 'BTA', value: '12'},
    // { label: '新闻', value: '1' },
    {label: '产业', value: '2'},
    {label: '技术', value: '6'},
    {label: '挖矿', value: '13'},
    {label: '项目', value: '3'},
    {label: '人物', value: '4'},
    {label: '游戏', value: '7'},
    {label: '八点', value: '8'},
    {label: '王峰十问', value: '9'}
]

// 图片的 dataurl 转 blob
export const dataURLtoBlob = (dataurl) => {
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], {type: mime})
}

export const URL = '/mgr'

// PC 广告位置备注
export const pcAdPosition = [
    {label: '首页顶部 Banner', value: '1'},
    {label: '首页中部左侧', value: '2'},
    {label: '首页中部右侧', value: '3'},
    {label: '首页底部', value: '4'},
    {label: '新闻详情顶部', value: '5'},
    {label: '新闻详情底部', value: '6'},
    {label: '相关新闻', value: '7'}
]

// 手机端广告位置
export const mobileAdPosition = [
    {label: 'Mobile首页', value: '1'},
    {label: 'Mobile新闻详情页', value: '2'}
]

// 时间戳转日期
export const timestampToTime = (timestamp) => {
    const date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const Y = date.getFullYear() + '-'
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    const D = date.getDate() + ' '
    const h = date.getHours() + ':'
    const m = date.getMinutes() + ':'
    const s = date.getSeconds()
    return Y + M + D + h + m + s
}

export const urlPath = () => {
    const href = window.location.href
    const hrefArr = href.split('/')
    const urlPathArr = hrefArr.slice(3, hrefArr.length)
    return '/' + urlPathArr.join('/')
}

export const getQueryString = (name) => {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    const r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
}

// 格式化价格 保留6位有效数字
export const formatPrice = (val) => {
    // console.log(val)
    if (!val) {
        return 0
    }
    let price = val
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
