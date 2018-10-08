/**
 * Created by zhang on 2018/6/28.
 */
const express = require('express')
const router = express.Router()

const {
    pageRender,
    webInfo
} = require('../utils/public')

const mRes = (req, res, next) => {
    res.render('m-protocol', {
        webSiteInfo: {
            ...webInfo
        }
    })
}

router.get('/', (req, res, next) => {
    pageRender({
        req: req,
        res: res,
        mRender: () => {
            mRes(req, res, next)
        },
        pcRender: function () {
            res.redirect(`/index`)
        }
    })
})

module.exports = router
