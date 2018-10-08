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
    webInfo,
    getHost,
    pageRender,
    getTDK
} = require('../utils/public')

/* GET home page. */
const pcRes = (req, res, next) => {
    let searchId = !req.params.id ? 0 : req.params.id
    let type = req.baseUrl
    const getNewsData = (resolve) => {
        let sendData = {
            currentPage: 1,
            pageSize: 10,
            channelId: searchId
        }
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/news/shownews',
            params: sendData,
            res: res,
            fn: function (resData) {
                if (resData.code === 1) {
                    resolve(null, resData.obj)
                }
            }
        })
    }
    const newsNav = (resolve) => {
        axiosAjax({
            type: 'get',
            url: ajaxJavaUrl + '/info/news/channels',
            params: {},
            res: res,
            fn: function (resData) {
                if (resData.code === 1) {
                    let thisDataNav = []
                    thisDataNav = resData.obj
                    thisDataNav.unshift({
                        id: 100,
                        channelId: 0,
                        channelName: '头条',
                        rank: 20,
                        updateTime: 1531823007000,
                        createTime: 1531822853000
                    })
                    resolve(null, thisDataNav)
                }
            }
        })
    }
    async.parallel({
        newsNav: function (callback) {
            // 处理逻辑
            newsNav(callback)
        },
        getNewsData: function (callback) {
            // 处理逻辑
            getNewsData(callback)
        }
    }, function (error, result) {
        if (!error) {
            let newsNav = result.newsNav
            let getNewsData = result.getNewsData
            let resData = {
                ...result,
                newsNav: newsNav,
                getNewsData: getNewsData,
                searchId: searchId
            }
            res.render('news', {
                domain: getHost(req),
                newsData: resData,
                webSiteInfo: getTDK('新闻', '火星财经新闻,火星新闻,比特币新闻,BTC新闻,以太坊新闻,EOS新闻,数字货币新闻', '今日新闻、王峰十问、火星八点、火星社区、独家原创等众多栏目为您提供专业新闻资讯服务'),
                typeClass: type,
                searchId: searchId
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

const mRes = (req, res, next) => {
    let searchId = !req.params.id ? 0 : req.params.id

    async function getData () {
        const data = await new Promise((resolve) => {
            let sendData = {
                currentPage: 1,
                pageSize: 20,
                channelId: searchId
            }
            axiosAjax({
                type: 'GET',
                url: ajaxJavaUrl + '/info/news/shownews',
                params: sendData,
                res: res,
                fn: function (resData) {
                    resolve(resData)
                }
            })
        })

        return data
    }

    getData().then((resData) => {
        if (resData.code === 1) {
            // res.send(resData)
            res.render('m-news', {
                domain: getHost(req),
                data: {...resData.obj, searchId: searchId},
                webSiteInfo: webInfo
            })
        } else {
            res.render('error', {
                message: resData.msg,
                error: {
                    status: resData.code,
                    stack: 'Please pass the correct parameters.'
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
            res.redirect('/')
        },
        pcRender: function () {
            pcRes(req, res, next)
        }
    })
})

router.get('/:id', function (req, res, next) {
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
