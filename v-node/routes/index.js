/**
 * Author：tantingting
 * Time：2018/4/23
 * Description：Description
 */

const express = require('express')
const router = express.Router()
let async = require('async')
const https = require('https')
const {
    axiosAjax,
    ajaxJavaUrl,
    webInfo,
    pageRender,
    getHost,
    fomartQuery
} = require('../utils/public')
const pcRes = (req, res, next) => {
    let userId = req.cookies.hx_user_id
    const hotColumn = (resolve) => {
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/topic/listall?currentPage=1&pageSize=3&position=0',
            params: {},
            res: res,
            fn: function (resData) {
                let thisData = []
                if (resData.code === 1) {
                    thisData = !resData.obj.inforList ? [] : resData.obj.inforList
                } else {
                    thisData = []
                }
                resolve(null, thisData)
            }
        })
    }
    const authorList = (resolve) => {
        let sendData = {
            currentPage: 1,
            pageSize: 40
        }
        if (!req.cookies.hx_user_id) {
            sendData = {...sendData}
        } else {
            sendData = {
                ...sendData,
                myPassportId: req.cookies.hx_user_id
            }
        }
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + `/info/author/showauthorlist`,
            params: sendData,
            res: res,
            fn: function (resData) {
                let thisData = []
                if (resData.code === 1) {
                    thisData = resData.obj.inforList
                } else {
                    thisData = []
                }
                resolve(null, thisData)
            }
        })
    }
    const adData = (resolve) => {
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/ad/showad?adPlace=1,2,3,5,4,8,9,10,11&type=1',
            params: {},
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
    const tagsData = (resolve) => {
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/news/getfooterinfo?type=2',
            params: {},
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
    const videoData = (resolve) => {
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/video/getrecommendlist?count=2',
            params: {},
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
    const activityData = (resolve) => {
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/homerecommend/gettypelist?position=1,2,8,9',
            params: {},
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
    const newsFlash = (resolve) => {
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/lives/showlives?currentPage=1&pageSize=10',
            params: {},
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
    /* const marketData = (resolve) => {
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
    } */
    const getUSD = (resolve) => {
        axiosAjax({
            type: 'get',
            url: ajaxJavaUrl + '/market/coin/financerate',
            params: {},
            res: res,
            fn: function (resData) {
                let thisData = null
                if (resData.code === 1) {
                    thisData = resData.data.legal_rate.CNY
                } else {
                    thisData = null
                }
                resolve(null, thisData)
            }
        })
    }
    const getRecommend = (resolve) => {
        let sendData = {
            refreshType: 1,
            passportId: !userId ? '' : userId,
            currentPage: 1,
            pageSize: 20
        }
        axiosAjax({
            type: 'post',
            url: ajaxJavaUrl + '/info/recommend/getnews',
            params: fomartQuery(sendData),
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
    // 火星号专栏新闻
    const getMarksNews = (resolve) => {
        let sendData = {
            currentPage: 1,
            pageSize: 20
        }
        axiosAjax({
            type: 'post',
            url: ajaxJavaUrl + '/info/news/column/list',
            params: sendData,
            res: res,
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
    async.parallel({
        hotColumn: function (callback) {
            // 处理逻辑
            hotColumn(callback)
            // callback(null, 'one')
        },
        authorList: function (callback) {
            // 处理逻辑
            authorList(callback)
        },
        adData: function (callback) {
            // 处理逻辑
            adData(callback)
        },
        tagsData: function (callback) {
            tagsData(callback)
        },
        videoData: function (callback) {
            videoData(callback)
        },
        activityData: function (callback) {
            activityData(callback)
        },
        newsFlash: function (callback) {
            newsFlash(callback)
        },
        // marketData: function (callback) {
        //     marketData(callback)
        // },
        getUSD: function (callback) {
            getUSD(callback)
        },
        getRecommend: function (callback) {
            getRecommend(callback)
        },
        marksNews: function (callback) {
            getMarksNews(callback)
        }
    }, function (error, result) {
        let promise = new Promise(function (resolve) {
            axiosAjax({
                type: 'get',
                url: ajaxJavaUrl + '/info/news/channels',
                params: {},
                res: res,
                fn: function (resData) {
                    if (resData.code === 1) {
                        resolve(resData.obj)
                    }
                }
            })
        })
        promise.then(function (value) {
            let id = []
            let thisDataNav = value
            value.map((item) => {
                id.push(item.channelId)
            })
            let sendData = {
                currentPage: 1,
                pageSize: 20,
                recommend: 1,
                channelIds: id.join(',')
            }
            axiosAjax({
                type: 'GET',
                url: ajaxJavaUrl + '/info/news/showtotalnews',
                params: sendData,
                res: res,
                fn: function (resData) {
                    let thisNewsData = []
                    if (resData.code === 1) {
                        thisNewsData = resData.obj
                        if (!error) {
                            let indexAdAndColumn = result.hotColumn
                            let newsObj = thisNewsData
                            let recommend = newsObj.recommend.inforList
                            delete newsObj['recommend']
                            let newsData = newsObj
                            let indexTagsData = result.tagsData.inforList
                            let indexVideoData = result.videoData
                            let indexActivityData = result.activityData
                            let indexNewsFlash = result.newsFlash.inforList
                            // let indexMarketData = result.marketData
                            let indexgetUSD = result.getUSD
                            let indexGetNav = thisDataNav
                            let recommendData = result.getRecommend
                            let resData = {
                                ...result,
                                userId: userId,
                                adAndColumn: indexAdAndColumn,
                                recommend: recommend,
                                newsData: newsData,
                                tagsDataList: indexTagsData,
                                videoDataList: indexVideoData,
                                activityData: indexActivityData,
                                newsFlash: indexNewsFlash,
                                // marketData: indexMarketData,
                                getUSD: indexgetUSD,
                                newNavData: indexGetNav,
                                recommendData: recommendData
                            }
                            // res.send(resData)
                            res.render('index', {
                                domain: getHost(req),
                                data: resData,
                                webSiteInfo: webInfo,
                                typeClass: 'index'
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
                    }
                }
            })
        })
    })
}

const mRes = (req, res, next) => {
    async function newsDetailData () {
        const data = await new Promise((resolve) => {
            let sendData = {
                currentPage: 1,
                pageSize: 20,
                channelId: 0
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

    newsDetailData().then((resData) => {
        if (resData.code === 1) {
            res.render('m-index', {
                domain: getHost(req),
                data: resData.obj,
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
            mRes(req, res, next)
        },
        pcRender: function () {
            pcRes(req, res, next)
        }
    })
})

router.get('/format', function (req, res, next) {
    let {imgUrl} = req.query

    let getImgP = async (url) => {
        return await new Promise((resolve, reject) => {
            let chunks = []
            let size = 0

            https.get(url, function (res) {
                if (!res) {
                    reject(res)
                    return
                }
                res.on('data', function (chunk) {
                    chunks.push(chunk)
                    size += chunk.length
                })
                res.on('end', function (err) {
                    let data = Buffer.concat(chunks, size)
                    let base64Img = data.toString('base64')
                    resolve(base64Img)
                })
            })
        })
    }

    getImgP(imgUrl).then((data) => {
        res.send(JSON.stringify({imgUrl: `data:image/jpeg;base64,${data}`}))
    }).catch(() => {
        res.send(JSON.stringify({imgUrl: ''}))
    })
})

module.exports = router
