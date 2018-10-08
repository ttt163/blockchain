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
    getHotWebInfo,
    getHost
} = require('../utils/public')

/* GET home page. */
const hotRes = (req, res, next) => {
    let tags = !req.params.tags ? '' : req.params.tags
    let id = !req.params.id ? '' : req.params.id
    const getData = (resolve) => {
        let sendData = {
            currentPage: 1,
            pageSize: 20,
            tags: tags
        }
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/news/relatednews1',
            params: sendData,
            res: res,
            fn: function (resData) {
                resolve(null, resData.obj)
            }
        })
    }
    const getTopicInfo = (resolve) => {
        if (!id) {
            resolve(null, null)
            return
        }
        let sendData = {
            id: id
        }
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/topic/querytopic',
            params: sendData,
            res: res,
            fn: function (resData) {
                resolve(null, resData.obj)
            }
        })
    }
    async.parallel({
        obj: function (callback) {
            // 处理逻辑
            getData(callback)
        },
        info: function (callback) {
            // 处理逻辑
            getTopicInfo(callback)
        }
    }, function (error, result) {
        if (!error) {
            let data = {
                ...result.obj,
                currentTime: new Date().getTime(),
                queryTags: tags,
                queryId: id
            }
            // res.send(data)
            res.render('hotNews', {
                domain: getHost(req),
                data: data,
                info: result.info,
                webSiteInfo: getHotWebInfo(tags, !result.info ? '' : result.info.topicName),
                typeClass: 'hot',
                tags: req.params.tags
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
    res.redirect('/')
})

router.get('/:tags', function (req, res, next) {
    hotRes(req, res, next)
})
router.get('/:tags/:id', function (req, res, next) {
    hotRes(req, res, next)
})

module.exports = router
