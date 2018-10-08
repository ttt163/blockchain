const express = require('express')
const router = express.Router()

const {
    pageRender,
    getHost,
    webInfo
} = require('../utils/public')

const mRes = (req, res, next) => {
    res.render('m-apply', {
        domain: getHost(req),
        webSiteInfo: {
            ...webInfo,
            title: '火星特训营报名入口',
            keywords: '火星特训营——“链”接世界，赋能区块链时代的破局者。打破认知边界，跑赢未来市场。'
        }
    })
}

const pcRes = (req, res, next) => {
    res.render('pc-apply', {
        domain: getHost(req),
        webSiteInfo: {
            ...webInfo,
            title: '火星特训营报名入口',
            keywords: '火星特训营——“链”接世界，赋能区块链时代的破局者。打破认知边界，跑赢未来市场。'
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
