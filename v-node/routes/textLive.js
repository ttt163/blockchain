const express = require('express')
const router = express.Router()

const {
    pageRender,
    getHost,
    webInfo
} = require('../utils/public')

const pcRes = (req, res, next) => {
    res.render('m-liveList', {
        domain: getHost(req),
        typeClass: '',
        webSiteInfo: {
            ...webInfo,
            title: '文字直播-火星财经',
            keywords: '文字直播-火星财经'
        }
    })
}

const mRes = (req, res, next) => {
    res.render('m-liveList', {
        domain: getHost(req),
        webSiteInfo: {
            ...webInfo,
            title: '文字直播-火星财经',
            keywords: '文字直播-火星财经'
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
