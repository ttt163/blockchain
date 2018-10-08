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
    getHost
} = require('../utils/public')

router.get('/', function (req, res, next) {
    async function getData () {
        const data = await new Promise((resolve) => {
            let sendData = {
                type: 4,
                currentPage: 1,
                pageSize: 12,
                myPassportId: !req.cookies.hx_user_id ? '' : req.cookies.hx_user_id
            }
            axiosAjax({
                type: 'GET',
                url: ajaxJavaUrl + '/info/author/list',
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
            res.render('author', {
                domain: getHost(req),
                data: {...resData.obj},
                webSiteInfo: webInfo,
                typeClass: 'news'
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
})

module.exports = router
