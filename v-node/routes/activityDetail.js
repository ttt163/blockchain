/**
 * @Author：liushaozong
 * @Time：2018-08-15 11 : 30
 * @Desc：activity
 */

const express = require('express')
const router = express.Router()

const {
    pageRender,
    getHost,
    axiosAjax,
    ajaxJavaUrl,
    fomartQuery
} = require('../utils/public')

const pcRes = (req, res, next) => {
    let id = req.params.id
    let sendData = {
        id: id
    }
    axiosAjax({
        type: 'post',
        url: ajaxJavaUrl + '/info/activity/getbyid',
        params: fomartQuery(sendData),
        res: res,
        fn: function (resData) {
            if (resData.code === 1) {
                let desData = resData.obj
                res.render('activityDetail', {
                    domain: getHost(req),
                    typeClass: 'activity',
                    data: desData,
                    webSiteInfo: {
                        title: desData.title,
                        keywords: '区块链,比特币,以太坊,eos,莱特币,瑞波币,挖矿,数字货币,区块链是什么,区块链技术,什么是区块链,比特币行情,比特币价格,比特币是什么,比特币今日价格,coinmarketcap,王峰十问,新闻早八点"',
                        description: '精彩区块链互动，尽在火星财经。火星财经提供区块链峰会，线下聚会、技术峰会、火星中国行等活动。'
                    }
                })
            }
        }
    })
}

const mRes = (req, res, next) => {
    let id = req.params.id
    let sendData = {
        id: id
    }
    axiosAjax({
        type: 'post',
        url: ajaxJavaUrl + '/info/activity/getbyid',
        params: fomartQuery(sendData),
        res: res,
        fn: function (resData) {
            if (resData.code === 1) {
                let desData = resData.obj
                res.render('m-activityDetail', {
                    domain: getHost(req),
                    typeClass: '',
                    data: {
                        'desData': desData,
                        'searchId': 300
                    },
                    webSiteInfo: {
                        title: desData.title,
                        keywords: '区块链,比特币,以太坊,eos,莱特币,瑞波币,挖矿,数字货币,区块链是什么,区块链技术,什么是区块链,比特币行情,比特币价格,比特币是什么,比特币今日价格,coinmarketcap,王峰十问,新闻早八点"',
                        description: '精彩区块链互动，尽在火星财经。火星财经提供区块链峰会，线下聚会、技术峰会、火星中国行等活动。'
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
        },
        pcRender: function () {
            pcRes(req, res, next)
        }
    })
})

module.exports = router
