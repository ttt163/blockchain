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
    getHost
} = require('../utils/public')

/* GET home page. */
const hotRes = (req, res, next) => {
    const getData = (resolve) => {
        let sendData = {
            currentPage: 1,
            pageSize: 15,
            orderType: 0
        }
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/topic/gettopicpage',
            params: sendData,
            res: res,
            fn: function (resData) {
                resolve(null, resData.obj)
            }
        })
    }
    const getRecommend = (resolve) => {
        let sendData = {
            currentPage: 1,
            pageSize: 5
        }
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/topic/recommend',
            params: sendData,
            res: res,
            fn: function (resData) {
                resolve(null, !resData.obj || !resData.obj.inforList ? [] : resData.obj.inforList)
            }
        })
    }
    async.parallel({
        obj: function (callback) {
            // 处理逻辑
            getData(callback)
        },
        recommend: function (callback) {
            // 处理逻辑
            getRecommend(callback)
        }
    }, function (error, result) {
        if (!error) {
            let data = {
                ...result.obj,
                orderType: 0
            }
            // res.send(data)
            res.render('hotNewsList', {
                domain: getHost(req),
                data: data,
                recommend: result.recommend,
                typeClass: 'subject',
                webSiteInfo: {
                    ...webInfo
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
// router.get('/:tags/:id', function (req, res, next) {
router.get('/', function (req, res, next) {
    hotRes(req, res, next)
})

// router.get('/:tags', function (req, res, next) {
//     hotRes(req, res, next)
// })
// router.get('/:tags/:id', function (req, res, next) {
//     hotRes(req, res, next)
// })

module.exports = router
