/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */
const express = require('express')
const router = express.Router()

const {
    axiosAjax,
    ajaxJavaUrl,
    webInfo,
    getHost,
    pageRender,
    getTime,
    getTimeContent,
    formatTime
} = require('../utils/public')

/* GET home page. */
const pcRes = (req, res, next) => {
    let userId = !req.cookies.hx_user_id ? '' : req.cookies.hx_user_id
    let videoId = !req.params.id ? 0 : req.params.id
    let publishTime = !req.params.time ? 0 : req.params.time
    async function getData () {
        const data = await new Promise((resolve) => {
            let sendData = {
                id: videoId,
                publishTime: publishTime,
                passportId: userId
            }
            axiosAjax({
                type: 'GET',
                url: ajaxJavaUrl + '/info/video/getvideocontext',
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
            // let detObj = resData.obj
            if (resData.obj.pre) {
                var preTime = getTime((resData.obj.pre.createTime), (new Date().getTime()), '刚刚', '分钟前', '小时前')
            }
            if (resData.obj.next) {
                var nextTime = getTime((resData.obj.next.createTime), (new Date().getTime()), '刚刚', '分钟前', '小时前')
            }
            let currData = resData.obj.current
            let data = {
                ...resData.obj,
                videoTime: [preTime, nextTime],
                current: {
                    ...currData,
                    publishDate: formatTime(currData.publishTime)
                }
            }
            // res.send(data)
            res.render('videoDetails', {
                domain: getHost(req),
                newsData: data,
                typeClass: 'video',
                webSiteInfo: {
                    ...webInfo,
                    title: `${currData.title}_火星财经`,
                    keywords: `${currData.tags}，${currData.title}`,
                    description: currData.content
                }
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

const mRes = (req, res, next) => {
    let videoId = !req.params.id ? 0 : req.params.id
    let publishTime = !req.params.time ? 0 : req.params.time
    async function getData () {
        const data = await new Promise((resolve) => {
            let sendData = {
                id: videoId,
                publishTime: publishTime
            }
            axiosAjax({
                type: 'GET',
                url: ajaxJavaUrl + '/info/video/getvideocontext',
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
            let currData = resData.obj.current
            let createTimeCont = getTimeContent((currData.createTime), (new Date().getTime()))
            currData = {...currData, createTimeCont: createTimeCont}
            let data = {...resData.obj, current: currData, searchId: '200'}
            // res.send(data)
            res.render('m-videoDetail', {
                domain: getHost(req),
                data: data,
                webSiteInfo: {
                    ...webInfo,
                    title: `${currData.title}_火星财经`,
                    keywords: `${currData.tags}，${currData.title}`,
                    description: currData.content
                }
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
            res.redirect('/video')
        },
        pcRender: function () {
            res.redirect('/video')
        }
    })
})

router.get('/:id', function (req, res, next) {
    pageRender({
        req: req,
        res: res,
        mRender: function () {
            res.redirect('/video')
        },
        pcRender: function () {
            res.redirect('/video')
        }
    })
})

router.get('/:id/:time', function (req, res, next) {
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
