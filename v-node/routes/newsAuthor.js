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

router.get('/', function (req, res, next) {
    res.redirect('/')
})
router.get('/:id', function (req, res, next) {
    let userId = !req.params.id ? '' : req.params.id
    const getData = (resolve) => {
        let sendData = {
            currentPage: 1,
            pageSize: 10,
            passportId: userId,
            status: 1
        }
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/news/showcolumnlist',
            params: sendData,
            res: res,
            fn: function (resData) {
                resolve(null, resData.obj)
            }
        })
    }
    const getAuthorInfo = (resolve) => {
        let sendData = {
            passportId: userId,
            myPassportId: !req.cookies.hx_user_id ? '' : req.cookies.hx_user_id
        }
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/news/getauthorinfo',
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
            getAuthorInfo(callback)
        }
    }, function (error, result) {
        if (!error) {
            let data = {
                ...result.obj,
                currentTime: new Date().getTime(),
                userId: userId
            }
            res.render('newsAuthor', {
                domain: getHost(req),
                data: data,
                typeClass: 'news',
                webSiteInfo: {
                    ...webInfo,
                    title: `${result.info.nickName}_火星专栏_火星财经`,
                    keywords: !result.obj.inforList || !result.obj.inforList[0] || !result.obj.inforList[0].tags ? `${result.info.nickName}，火星专栏，火星财经` : `${result.obj.inforList[0].tags},${result.info.nickName}，火星专栏，火星财经`,
                    description: `${!result.info.introduce ? webInfo.description : result.info.introduce}`
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
})

module.exports = router
