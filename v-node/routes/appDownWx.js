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
    let newsId = req.params.id
    let sendData = {
        id: newsId,
    }
    axiosAjax({
        type: 'GET',
        url: ajaxJavaUrl + '/info/news/getbyid',
        params: sendData,
        res: res,
        fn: function (resData) {
            if (resData.code === 1) {
                let desData = resData.obj
                res.render('m-appDownWx', {
                    domain: getHost(req),
                    data: desData,
                    webSiteInfo: {
                        ...webInfo,
                        title: '火星财经',
                        keywords: '火星财经'
                    }
                })
            }
        }
    })

}

router.get('/:id', function (req, res, next) {
    pageRender({
        req: req,
        res: res,
        mRender: function () {
            mRes(req, res, next)
        }
    })
})
module.exports = router