const express = require('express')
const router = express.Router()
const {
    pageRender,
    getHost,
    webInfo,
    axiosAjax,
    ajaxJavaUrl
} = require('../utils/public')

const pcRes = (req, res, next) => {
    let data = {
        liveId: req.params.id,
        liveStatus: !req.params.status ? 0 : req.params.status
    }
    axiosAjax({
        type: 'GET',
        url: ajaxJavaUrl + '/push/text/room/content/list',
        params: {
            castId: data.liveId
        },
        res: res,
        fn: function (resData) {
            if (resData.code === 1) {
                let webCont = resData.data.room.webcast
                let webTitle = webCont.title
                let webDescription = webCont.desc
                res.render('liveDetail', {
                    domain: getHost(req),
                    data: data,
                    typeClass: '',
                    webSiteInfo: {
                        ...webInfo,
                        title: webTitle,
                        keywords: '王峰，王峰十问，王峰十问图文直播，王峰十问嘉宾，王峰十问最新',
                        description: webDescription
                    }
                })
            }
        }
    })
}

const mRes = (req, res, next) => {
    let dataId = {
        castId: req.params.id
    }
    axiosAjax({
        type: 'GET',
        url: ajaxJavaUrl + '/push/text/room/content/list',
        params: {
            castId: dataId.castId
        },
        res: res,
        fn: function (resData) {
            if (resData.code === 1) {
                let webCont = resData.data.room.webcast
                let webTitle = webCont.title
                let webDescription = webCont.desc
                res.render('m-liveDetail', {
                    domain: getHost(req),
                    data: dataId,
                    webSiteInfo: {
                        ...webInfo,
                        title: webTitle,
                        keywords: '王峰，王峰十问，王峰十问图文直播，王峰十问嘉宾，王峰十问最新',
                        description: webDescription
                    }
                })
            }
        }
    })
    // async function getData () {
    //     const data = await new Promise((resolve) => {
    //         let sendData = {
    //             status: -3
    //         }
    //         axiosAjax({
    //             type: 'GET',
    //             url: `${ajaxJavaUrl}/push/text/room/list`,
    //             params: sendData,
    //             res: res,
    //             fn: function (resData) {
    //                 resolve(resData)
    //             }
    //         })
    //     })
    //
    //     return data
    // }
    // getData().then((resData) => {
    //     console.log(resData)
    //     // res.render('m-liveDetail', {
    //     //     domain: getHost(req),
    //     //     data: dataId,
    //     //     webSiteInfo: {
    //     //         ...webInfo,
    //     //         title: '王峰十问V神图文直播（第二十期）',
    //     //         keywords: '王峰,王峰十问,V神, Vitalik Buterin，以太坊，ETH，以太坊创始人，ETH创始人，王峰十问嘉宾，王峰十问最新',
    //     //         description: `“王峰十问”以“对话思想先锋，直面风口浪尖”为特色，紧密追踪舆论热点，深度挖掘话题价值。截至目前，陆续对话了知名天使投资人薛蛮子、量子链创始人帅初、快的打车创始人陈伟星、湖畔大学教育长曾鸣、中国比特币首富李笑来、金沙江创投董事总经理朱啸虎等多位意见领袖与行业翘楚，展开了令业界、传媒和大众耳目一新的思辨式对话。`
    //     //     }
    //     // })
    // })
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
