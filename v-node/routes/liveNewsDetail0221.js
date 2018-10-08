/**
 * Author：tantingting
 * Time：2018/4/9
 * Description：Description
 */

const express = require('express')
const router = express.Router()
// const utils = require('../utils/public')
const path = require('path')
const fs = require('fs')
const {
    axiosAjax,
    ajaxJavaUrl,
    webInfo,
    mkDirs,
    getHost,
    pageRender
} = require('../utils/public')

const pcRes = (req, res, next) => {
    let fileNme = req.params.id
    let newsId = fileNme.split('.html')[0]
    let dirPath = `./public/tempStatic/liveDetail/pc`
    let filePath = path.resolve(`${dirPath}/${fileNme}`)

    async function newsDetailData () {
        const data = await new Promise((resolve) => {
            let sendData = null
            if (!req.cookies.hx_user_id) {
                sendData = {id: newsId}
            } else {
                sendData = {
                    id: newsId,
                    passportid: req.cookies.hx_user_id
                }
            }
            axiosAjax({
                type: 'GET',
                url: ajaxJavaUrl + '/info/lives/getbyid',
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
                    // console.log(resData)
                    let data = {...resData.obj}
                    let title = ''
                    let content = ''
                    if (!data.title) {
                        if (!data.content) {
                            title = ''
                            content = ''
                        } else {
                            let startIndex = data.content.indexOf('【') === -1 ? 0 : data.content.indexOf('【') + 1
                            let endIndex = data.content.indexOf('】') === -1 ? 0 : data.content.indexOf('】')
                            title = data.content.substring(startIndex, endIndex)
                            content = data.content.substring(endIndex + 1)
                        }
                    } else {
                        title = data.title
                        content = data.content
                    }
                    let renderData = {
                        ...resData.obj,
                        title: title,
                        content: content,
                        currentTime: !resData.currentTime ? new Date().getTime() : resData.currentTime
                    }
                    // console.log(renderData)
                    res.render('liveNewsDetail', {
                        domain: getHost(req),
                        data: renderData,
                        webSiteInfo: {
                            ...webInfo,
                            title: `${renderData.title}_火星快讯_快讯速递_数字货币快讯_比特币快讯_以太坊快讯_火星财经`,
                            keywords: `${renderData.title}，火星快讯，快讯速递，数字货币快讯，比特币快讯，以太坊快讯`,
                            description: renderData.content
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
    let dirPath = `./public/tempStatic/liveDetail/m`
    let filePath = path.resolve(`${dirPath}/${fileNme}`)

    async function newsDetailData () {
        const data = await new Promise((resolve) => {
            let sendData = null
            if (!req.cookies.hx_user_id) {
                sendData = {id: newsId}
            } else {
                sendData = {
                    id: newsId,
                    passportid: req.cookies.hx_user_id
                }
            }
            // console.log(sendData)
            axiosAjax({
                type: 'GET',
                url: ajaxJavaUrl + '/info/lives/getbyid',
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
                    let data = {...resData.obj}
                    let title = ''
                    let content = ''
                    if (!data.title) {
                        if (!data.content) {
                            title = ''
                            content = ''
                        } else {
                            let startIndex = data.content.indexOf('【') === -1 ? 0 : data.content.indexOf('【') + 1
                            let endIndex = data.content.indexOf('】') === -1 ? 0 : data.content.indexOf('】')
                            title = data.content.substring(startIndex, endIndex)
                            content = data.content.substring(endIndex + 1)
                        }
                    } else {
                        title = data.title
                        content = data.content
                    }
                    let renderData = {
                        ...resData.obj,
                        title: title,
                        content: content,
                        currentTime: !resData.currentTime ? new Date().getTime() : resData.currentTime,
                        searchId: 100
                    }
                    // console.log(renderData)
                    res.render('m-liveNewsDetail', {
                        domain: getHost(req),
                        data: renderData,
                        webSiteInfo: {
                            ...webInfo,
                            title: `${renderData.title}_火星快讯_快讯速递_数字货币快讯_比特币快讯_以太坊快讯_火星财经`,
                            keywords: `${renderData.title}，火星快讯，快讯速递，数字货币快讯，比特币快讯，以太坊快讯`,
                            description: renderData.content
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
            res.redirect('/livenews')
        },
        pcRender: function () {
            res.redirect('/livenews')
        }
    })
})

router.get('/:id', function (req, res, next) {
    // console.log(req.params.id)
    // router.get('/', function (req, res, next) {
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
