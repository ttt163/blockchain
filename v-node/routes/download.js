/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */

const express = require('express')
const router = express.Router()

const {
    webInfo,
    getHost
} = require('../utils/public')

router.get('/', function (req, res, next) {
    res.render('download', {
        domain: getHost(req),
        data: {},
        typeClass: '',
        webSiteInfo: {
            ...webInfo,
            title: '火星财经App下载',
            keywords: `火星财经下载,火星财经，火星财经iOS，火星财经安卓，火星财经Android`,
            typeClass: ''
        }
    })
})

module.exports = router
