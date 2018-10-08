/**
 * @Author：liushaozong
 * @Time：2018-08-15 11 : 30
 * @Desc：activity
 */

const express = require('express')
const router = express.Router()
let async = require('async')

const {
    pageRender,
    getHost,
    axiosAjax,
    ajaxJavaUrl,
    fomartQuery
} = require('../utils/public')

const pcRes = (req, res, next) => {
    const getSite = (resolve) => {
        axiosAjax({
            type: 'post',
            url: ajaxJavaUrl + '/info/activity/getplacelist',
            params: {},
            res: res,
            fn: function (resData) {
                let thisData = []
                if (resData.code === 1) {
                    thisData = !resData.obj ? [] : resData.obj
                    let all = {
                        'place': '全部',
                        'rank': 'all',
                        'placeCount': ''
                    }
                    thisData.unshift(all)
                } else {
                    thisData = []
                }
                resolve(null, thisData)
            }
        })
    }
    const getAll = (resolve) => {
        let sendData = {
            place: 'all',
            timeType: 1,
            recommend: 0,
            currentPage: 1,
            pageSize: 9
        }
        axiosAjax({
            type: 'post',
            url: ajaxJavaUrl + '/info/activity/newlist',
            params: fomartQuery(sendData),
            res: res,
            fn: function (resData) {
                let thisData = []
                if (resData.code === 1) {
                    thisData = !resData.obj ? [] : resData.obj
                } else {
                    thisData = []
                }
                resolve(null, thisData)
            }
        })
    }
    const getRecommendImg = (resolve) => {
        let sendData = {
            place: 'all',
            timeType: 1,
            recommend: 1,
            currentPage: 1,
            pageSize: 10
        }
        axiosAjax({
            type: 'post',
            url: ajaxJavaUrl + '/info/activity/newlist',
            params: fomartQuery(sendData),
            res: res,
            fn: function (resData) {
                let thisData = []
                if (resData.code === 1) {
                    thisData = !resData.obj ? [] : resData.obj
                } else {
                    thisData = []
                }
                resolve(null, thisData)
            }
        })
    }
    async.parallel({
        getSite: function (callback) {
            getSite(callback)
        },
        getAll: function (callback) {
            getAll(callback)
        },
        getRecommendImg: function (callback) {
            getRecommendImg(callback)
        }
    }, function (error, result) {
        if (!error) {
            let siteList = result.getSite
            let allList = result.getAll
            let bannerImg = result.getRecommendImg
            let resData = {
                getSite: siteList,
                getAll: allList,
                getRecommendImg: bannerImg
            }
            res.render('activity', {
                domain: getHost(req),
                typeClass: 'activity',
                data: resData,
                webSiteInfo: {
                    title: '区块链活动-火星财经',
                    keywords: '区块链,比特币,以太坊,eos,莱特币,瑞波币,挖矿,数字货币,区块链是什么,区块链技术,什么是区块链,比特币行情,比特币价格,比特币是什么,比特币今日价格,coinmarketcap,王峰十问,新闻早八点"',
                    description: '精彩区块链互动，尽在火星财经。火星财经提供区块链峰会，线下聚会、技术峰会、火星中国行等活动。'
                }
            })
        }
    })
}

const mRes = (req, res, next) => {
    const getSite = (resolve) => {
        axiosAjax({
            type: 'post',
            url: ajaxJavaUrl + '/info/activity/getplacelist',
            params: {},
            res: res,
            fn: function (resData) {
                let thisData = []
                if (resData.code === 1) {
                    thisData = !resData.obj ? [] : resData.obj
                    let all = {
                        'place': '全部',
                        'rank': 'all',
                        'placeCount': ''
                    }
                    thisData.unshift(all)
                } else {
                    thisData = []
                }
                resolve(null, thisData)
            }
        })
    }
    const getAll = (resolve) => {
        let sendData = {
            place: 'all',
            timeType: 1,
            recommend: 0,
            currentPage: 1,
            pageSize: 9
        }
        axiosAjax({
            type: 'post',
            url: ajaxJavaUrl + '/info/activity/newlist',
            params: fomartQuery(sendData),
            res: res,
            fn: function (resData) {
                let thisData = []
                if (resData.code === 1) {
                    thisData = !resData.obj ? [] : resData.obj
                } else {
                    thisData = []
                }
                resolve(null, thisData)
            }
        })
    }
    const getRecommendImg = (resolve) => {
        let sendData = {
            place: 'all',
            timeType: 1,
            recommend: 1,
            currentPage: 1,
            pageSize: 10
        }
        axiosAjax({
            type: 'post',
            url: ajaxJavaUrl + '/info/activity/newlist',
            params: fomartQuery(sendData),
            res: res,
            fn: function (resData) {
                let thisData = []
                if (resData.code === 1) {
                    thisData = !resData.obj ? [] : resData.obj
                } else {
                    thisData = []
                }
                resolve(null, thisData)
            }
        })
    }
    async.parallel({
        getSite: function (callback) {
            getSite(callback)
        },
        getAll: function (callback) {
            getAll(callback)
        },
        getRecommendImg: function (callback) {
            getRecommendImg(callback)
        }
    }, function (error, result) {
        if (!error) {
            let siteList = result.getSite
            let allList = result.getAll
            let bannerImg = result.getRecommendImg
            let resData = {
                getSite: siteList,
                getAll: allList,
                getRecommendImg: bannerImg
            }
            res.render('m-activity', {
                domain: getHost(req),
                data: {
                    'searchId': 300,
                    'resData': resData
                },
                webSiteInfo: {
                    title: '区块链活动-火星财经',
                    keywords: '区块链,比特币,以太坊,eos,莱特币,瑞波币,挖矿,数字货币,区块链是什么,区块链技术,什么是区块链,比特币行情,比特币价格,比特币是什么,比特币今日价格,coinmarketcap,王峰十问,新闻早八点"',
                    description: '精彩区块链互动，尽在火星财经。火星财经提供区块链峰会，线下聚会、技术峰会、火星中国行等活动。'
                }
            })
        }
    })
}

router.get('/', function (req, res, next) {
    pageRender({
        req: req,
        res: res,
        mRender: function () {
            mRes(req, res, next)
        },
        pcRender: function () {
            pcRes(req, res, next)
        }
    })
})

module.exports = router
