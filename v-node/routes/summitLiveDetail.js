const express = require('express')
const router = express.Router()
let async = require('async')
const {
    pageRender,
    getHost,
    webInfo,
    axiosAjax,
    ajaxJavaUrl
} = require('../utils/public')
let topictdk = {
    title: '硅谷峰会-火星财经',
    description: '火星区块链硅谷峰会，暨首届中美区块链领袖高峰对话'
}
const pcRes = (req, res, next) => {
    let recommendType = `2,3`
    const getRecommend = (resolve) => {
        let sendData = {
            type: 'ggfh',
            recommend: recommendType
        }
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/specialtopic/list',
            params: sendData,
            res: res,
            // formData: true,
            fn: function (resData) {
                // console.log(resData)
                let thisData = []
                if (resData.code === 1) {
                    thisData = resData.obj
                } else {
                    thisData = null
                }
                resolve(null, thisData)
            }
        })
    }
    async.parallel({
        recommend: function (callback) {
            // 处理逻辑
            getRecommend(callback)
        }
    }, function (error, result) {
        // res.send(result)
        let tppeArr = recommendType.split(',')
        // 底部大图
        let largeImg = !result.recommend[tppeArr[0]] || !result.recommend[tppeArr[0]].length ? [] : result.recommend[tppeArr[0]]
        // 底部小图
        let smallImg = !result.recommend[tppeArr[1]] || !result.recommend[tppeArr[1]].length ? [] : result.recommend[tppeArr[1]]
        if (!error) {
            let data = {
                liveId: req.params.id,
                largeImg: largeImg,
                smallImg: smallImg
            }
            // res.send(data)
            res.render('summitLiveDetail', {
                domain: getHost(req),
                data: data,
                typeClass: '',
                webSiteInfo: {
                    ...webInfo,
                    ...topictdk
                }
            })
        } else {
            res.render('error', {
                message: error.message,
                error: {
                    status: error.code,
                    stack: 'Please pass the correct parameters.'
                }
            })
        }
    })
}

const mRes = (req, res, next) => {
    let dataId = {
        castId: req.params.id
    }
    console.log(dataId)

    res.render('m-summitLiveDetail', {
        domain: getHost(req),
        data: dataId,
        webSiteInfo: {
            ...webInfo,
            ...topictdk
        }
    })
}

router.get('/', function (req, res, next) {
    pageRender({
        req: req,
        redirect: true,
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
