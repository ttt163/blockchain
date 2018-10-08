/**
 * Author：tantingting
 * Time：2018/4/23
 * Description：Description
 */

const express = require('express')
const router = express.Router()
let async = require('async')
const {
    axiosAjax,
    ajaxJavaUrl,
    webInfo,
    pageRender,
    getHost
} = require('../utils/public')

let topictdk = {
    title: '火星区块链（纽约）峰会-Mars Finance Blockchain Summit NYC-火星财经',
    description: '火星区块链纽约峰会，中美区块链领袖高峰对话'
}

let newsTags = '纽约峰会'

const pcRes = (req, res, next) => {
    let recommendType = `1,2,3`
    const getRecommend = (resolve) => {
        let sendData = {
            type: 'nyfh',
            recommend: recommendType
        }
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/specialtopic/list',
            params: sendData,
            res: res,
            // formData: true,
            fn: function (resData) {
                // console.log(resData)
                let thisData = []
                if (resData.code === 1) {
                    thisData = resData.obj
                } else {
                    thisData = null
                }
                resolve(null, thisData)
            }
        })
    }
    const getLives = (resolve) => {
        let sendData = {
            currentPage: 1,
            pageSize: 999,
            channelId: 11
        }
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/lives/showlives',
            params: {...sendData},
            res: res,
            fn: function (resData) {
                let thisData = []
                if (resData.code === 1) {
                    thisData = resData.obj
                } else {
                    thisData = null
                }
                resolve(null, thisData)
            }
        })
    }
    const getNews = (resolve) => {
        let sendData = {
            tags: newsTags,
            currentPage: 1,
            pageSize: 12
        }
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/news/relatednews1',
            params: sendData,
            res: res,
            fn: function (resData) {
                let thisData = []
                if (resData.code === 1) {
                    thisData = resData.obj
                } else {
                    thisData = null
                }
                resolve(null, thisData)
            }
        })
    }
    async.parallel({
        recommend: function (callback) {
            // 处理逻辑
            getRecommend(callback)
            // callback(null, 'one')
        },
        lives: function (callback) {
            getLives(callback)
        },
        news: function (callback) {
            getNews(callback)
        }
    }, function (error, result) {
        // res.send(result)
        let tppeArr = recommendType.split(',')
        // 顶部推荐
        let recommend = !result.recommend[tppeArr[0]] || !result.recommend[tppeArr[0]].length ? [] : result.recommend[tppeArr[0]]
        // 底部大图
        let largeImg = !result.recommend[tppeArr[1]] || !result.recommend[tppeArr[1]].length ? [] : result.recommend[tppeArr[1]]
        // 底部小图
        let smallImg = !result.recommend[tppeArr[2]] || !result.recommend[tppeArr[2]].length ? [] : result.recommend[tppeArr[2]]
        if (!error) {
            let data = {
                recommend: recommend,
                largeImg: largeImg,
                smallImg: smallImg,
                lives: !result.lives.inforList || !result.lives.inforList.length ? [] : result.lives.inforList,
                news: result.news,
                tags: newsTags
            }
            // res.send(data)
            res.render('summitNycTopic', {
                domain: getHost(req),
                data: data,
                webSiteInfo: {
                    ...webInfo,
                    ...topictdk
                },
                typeClass: 'news'
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
    let recommendType = `1`
    const getRecommend = (resolve) => {
        let sendData = {
            type: 'nyfh',
            recommend: recommendType
        }
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/specialtopic/list',
            params: sendData,
            res: res,
            // formData: true,
            fn: function (resData) {
                // console.log(resData)
                let thisData = []
                if (resData.code === 1) {
                    thisData = resData.obj
                } else {
                    thisData = null
                }
                resolve(null, thisData)
            }
        })
    }
    const getLives = (resolve) => {
        let sendData = {
            currentPage: 1,
            pageSize: 999,
            channelId: 11
        }
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/lives/showlives',
            params: sendData,
            res: res,
            fn: function (resData) {
                let thisData = []
                if (resData.code === 1) {
                    thisData = resData.obj
                } else {
                    thisData = null
                }
                resolve(null, thisData)
            }
        })
    }
    const getNews = (resolve) => {
        let sendData = {
            tags: newsTags,
            currentPage: 1,
            pageSize: 12
        }
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/news/relatednews1',
            params: sendData,
            res: res,
            fn: function (resData) {
                let thisData = []
                if (resData.code === 1) {
                    thisData = resData.obj
                } else {
                    thisData = null
                }
                resolve(null, thisData)
            }
        })
    }
    async.parallel({
        recommend: function (callback) {
            // 处理逻辑
            getRecommend(callback)
            // callback(null, 'one')
        },
        lives: function (callback) {
            getLives(callback)
        },
        news: function (callback) {
            getNews(callback)
        }
    }, function (error, result) {
        // res.send(result)
        let tppeArr = recommendType.split(',')
        // 顶部推荐
        let recommend = !result.recommend[tppeArr[0]] || !result.recommend[tppeArr[0]].length ? [] : result.recommend[tppeArr[0]]
        if (!error) {
            let data = {
                recommend: recommend,
                lives: !result.lives.inforList || !result.lives.inforList.length ? [] : result.lives.inforList,
                news: result.news,
                tags: newsTags
            }
            // res.send(data)
            res.render('m-summitNycTopic', {
                domain: getHost(req),
                data: data,
                webSiteInfo: {
                    ...webInfo,
                    ...topictdk
                },
                typeClass: 'news'
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

const pcLive = (req, res, next) => {
    res.render('summitLive', {
        domain: getHost(req),
        webSiteInfo: {
            ...webInfo,
            ...topictdk
        },
        typeClass: 'news'
    })
}

const mLive = (req, res, next) => {
    res.render('m-summitLive', {
        domain: getHost(req),
        webSiteInfo: {
            ...webInfo,
            ...topictdk
        },
        typeClass: 'news'
    })
}

router.get('/', function (req, res, next) {
    pageRender({
        req: req,
        res: res,
        mRender: function () {
            // res.redirect('http://m.huoxing24.com/liveDetail/20180827104056328239')
            mRes(req, res, next)
        },
        pcRender: function () {
            // res.redirect('http://www.huoxing24.com/liveDetail/20180827104056328239')
            pcRes(req, res, next)
        }
    })
})
router.get('/NY2018', function (req, res, next) {
    pageRender({
        req: req,
        res: res,
        mRender: function () {
            // res.redirect('http://m.huoxing24.com/liveDetail/20180827104056328239')
            mRes(req, res, next)
        },
        pcRender: function () {
            // res.redirect('http://www.huoxing24.com/liveDetail/20180827104056328239')
            pcRes(req, res, next)
        }
    })
})
router.get('/live', function (req, res, next) {
    pageRender({
        req: req,
        res: res,
        mRender: function () {
            mLive(req, res, next)
        },
        pcRender: function () {
            pcLive(req, res, next)
        }
    })
})

module.exports = router
