const express = require('express')
const router = express.Router()

const {
    pageRender,
    getHost,
    webInfo,
    axiosAjax,
    ajaxJavaUrl
} = require('../utils/public')

const mRes = (req, res, next) => {
    res.render('m-appDown', {
        domain: getHost(req),
        webSiteInfo: {
            ...webInfo,
            title: '火星财经',
            keywords: '火星财经'
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
            mRes(req, res, next)
        }
    })
})

module.exports = router