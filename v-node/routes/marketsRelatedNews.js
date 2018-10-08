/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */

const express = require('express')
const router = express.Router()
let async = require('async')
const {
    axiosAjax,
    ajaxJavaUrl,
    getMarksWebInfo,
    getHost,
    formatPrice,
    numTrans
} = require('../utils/public')

/* GET home page. */
const getRes = (req, res, next) => {
    let name = ''
    let id = !req.params.id ? '' : req.params.id
    let tags = ''
    const getRelatedNews = (resolve, tags) => {
        let sendData = {
            currentPage: 1,
            pageSize: 10,
            tags: tags
        }
        axiosAjax({
            type: 'get',
            url: ajaxJavaUrl + `/info/news/relatednews1`,
            params: sendData,
            res: res,
            fn: function (resData) {
                let thisData = null
                if (resData.code === 1) {
                    thisData = resData.obj
                } else {
                    thisData = null
                }
                resolve(null, thisData)
            }
        })
    }
    const rateData = (resolve) => {
        axiosAjax({
            type: 'post',
            url: ajaxJavaUrl + '/market/coin/financerate',
            params: {},
            res: res,
            fn: function (resData) {
                let thisData = null
                if (resData.code === 1) {
                    thisData = resData.data.legal_rate
                } else {
                    thisData = null
                }
                resolve(null, thisData)
            }
        })
    }
    const getCoinInfo = (resolve) => {
        axiosAjax({
            type: 'get',
            url: ajaxJavaUrl + '/market/coin/queryinfo',
            params: {
                coinid: id,
                passportId: !req.cookies.hx_user_id ? '' : req.cookies.hx_user_id
            },
            res: res,
            fn: function (resData) {
                let thisData = null
                if (resData.code === 1) {
                    thisData = resData.data
                } else {
                    thisData = null
                }
                resolve(null, thisData)
            }
        })
    }
    const getCoinPrice = (resolve) => {
        axiosAjax({
            type: 'get',
            url: ajaxJavaUrl + '/market/coin/queryprice',
            params: {
                coinid: id
            },
            res: res,
            fn: function (resData) {
                let thisData = null
                if (resData.code === 1) {
                    thisData = resData.data
                } else {
                    thisData = null
                }
                resolve(null, thisData)
            }
        })
    }
    async.auto({
        rateData: function (callback) {
            // 处理逻辑
            rateData(callback)
        },
        coidInfo: function (callback) {
            getCoinInfo(callback)
        },
        obj: ['coidInfo', function (results, callback) {
            // obj: ['coidInfo', function (callback, results) {
            // 处理逻辑
            let coidName = ''
            if (results.coidInfo.cn_name) {
                coidName = results.coidInfo.cn_name
            } else if (results.coidInfo.en_name) {
                coidName = results.coidInfo.en_name
            } else {
                coidName = results.coidInfo.symbol
            }
            name = coidName
            console.log()
            // getRelatedNews(callback, coidName)
            tags = `${results.coidInfo.coin_id},${results.coidInfo.cn_name},${results.coidInfo.en_name}`
            console.log(tags)
            getRelatedNews(callback, tags)
        }],
        coidPrice: function (callback) {
            getCoinPrice(callback)
        }
    }, function (error, result) {
        if (!error) {
            // name = `${result.coidInfo.symbol + (result.coidInfo.cn_name ? ('-' + result.coidInfo.cn_name) : '')}`
            let rate = result.rateData.CNY
            let coidPrice = result.coidPrice
            let priceUsd = coidPrice.price_usd
            let availableSupply = numTrans(coidPrice.available_supply)
            let enStr = '＄'
            let cnStr = '￥'
            coidPrice = {
                ...coidPrice,
                price_usd_en: `${formatPrice(parseFloat(priceUsd))}`,
                price_usd_cn: `${formatPrice(parseFloat(priceUsd) * rate)}`,
                high_price_in_24h_en: !coidPrice.high_price_in_24h ? 'N/A' : `${enStr}${formatPrice(parseFloat(coidPrice.high_price_in_24h))}`,
                high_price_in_24h_cn: !coidPrice.high_price_in_24h ? 'N/A' : `${cnStr}${formatPrice(parseFloat(coidPrice.high_price_in_24h) * rate)}`,
                low_price_in_24h_en: !coidPrice.low_price_in_24h ? 'N/A' : `${enStr}${formatPrice(parseFloat(coidPrice.low_price_in_24h))}`,
                low_price_in_24h_cn: !coidPrice.low_price_in_24h ? 'N/A' : `${cnStr}${formatPrice(parseFloat(coidPrice.low_price_in_24h) * rate)}`,
                available_supply: `${availableSupply.value}${availableSupply.label}`, // 流通量
                available_supply_price_en: `${enStr}${numTrans(availableSupply.value * priceUsd).value}${numTrans(availableSupply.value * priceUsd).label}`,
                available_supply_price_cn: `${cnStr}${numTrans(availableSupply.value * priceUsd * parseFloat(rate)).value}${numTrans(availableSupply.value * priceUsd * parseFloat(rate)).label}`,
                volume_usd_24h_en: `${enStr}${numTrans(coidPrice.volume_usd_24h).value}${numTrans(coidPrice.volume_usd_24h * parseFloat(rate)).label}`,
                volume_usd_24h_cn: `${cnStr}${numTrans(coidPrice.volume_usd_24h * parseFloat(rate)).value}${numTrans(coidPrice.volume_usd_24h * parseFloat(rate)).label}`,
                max_supply: `${numTrans(coidPrice.max_supply).value}${numTrans(coidPrice.max_supply).label}`
            }
            let resData = {
                ...result,
                coidPrice: coidPrice,
                coinId: id,
                coinName: name
            }
            // res.send(resData)
            res.render('marketsRelateNews', {
                domain: getHost(req),
                data: resData,
                typeClass: 'markets',
                tags: tags,
                webSiteInfo: getMarksWebInfo(result.coidInfo.symbol, result.coidInfo.en_name, result.coidInfo.cn_name)
            })
        } else {
            console.log(error)
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
// router.get('/:tags/:id', function (req, res, next) {
router.get('/', function (req, res, next) {
    res.redirect('/markets')
})

router.get('/:id', function (req, res, next) {
    getRes(req, res, next)
})

module.exports = router
