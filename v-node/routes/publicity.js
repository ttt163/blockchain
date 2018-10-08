const express = require('express')
const router = express.Router()

const {
    getHost,
    pageRender
} = require('../utils/public')

const mRes = (req, res, next) => {
    let pathname = req.originalUrl
    res.render('m-publicity', {
        domain: getHost(req),
        originalUrl: pathname,
        webSiteInfo: {
            title: '火星特训营——赋能区块链的破局者',
            keywords: '火星特训营——“链”接世界，赋能区块链时代的破局者。打破认知边界，跑赢未来市场。',
            description: '火星特训营——“链”接世界，赋能区块链时代的破局者。打破认知边界，跑赢未来市场。'
        }
    })
}

const pcRes = (req, res, next) => {
    let pathname = req.originalUrl
    let reg = /\/mtc([0-9])?/
    let rootId = reg.exec(pathname)[1] ? reg.exec(pathname)[1] : ''
    res.render('pc-publicity', {
        domain: getHost(req),
        originalUrl: pathname,
        rootId,
        webSiteInfo: {
            title: '火星特训营——赋能区块链的破局者',
            keywords: '火星特训营——“链”接世界，赋能区块链时代的破局者。打破认知边界，跑赢未来市场。',
            description: '火星特训营——“链”接世界，赋能区块链时代的破局者。打破认知边界，跑赢未来市场。'
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
