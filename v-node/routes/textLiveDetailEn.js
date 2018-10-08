const express = require('express')
const router = express.Router()

const {
    pageRender,
    getHost,
    webInfo
} = require('../utils/public')

const pcRes = (req, res, next) => {
    let data = {
        liveId: req.params.id,
        liveStatus: !req.params.status ? 0 : req.params.status
    }
    res.render('liveDetailEn', {
        domain: getHost(req),
        data: data,
        webSiteInfo: {
            ...webInfo,
            title: 'Episode 20: WangFeng’s Top 10 Questions with Vitalik Buterin, Photo & Text Live Streaming.',
            keywords: '王峰, WangFeng / Feng Wang,王峰十问, WangFeng’s Top 10 Questions, V神, Vitalik Buterin,以太坊,Ethereum, ETH,以太坊创始人,Founder of Ethereum,  ETH创始人, Founder of ETH, 王峰十问嘉宾,Special Guest of WangFeng’s Top 10 Questions, 王峰十问最新 Latest of WangFeng’s Top 10 Questions,',
            description: `"WangFeng's Top 10 Questions" is characterized by questioning pioneering idealist and facing the cusp of the world, keep tracking hottest public opinions, digging topic value deeply. As for now, we have successfully invited and completed the conversation with several experts, such as Charles Xue, the famous angel investor; Shuai Chu, founder of Chain of Quantum; Chen weixing, founder of Kuaidi Dache; Zeng Ming, Director Education of Hupan University; Li Xiaolai, China’s richest Bitcoin; Zhu Xiaohu, Managing Director of GSR Ventures, and so on. The conversations between WangFeng and those opinion leaders, industry leaders are speculative and spectacular, which refreshed the industrial media and public’s understanding of the block chain industry.`
        }
    })
}

const mRes = (req, res, next) => {
    let data = {
        castId: req.params.id
    }
    res.render('m-liveDetailEn', {
        domain: getHost(req),
        data: data,
        webSiteInfo: {
            ...webInfo,
            title: 'Episode 20: WangFeng’s Top 10 Questions with Vitalik Buterin, Photo & Text Live Streaming.',
            keywords: '王峰, WangFeng / Feng Wang,王峰十问, WangFeng’s Top 10 Questions, V神, Vitalik Buterin,以太坊,Ethereum, ETH,以太坊创始人,Founder of Ethereum,  ETH创始人, Founder of ETH, 王峰十问嘉宾,Special Guest of WangFeng’s Top 10 Questions, 王峰十问最新 Latest of WangFeng’s Top 10 Questions,',
            description: `"WangFeng's Top 10 Questions" is characterized by questioning pioneering idealist and facing the cusp of the world, keep tracking hottest public opinions, digging topic value deeply. As for now, we have successfully invited and completed the conversation with several experts, such as Charles Xue, the famous angel investor; Shuai Chu, founder of Chain of Quantum; Chen weixing, founder of Kuaidi Dache; Zeng Ming, Director Education of Hupan University; Li Xiaolai, China’s richest Bitcoin; Zhu Xiaohu, Managing Director of GSR Ventures, and so on. The conversations between WangFeng and those opinion leaders, industry leaders are speculative and spectacular, which refreshed the industrial media and public’s understanding of the block chain industry.`
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

router.get('/', function (req, res, next) {
    pageRender({
        req: req,
        redirect: true,
        mRender: function () {
            res.redirect('/live')
        },
        pcRender: function () {
            res.redirect('/live')
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
