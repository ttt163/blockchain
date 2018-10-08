/**
 * Author：tantingting
 * Time：2018/4/27
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
    let cookies = req.cookies
    async function getData () {
        const data = await new Promise((resolve) => {
            axiosAjax({
                type: 'GET',
                url: ajaxJavaUrl + '/mgr/marstrainenroll/list',
                params: {
                    pageSize: 1000,
                    activityType: 1
                },
                res: res,
                fn: function (resData) {
                    resolve(resData)
                }
            })
        })

        return data
    }
    getData().then((resData) => {
        let dataArr = resData.obj.inforList
        if (cookies.apply_userName !== 'huoxing24') {
            res.render('applyList', {
                dataList: false
            })
        } else if (cookies.apply_userPass !== 'huoxing24_2018**') {
            res.render('applyList', {
                dataList: false
            })
        } else if (cookies.apply_userName === 'huoxing24' && cookies.apply_userPass === 'huoxing24_2018**') {
            if (resData.code === 1) {
                res.render('applyList', {
                    domain: getHost(req),
                    dataList: dataArr,
                    webSiteInfo: {
                        ...webInfo,
                        title: '火星训练营',
                        keywords: '火星快讯，快讯速递，数字货币快讯，比特币快讯，以太坊快讯'
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
        }
    })
})

module.exports = router
