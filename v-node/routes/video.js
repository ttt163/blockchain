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
    getTDK
} = require('../utils/public')

/* GET home page. */
const pcRes = (req, res, next) => {
    async function getData () {
        const data = await new Promise((resolve) => {
            let sendData = {
                currentPage: 1,
                pageSize: 12
            }
            axiosAjax({
                type: 'GET',
                url: ajaxJavaUrl + '/info/video/getvideolist',
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
        let timeData = []
        for (let i = 0; i < resData.obj.inforList.length; i++) {
            timeData.push(getTime((resData.obj.inforList[i].publishTime), (new Date().getTime()), '刚刚', '分钟前', '小时前'))
        }
        if (resData.code === 1) {
            // res.send(resData)
            res.render('video', {
                domain: getHost(req),
                newsData: {...resData.obj, videoData: resData.obj, videoTime: timeData},
                webSiteInfo: getTDK('视频', '火星财经视频,火星视频,比特币视频,BTC视频,以太坊视频,EOS视频,数字货币视频', '火星财经致力于为区块链创业者以及数字货币投资者提供最新最实用的视频教程、视频解读与视频新闻'),
                typeClass: 'video'
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
    async function getData () {
        const data = await new Promise((resolve) => {
            let sendData = {
                currentPage: 1,
                pageSize: 12
            }
            axiosAjax({
                type: 'GET',
                url: ajaxJavaUrl + '/info/video/getvideolist',
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
            let timeData = []
            for (let i = 0; i < resData.obj.inforList.length; i++) {
                timeData.push(getTime((resData.obj.inforList[i].publishTime), (new Date().getTime()), '刚刚', '分钟前', '小时前'))
            }
            let data = {...resData.obj, searchId: '200', createTimeCont: timeData}
            console.log(data)
            res.render('m-video', {
                domain: getHost(req),
                data: data,
                webSiteInfo: {
                    ...webInfo
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
            mRes(req, res, next)
        },
        pcRender: function () {
            pcRes(req, res, next)
        }
    })
})

module.exports = router
