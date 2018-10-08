/**
 * Author：yangbo
 * Time：2018/8/24 11:52
 * Description：coinEncyclopedia.js
 */

const express = require('express')
const router = express.Router()
const async = require('async')

const {
    webInfo,
    getHost,
    ajaxJavaUrl,
    axiosAjax,
    GetLength
} = require('../utils/public')

const initFn = (req, res) => {
    let {full_name, symbol} = req.query
    let sendData = {
        full_name,
        symbol
    }

    const coinBase = (resolve) => {
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/market/tickers/coin/basic',
            params: sendData,
            res: res,
            fn: function (resData) {
                resolve(null, resData)
            }
        })
    }
    const coinInfo = (resolve) => {
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/market/tickers/coin/performance',
            params: sendData,
            res: res,
            fn: function (resData) {
                resolve(null, resData)
            }
        })
    }
    const getRate = (resolve) => {
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/market/tickers/fiatmap',
            params: {},
            res: res,
            fn: function (resData) {
                resolve(null, resData)
            }
        })
    }
    async.parallel({
        coinBase: function (callback) {
            coinBase(callback)
        },
        coinInfo: function (callback) {
            coinInfo(callback)
        },
        getRate: function (callback) {
            getRate(callback)
        }
    }, function (error, result) {
        let CNY = 1
        result.getRate.data.map((item) => {
            if (item.base === 'USD' && item.quote === 'CNY') {
                CNY = item.price
            }
        })
        result.coinBase.data.zh_descriptions && (result.coinBase.data.desLen = GetLength(result.coinBase.data.zh_descriptions))
        result.coinBase.data.zh_team_info && (result.coinBase.data.teamLen = GetLength(result.coinBase.data.zh_team_info))
        if (!error) {
            res.render('m-coinEncyclopedia', {
                domain: getHost(req),
                coinInfo: result.coinInfo.data,
                coinBase: result.coinBase.data,
                CNY,
                webSiteInfo: {
                    ...webInfo,
                    title: `火星财经-${symbol}币百科`,
                    keywords: `火星财经下载,火星财经，火星财经iOS，火星财经安卓，火星财经Android`
                }
            })
        } else {
            res.render('error', {
                message: error.message,
                error: {
                    status: error.code,
                    stack: 'Please pass the correct parameters.'
                }
            })
        }
    })
}

router.get('/', function (req, res, next) {
    initFn(req, res, next)
})

module.exports = router
