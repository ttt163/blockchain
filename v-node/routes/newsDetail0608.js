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
    const getHotTags = (resolve) => {
        let sendData = {
            type: 2
        }
        axiosAjax({
            type: 'GET',
            url: ajaxJavaUrl + '/mgr/news/getfooterinfo',
            params: sendData,
            res: res,
            fn: function (resData) {
                resolve(null, !resData || !resData.obj || !resData.obj.inforList ? [] : resData.obj.inforList)
            }
        })
    }
    async.parallel({
        obj: function (callback) {
            // 处理逻辑
            getData(callback)
        },
        hotTags: function (callback) {
            // 处理逻辑
            getHotTags(callback)
        }
    }, function (error, result) {
        if (!error) {
            let resData = result.obj
            let curr = resData.obj.current
            let cont = curr.content
            const $ = cheerio.load(cont, {decodeEntities: false})
            let a = $('a')
            let aText = []
            a.each(function (i, d) {
                aText.push({text: $(this).text(), link: $(this).attr('href')})
                $(this).attr('href', ``).attr('id', `ttt_${i}`).text('')
            })
            let img = $('img')
            let imgAlt = []
            img.each(function (i, d) {
                let thisAlt = !$(this).attr('alt') ? resData.obj.current.title : $(this).attr('alt')
                imgAlt.push(thisAlt)
                $(this).attr('id', `img_${i}`).attr('alt', '')
            })
            let currTags = !curr.tags ? [] : curr.tags.split(',')
            const tagsSet = new Set(currTags)
            let hotTags = !result.hotTags ? [] : result.hotTags
            hotTags.map((item) => {
                tagsSet.add(item.name)
            })
            currTags = [...tagsSet]
            let text = $('body').html().toString()
            currTags.map((item, i) => {
                let re = new RegExp(`${item}`, 'g')
                text = text.replace(re, `<a class="tags-link" target="_blank" title="${item}" href="${getHost(req)}/hot/${item}">${item}</a>`)
            })
            let str = cheerio.load(text, {decodeEntities: false})
            // str('img').attr('alt', `${resData.obj.current.title}_火星财经`)
            imgAlt.map((item, i) => {
                str(`#img_${i}`).attr('alt', item).removeAttr('id')
            })
            aText.map((item, i) => {
                str(`#ttt_${i}`).attr('href', item.link).attr('title', item.text).text(item.text).removeAttr('id')
            })
            let color = !str('.tags-link').length || !str('.tags-link').parent().length ? '#333' : str('.tags-link').parent().css('color')
            str('.tags-link').css('color', color)
            let data = {
                ...resData.obj,
                current: {
                    ...curr,
                    content: str('body').html()
                    // content: cont
                }
            }
            // res.send(data)
            res.render('newsDetail', {
                domain: getHost(req),
                newsData: data,
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
            res.render('m-newsDetail', {
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
