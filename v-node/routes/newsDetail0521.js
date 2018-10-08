/**
 * Author：tantingting
 * Time：2018/4/9
 * Description：Description
 */

const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

const {
    axiosAjax,
    ajaxJavaUrl,
    pageRender,
    mkDirs,
    getHost
} = require('../utils/public')

const pcRes = (req, res, next) => {
    let fileNme = req.params.id
    let newsId = fileNme.split('.html')[0]
    let dirPath = `./public/tempStatic/newsDetail/pc`
    let filePath = path.resolve(`${dirPath}/${fileNme}`)

    async function newsDetailData () {
        const data = await new Promise((resolve) => {
            let sendData = null
            if (!req.cookies.hx_user_token) {
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

    mkDirs(path.resolve(dirPath), () => {
        fs.stat(filePath, (err, stats) => {
            // if (!err) {
            //     res.sendFile(filePath)
            //     return
            // }
            console.log(err)
            newsDetailData().then((resData) => {
                if (resData.code === 1) {
                    res.render('newsDetail', {
                        domain: getHost(req),
                        newsData: resData.obj,
                        webSiteInfo: {
                            title: `${resData.obj.current.title}_火星财经`,
                            keywords: `${resData.obj.current.tags}，${resData.obj.current.title}`,
                            description: resData.obj.current.synopsis
                        }
                    }, (er, data) => {
                        if (!er) {
                            res.send(data)
                            fs.writeFile(filePath, data, (er) => {
                                if (er) {
                                    console.log(er)
                                }
                            })
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
        })
    })
}

const mRes = (req, res, next) => {
    let fileNme = req.params.id
    let newsId = fileNme.split('.html')[0]
    let dirPath = `./public/tempStatic/newsDetail/m`
    let filePath = path.resolve(`${dirPath}/${fileNme}`)

    async function newsDetailData () {
        const data = await new Promise((resolve) => {
            let sendData = null
            if (!req.cookies.hx_user_token) {
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

    mkDirs(path.resolve(dirPath), () => {
        fs.stat(filePath, (err, stats) => {
            // if (!err) {
            //     res.sendFile(filePath)
            //     return
            // }
            console.log(err)
            newsDetailData().then((resData) => {
                if (resData.code === 1) {
                    let timestamp = new Date().getTime()
                    res.render('m-newsDetail', {
                        domain: getHost(req),
                        data: {
                            ...resData.obj,
                            timestamp: timestamp,
                            searchId: resData.obj.current.channelId
                        },
                        webSiteInfo: {
                            title: `${resData.obj.current.title}_火星财经`,
                            keywords: `${resData.obj.current.tags}，${resData.obj.current.title}`,
                            description: resData.obj.current.synopsis
                        }
                    }, (er, data) => {
                        if (!er) {
                            res.send(data)
                            fs.writeFile(filePath, data, (er) => {
                                if (er) {
                                    console.log(er)
                                }
                            })
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
        })
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
            res.redirect('/news')
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
