/**
 * Author：tantingting
 * Time：2018/4/27
 * Description：Description
 */
const express = require('express')
const router = express.Router()
const {
    axiosAjax,
    ajax,
    ajaxJavaUrl,
    webInfo,
    pageRender,
    getHost,
    GetLength,
    getTDK
} = require('../utils/public')

const pcRes = (req, res, next) => {
    let sendData = {
        currentPage: 1,
        pageSize: 30,
        passportid: !req.cookies.hx_user_id ? '' : req.cookies.hx_user_id
    }

    const flashNav = ajax({
        type: 'GET',
        url: ajaxJavaUrl + '/info/lives/channels'
    })

    const adImg = ajax({
        type: 'GET',
        url: ajaxJavaUrl + '/info/ad/showad?adPlace=5&type=1'
    })

    const flashData = ajax({
        type: 'GET',
        url: ajaxJavaUrl + '/info/lives/showlives',
        params: sendData
    })

    Promise.all([flashData, flashNav, adImg]).then((data) => {
        res.render('flashNews', {
            domain: getHost(req),
            adImg: data[2].obj[5],
            flashNav: data[1].obj,
            data: data[0].obj,
            typeClass: 'livenews',
            webSiteInfo: getTDK('快讯', '火星财经快讯,火星快讯,比特币快讯,BTC快讯,以太坊快讯,EOS快讯,数字货币快讯', '火星财经关注链圈币圈动态，市场行情与最新行情报价')
        })
    }).catch(function (err) {
        console.log(err)
    })
}

const mRes = (req, res, next) => {
    async function getData () {
        const data = await new Promise((resolve) => {
            let sendData = {
                currentPage: 1,
                pageSize: 30,
                queryTime: new Date().getTime(),
                ChannelId: '',
                refreshTime: ''
            }
            axiosAjax({
                type: 'GET',
                url: ajaxJavaUrl + '/info/lives/showlives',
                params: sendData,
                res: res,
                fn: function (resData) {
                    resolve(resData)
                }
            })
        })

        return data
    }

    getData().then((resData) => {
        if (resData.code === 1) {
            let reg = /【([^【】]+)】([^【】]*)/

            resData.obj.inforList.forEach((item) => {
                let cont = reg.exec(item.content) ? reg.exec(item.content)[2] : item.content
                if (GetLength(cont) > 80) {
                    item.openMsg = 1
                } else {
                    item.openMsg = 0
                }
            })

            res.render('m-liveNews', {
                domain: getHost(req),
                data: {...resData.obj, searchId: 100},
                webSiteInfo: webInfo
            })
        } else {
            res.render('error', {
                message: resData.msg,
                error: {
                    status: resData.code,
                    stack: 'Please pass the correct parameters.'
                }
            })
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
