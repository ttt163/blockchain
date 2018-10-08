const express = require('express')
const router = express.Router()

const {
    pageRender,
    getHost,
    webInfo
} = require('../utils/public')

const mRes = (req, res, next) => {
    const id = req.params.id
    res.render('m-chinaTour', {
        domain: getHost(req),
        urlId: id,
        webSiteInfo: {
            ...webInfo,
            title: '火星中国行-火星财经',
            keywords: '火星中国行-火星财经'
        }
    })
}

const pcRes = (req, res, next) => {
    const id = req.params.id
    res.render('chinaTour', {
        domain: getHost(req),
        urlId: id,
        webSiteInfo: {
            ...webInfo,
            title: '火星中国行-火星财经',
            keywords: '火星中国行-火星财经'
        }
    })
}

router.get('/', function (req, res, next) {
    pageRender({
        req: req,
        res: res,
        mRender: function () {
            res.redirect('/')
        },
        pcRender: function () {
            res.redirect('/')
        }
    })
})

router.get('/:id', function (req, res, next) {
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
