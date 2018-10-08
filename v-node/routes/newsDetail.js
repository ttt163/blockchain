/**
 * Author：tantingting
 * Time：2018/4/9
 * Description：Description
 */

const express = require('express')
const router = express.Router()
const cheerio = require('cheerio')
let async = require('async')

const {
    axiosAjax,
    ajaxJavaUrl,
    pageRender,
    getHost
} = require('../utils/public')

const pcRes = (req, res, next) => {
    let newsId = 0
    if (!req.params.id) {
        if (!req.query.id) {
            res.redirect('/news')
        } else {
            newsId = req.query.id
        }
    } else {
        let fileNme = req.params.id
        newsId = fileNme.split('.html')[0]
    }
    const getData = (resolve) => {
        let sendData = null
        if (!req.cookies.hx_user_id) {
            sendData = {id: newsId}
        } else {
            sendData = {
                id: newsId,
                passportId: req.cookies.hx_user_id,
                token: req.cookies.hx_user_token
            }
        }
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/news/getbyid',
            params: sendData,
            res: res,
            fn: function (resData) {
                resolve(null, resData)
            }
        })
    }
    const getAd = (resolve) => {
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/info/ad/showad?adPlace=5&type=1',
            res: res,
            fn: function (resData) {
                resolve(null, resData)
            }
        })
    }
    async.parallel({
        obj: function (callback) {
            // 处理逻辑
            getData(callback)
        },
        adImg: function (calllback) {
            getAd(calllback)
        }
    }, function (error, result) {
        if (!error) {
            let resData = result.obj
            let curr = resData.obj.current
            let cont = curr.content
            const $ = cheerio.load(cont, {decodeEntities: false})
            let img = $('img')
            img.each(function (i, d) {
                let thisAlt = !$(this).attr('alt') ? resData.obj.current.title : $(this).attr('alt')
                $(this).attr('alt', thisAlt)
            })
            let data = {
                ...resData.obj,
                current: {
                    ...curr,
                    content: $('body').html()
                    // content: cont
                }
            }
            // res.send(data)
            res.render('newsDetail', {
                domain: getHost(req),
                adImg: result.adImg.obj[5],
                newsData: data,
                typeClass: 'news',
                webSiteInfo: {
                    title: `${resData.obj.current.title}_火星财经`,
                    keywords: `${resData.obj.current.tags}，${resData.obj.current.title}`,
                    description: resData.obj.current.synopsis
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
    let newsId = 0
    if (!req.params.id) {
        if (!req.query.id) {
            res.redirect('/')
        } else {
            newsId = req.query.id
        }
    } else {
        let fileNme = req.params.id
        newsId = fileNme.split('.html')[0]
    }

    async function newsDetailData () {
        const data = await new Promise((resolve) => {
            let sendData = {id: newsId, type: 'mobile'}
            if (!req.cookies.hx_user_id) {
            } else {
                sendData = {
                    ...sendData,
                    passportId: req.cookies.hx_user_id,
                    token: req.cookies.hx_user_token
                }
            }
            axiosAjax({
                type: 'GET',
                url: ajaxJavaUrl + '/info/news/getbyid',
                params: sendData,
                res: res,
                fn: function (resData) {
                    resolve(resData)
                }
            })
        })
        return data
    }

    newsDetailData().then((resData) => {
        if (resData.code === 1) {
            let timestamp = new Date().getTime()
            let curr = resData.obj.current
            let cont = curr.content
            // const $ = cheerio.load(cont, {decodeEntities: false})
            // $('img').attr('alt', `${resData.obj.current.title}_火星财经`)

            let data = {
                ...resData.obj,
                current: {
                    ...curr,
                    // content: $.html()
                    content: cont
                },
                timestamp: timestamp,
                searchId: resData.obj.current.channelId
            }
            // console.log(data.current.channelId)
            let ejsPage = parseInt(data.current.channelId) === 18 && parseInt(data.current.hasCutContent) === 1 ? 'm-newsDetailClass' : 'm-newsDetail'
            res.render(ejsPage, {
                domain: getHost(req),
                data: data,
                webSiteInfo: {
                    title: `${resData.obj.current.title}_火星财经`,
                    keywords: `${resData.obj.current.tags}，${resData.obj.current.title}`,
                    description: resData.obj.current.synopsis
                }
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
        redirect: true,
        mRender: function () {
            mRes(req, res, next)
        },
        pcRender: function () {
            pcRes(req, res, next)
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
