/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import {
    CURRENCYINFO,
    MARKETQUOTATION,
    EXCHANGEPARTICULARSPRICE,
    EXCHANGEPARTICULARS,
    GETEXCHANGELIST,
    EXCHANGEPARTICULARSNEWS,
    MARKETTREND,
    ATTENTIONCURRECY
} from '../constants/index'

export const project = (state = {currencyInfo: {}, quotation: {}}, action) => {
    switch (action.type) {
        case CURRENCYINFO:
            return {...state, currencyInfo: {...action.currencyInfo}}
        case MARKETQUOTATION:
            return {...state, quotation: {...action.quotation}}
        default:
            return state
    }
}

// 行情相关新闻
const currencyParticulars = {
    code: 1,
    msg: 'ok',
    data: {
        id: 0, // 忽略
        'name': '', // 币名字
        'cn_name': '', // 中文名
        'en_name': '', // 英文名
        'symbol': '', // 标示符
        'icon': '', // 图标url
        'coin_id': '', // 币ID
        'available_supply': 0, // 流量数量
        'max_supply': 0, // 发行总量
        'rank': 0, // 排名
        'price_usd': 0, // 单价，单位美元
        'price_btc': 0, // 单价，单位比特币
        'volume_usd_24h': 0, // 24小时成交额
        'percent_change_24h': 0, // 24小时涨跌
        'btc_usd_price': 0, // 比特币对美元
        'low_price_in_24h': 0, // 24小时最低价
        'high_price_in_24h': 0, // 24小时最高价
        'websites': '', // 官网
        'explorer': '', // 区块站
        'release_time': 0, // 发行时间
        'mineable': false, // 是否可挖矿
        'marketcount': 0, // 交易所数量
        'description': '' // 描述
    }
}
const currencyParticularsPrice = {
    code: 1,
    msg: 'ok',
    data: {
        available_supply: '',
        coin_id: '',
        high_price_in_24h: '',
        low_price_in_24h: '',
        max_supply: '',
        percent_change_24h: '',
        price_usd: '',
        volume_usd_24h: ''
    }
}
export const currencyParticularsReducer = (state = currencyParticulars, action) => {
    switch (action.type) {
        case EXCHANGEPARTICULARS:
            return action.data
        case ATTENTIONCURRECY:
            state.data.ifCollect = 1 - state.data.ifCollect // 取非
            return Object.assign({}, state)
        default:
            return state
    }
}
export const currencyParticularsPriceReducer = (state = currencyParticularsPrice, action) => {
    switch (action.type) {
        case EXCHANGEPARTICULARSPRICE:
            return action.data
        default:
            return state
    }
}

const exchangeListInit = {
    'pageSize': 0,
    'recordCount': 0,
    'currentPage': 0,
    'pageNum': 0,
    'inforList': [
        {
            'id': 0,
            'coin_id': 'Loading',
            'rank': 0,
            'exchange_name': 'Loading',
            'pair': 'Loading',
            'volume_in_24h': 'Loading',
            'price': 'Loading',
            'volume_rate_24h': 'Loading',
            'updated': 'Loading'
        }
    ]
}
export const exchangeListReducer = (state = exchangeListInit, action) => {
    switch (action.type) {
        case GETEXCHANGELIST:
            return action.data
        default:
            return state
    }
}

const obj = {
    currentPage: 0,
    pageCount: 0,
    recordCount: 0,
    pageSize: 0,
    first: true,
    inforList: [{
        author: '',
        cateId: '',
        channelId: '',
        content: '',
        coverPic: '{"pc": "Loading", "wap_big": "Loading", "wap_small": "Loading"}',
        createTime: '',
        id: '',
        readCounts: '',
        recommend: '',
        source: '',
        status: '',
        synopsis: '',
        tags: '',
        title: '',
        updateTime: ''
    }]
}
export const currencyNewsReducer = (state = obj, action) => {
    switch (action.type) {
        case EXCHANGEPARTICULARSNEWS:
            if (!action.symbol) {
                return action.data.obj
            } else {
                let newsListMore = state
                let arr = newsListMore.inforList
                action.data.obj.inforList.map(function (item, i) {
                    arr.push(item)
                })
                return Object.assign({}, state, {inforList: arr})
            }
        default:
            return state
    }
}

export const getCoinTrend = (state = {market_cap: [], price_btc: [], price_usd: [], volume: []}, action) => {
    switch (action.type) {
        case MARKETTREND:
            let date = []
            let priceUsd = action.coinTrend.price_usd
            for (let i = 0; i < priceUsd.length; i++) {
                priceUsd[i][0] = priceUsd[i][0] * 1000
                date.push(priceUsd[i])
            }
            return {...state, price_usd: [...date]}
        default:
            return state
    }
}
