/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */
import {
    CURRENCYINFO,
    EXCHANGEPARTICULARS,
    EXCHANGEPARTICULARSPRICE,
    GETEXCHANGELIST,
    EXCHANGEPARTICULARSNEWS,
    MARKETTREND,
    APIADDRESSMARKET,
    APIADDRESSINFO
} from '../constants/index'

import {axiosAjax} from '../public'

// 获取项目头部的相关信息
export const getCurrencyInfo = (data) => {
    return (
        (dispatch) => {
            axiosAjax('POST', APIADDRESSMARKET + '/coin/querycoins', {...data}, function (data) {
                const actionData = data.data
                dispatch({
                    type: CURRENCYINFO,
                    currencyInfo: actionData
                })
            })
        }
    )
}

// 行情相关新闻
// 货币介绍
export const getCurrencyParticulars = (coinId, passportId, fn) => {
    return (
        (dispatch) => {
            axiosAjax('get', APIADDRESSMARKET + '/coin/queryinfo', {
                coinid: coinId,
                passportId: passportId
            }, function (data) {
                dispatch({
                    type: EXCHANGEPARTICULARS,
                    data
                })
                if (fn) {
                    fn(data)
                }
            })
        }
    )
}
// 货币价格
export const getCurrencyParticularsPrice = (coinId) => {
    return (
        (dispatch) => {
            axiosAjax('get', APIADDRESSMARKET + '/coin/queryprice', {
                coinid: coinId
            }, function (data) {
                dispatch({
                    type: EXCHANGEPARTICULARSPRICE,
                    data
                })
            })
        }
    )
}

// 相关新闻
export const getCurrencyNews = (tags, currentPage, pageSize, symbol) => {
    return (dispatch) => {
        axiosAjax('GET', APIADDRESSINFO + '/news/relatednews1', {
            tags: tags,
            currentPage: currentPage,
            pageSize: pageSize
        }, function (data) {
            dispatch({
                type: EXCHANGEPARTICULARSNEWS,
                data,
                symbol
            })
        })
    }
}

// 获取交易所列表
export const getExchangeList = (coinId, currentPage, pageSize) => {
    return (dispatch) => {
        axiosAjax('GET', APIADDRESSMARKET + '/coin/exchange', {
            coinid: coinId,
            currentpage: currentPage,
            pagesize: pageSize
        }, function (data) {
            const actionData = data.data
            dispatch({
                type: GETEXCHANGELIST,
                data: actionData
            })
        })
    }
}

export const getMarketTrend = (data, fn) => {
    return (
        (dispatch) => {
            axiosAjax('GET', APIADDRESSMARKET + '/coin/graph', {...data}, function (data) {
                const actionData = data.data
                dispatch({
                    type: MARKETTREND,
                    coinTrend: actionData
                })
                fn && fn(actionData)
            })
        }
    )
}
