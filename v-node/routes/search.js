/**
 * Author: yangbo
 * Time: 2018-05-17 11:26:26
 * Description: Description
 */
const express = require('express')
const router = express.Router()
const {
    axiosAjax,
    ajaxJavaUrl,
    getHost,
    pageRender,
    webInfo
} = require('../utils/public')

const pcRes = (req, res, next) => {
    let searchVal = !req.params.val ? '' : req.params.val
    async function getData () {
        const data = await new Promise((resolve) => {
            let sendData = {
                page: 1,
                pageSize: 18,
                type: 1,
                q: searchVal
            }
            axiosAjax({
                type: 'complexpost',
                url: ajaxJavaUrl + '/info/news/multisearch',
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
            let data = {
                ...resData.obj,
                currentTime: !resData.obj.currentTime ? new Date().getTime() : resData.obj.currentTime,
                searchVal: searchVal,
                searchType: 1
            }
            // res.send(data)
            res.render('search', {
                domain: getHost(req),
                data: data,
                webSiteInfo: webInfo,
                typeClass: ''
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
    async function searchHot () {
        const data = await new Promise((resolve) => {
            axiosAjax({
                type: 'POST',
                url: ajaxJavaUrl + '/info/news/gethotkey',
                params: {},
                res: res,
                fn: function (resData) {
                    resolve(resData)
                }
            })
        })

        return data
    }

    searchHot().then((resData) => {
        if (resData.code === 1) {
            res.render('m-search', {
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
router.get('/:val', function (req, res, next) {
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
