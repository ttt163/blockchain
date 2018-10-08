/**
 * Author：yangbo
 * Time：2018/8/29 16:52
 * Description：marketStatistics.js
 */
const express = require('express')
const router = express.Router()
let async = require('async')

const {
    pageRender,
    getHost,
    getTDK,
    axiosAjax,
    ajaxJavaUrl
} = require('../utils/public')

const initFn = (req, res, next) => {
    const marketData = (resolve) => {
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/market/coin/summary',
            params: {},
            res: res,
            fn: function (resData) {
                let thisData = []
                if (resData.code === 1) {
                    thisData = resData.data
                } else {
                    thisData = null
                }
                resolve(null, thisData)
            }
        })
    }
    const getRate = (resolve) => {
        axiosAjax({
            type: 'get',
            url: ajaxJavaUrl + '/market/tickers/fiatmap',
            params: {},
            res: res,
            fn: function (resData) {
                let thisData = {}
                if (resData.code === 1) {
                    resData.data.map((item) => {
                        thisData['get' + item.quote] = item.price
                    })
                } else {
                    thisData = null
                }
                resolve(null, thisData)
            }
        })
    }
    const marketHeat = (resolve) => {
        axiosAjax({
            type: 'get',
            url: ajaxJavaUrl + '/market/tickers/total',
            params: {},
            res: res,
            fn: function (resData) {
                let thisData = null
                if (resData.code === 1) {
                    thisData = resData.data
                    thisData.current_price = thisData.cap_total - (thisData.cap_total / (1 + parseFloat(thisData.cap_change_percent_24h)))
                } else {
                    thisData = null
                }
                resolve(null, thisData)
            }
        })
    }
    async.parallel({
        marketData: function (callback) {
            marketData(callback)
        },
        getRate: function (callback) {
            getRate(callback)
        },
        marketHeat: function (callback) {
            marketHeat(callback)
        }
    }, function (error, result) {
        if (!error) {
            let data = {
                marketData: result.marketData,
                getRate: result.getRate,
                marketHeat: result.marketHeat,
                heatString: JSON.stringify(result.marketHeat)
            }

            res.render('marketStatistics', {
                domain: getHost(req),
                data,
                typeClass: 'data',
                webSiteInfo: getTDK('数据', '火星财经行情,火星行情,比特币行情,BTC行情,以太坊行情,EOS行情,数字货币行情', '火星财经致力于为区块链创业者以及数字货币投资者提供最新最及时的市场行情')
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
// const mRes = (req, res, next) => {
//     res.render('marketStatistics', {
//         domain: getHost(req),
//         webSiteInfo: getTDK('行情', '火星财经行情,火星行情,比特币行情,BTC行情,以太坊行情,EOS行情,数字货币行情', '火星财经致力于为区块链创业者以及数字货币投资者提供最新最及时的市场行情')
//     })
// }

const pcRes = (req, res, next) => {
    initFn(req, res, next)
}

router.get('/', function (req, res, next) {
    pageRender({
        req: req,
        res: res,
        mRender: function () {
            res.redirect('/')
        },
        pcRender: function () {
            pcRes(req, res, next)
        }
    })
})

module.exports = router
