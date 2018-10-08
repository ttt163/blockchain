/**
 * Author：zhoushuanglong
 * Time：2017-08-29 19:27
 * Description：js demo index
 */

import Cookies from 'js-cookie'
import {
    ajaxGet,
    pageLoadingHide,
    rem,
    getTimeContent,
    proxyUrl,
    axiosAjax,
    timestampToTime,
    getQueryString
} from '../js/public/public'
import config from '../../config'

// let url = `${proxyUrl}/push/text/room/list`
let url2 = `${proxyUrl}/push/text/room/content/list`
let commentUrl = `${proxyUrl}/push/text/room/comment/list`
let websocketUrl = `ws://${config.pcUrl}/push/websocket/text`

// const htmlPath = ''
$(function () {
    pageLoadingHide()
    $('.introduction-btn').on('click', function () {
        $('.introduction-cont').addClass('bounceInRight').removeClass('bounceInLeft')
    })
    $('#left-btn').on('click', function () {
        $('.introduction-cont').removeClass('bounceInRight').addClass('bounceInLeft')
    })

    // 房间号
    Cookies.set('room', $('.wrap').data('id'))
    // 二维码
    $('#wxBtn').on('click', () => {
        $('.live-shade').addClass('show')
        $('.live-ewm').addClass('show')
    })

    $('#liveShade').on('click', () => {
        $('.live-shade').removeClass('show')
        $('.live-ewm').removeClass('show')
    })

    // 小于10加0
    function timeNum (t) {
        if (t < 10) {
            t = '0' + t
        }
        return t
    }

    // 详情吸顶
    $('.wrap').scroll(function () {
        let $detailsBannerH = rem($('.banner-box').height() - 40)
        let windowH = rem($('.wrap').scrollTop())
        let reg = new RegExp('rem', 'g')
        $detailsBannerH = $detailsBannerH.replace(reg, '')
        windowH = windowH.replace(reg, '')
        if (Number(windowH) > Number($detailsBannerH)) {
            $('.live-time').css({
                'position': 'fixed',
                'top': 0,
                'background': 'rgba(28, 27, 33, 1)'
            })
            $('.swiper-pagination').css({
                'position': 'fixed',
                'top': rem(70),
                'zIndex': '10'
            })
        } else if (Number(windowH) < Number($detailsBannerH)) {
            $('.live-time').css({
                'position': 'absolute',
                'bottom': 0,
                'top': '',
                'background': 'rgba(28, 27, 33, 0.78)'
            })
            $('.swiper-pagination').css({
                'position': 'static',
                'top': 0
            })
        }
    })

    $('.not-message').css('height', rem(document.body.offsetHeight))
    // 更改url status值
    // function changeUrlArg (url, arg, val) {
    //     let pattern = arg + '=([^&]*)'
    //     let replaceText = arg + '=' + val
    //     return url.match(pattern) ? url.replace(eval('/(' + arg + '=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url + '&' + replaceText : url + '?' + replaceText)
    // }

    // 获取直播列表
    /* let getDetails = (status, pageSize, currentPage) => {
     ajaxGet(url, {
     status: status,
     pageSize: pageSize,
     currentPage: currentPage,
     fresh: Math.random()
     }, (data) => {
     if (data.code === 1) {
     let dataList = data.data.inforList
     let list = ''
     let listText = ''
     dataList.map((item, index) => {
     switch (item.webcast.status) {
     case 0:
     listText = '<font class="c0"></font>'
     break
     case 1:
     listText = '<font class="c1"></font>'
     break
     case 2:
     listText = '<font class="c2"></font>'
     break
     default:
     listText = ''
     }
     list += `<div class="list">
     <a href="${htmlPath}/liveDetail/${item.webcast.castId}">
     <p class="list-img"><img src=${item.webcast.coverPic} alt=""></p>
     <p class="list-text">${item.webcast.title}</p>
     <p class="list-state">${listText}</p>
     </a>
     </div>`
     })
     $('.live-list').html(list)
     }
     })
     } */
    let isCastId = window.location.href.indexOf('castId') !== -1
    let isStatus = window.location.href.indexOf('castId') !== -1
    Cookies.set('room', $('.wrap').data('id'))
    let castId = Cookies.get('room')
    // let status = getQueryString('status')
    let passportId = Cookies.get('hx_mob_passportId')
    let token = Cookies.get('hx_mob_token')
    let iconUrl = Cookies.get('hx_mob_bbsIconUrl')
    let nickName = Cookies.get('hx_mob_nickName')
    if (!isCastId && !isStatus) {
        // getDetails(-3, 40, 1)
    }

    // 判断是否登录
    $('#liveComment, #fileImg').on('click', function () {
        passportId = Cookies.get('hx_mob_passportId')
        token = Cookies.get('hx_mob_token')
        iconUrl = Cookies.get('hx_mob_bbsIconUrl')
        nickName = Cookies.get('hx_mob_nickName')
        let urlPassportid = getQueryString('passportid')
        let urlToken = getQueryString('token')
        let urlUsername = getQueryString('username')
        let urlIcon = getQueryString('icon')
        const idIsNo = window.location.href.indexOf('passportid') > -1

        if (passportId === undefined || (passportId !== urlPassportid && idIsNo)) {
            if (idIsNo) {
                Cookies.set('hx_mob_passportId', urlPassportid)
                Cookies.set('hx_mob_token', urlToken)
                Cookies.set('hx_mob_bbsIconUrl', urlIcon)
                Cookies.set('hx_mob_nickName', urlUsername)
                passportId = urlPassportid
                token = urlToken
                nickName = urlUsername
                iconUrl = urlIcon
                return
            }
            // showAlert('请登录后再讨论')
            setTimeout(function () {
                window.location.href = '/mLogin'
            }, 600)
        } else if (passportId === urlPassportid) {
            Cookies.set('hx_mob_bbsIconUrl', urlIcon)
            Cookies.set('hx_mob_nickName', urlUsername)
        }
    })

    // 直播状态
    function roomStart (obj) {
        let stateText = ''
        switch (obj) {
            case 0:
                stateText = '<font class="c0">即将开始</font>'
                break
            case 1:
                stateText = '<font class="c1">直播中...</font>'
                break
            case 5:
                stateText = '<font class="c1">直播中...</font>'
                break
            case 4:
                stateText = '<font class="c2">已结束</font>'
                break
            default:
                stateText = ''
        }
        return stateText
    }

    // 时间
    function timeStr (str) {
        let time = timestampToTime(str)
        let timeArr = time.split(' ')
        let month = timeArr[0].split('-')
        let day = timeArr[1].split(':')
        return month[1] + '-' + month[2] + '  ' + timeNum(day[0]) + ':' + timeNum(day[1])
    }

    /****************************************/
    let lastTime = 0

    function getPresideFn (item) {
        let str = ''
        let time = getTimeContent(item.content.createTime, new Date().getTime())
        let timeStr = ''
        if (lastTime === 0) {
            lastTime = item.content.createTime
            let diffTime = (new Date().getTime() - item.content.createTime) / 1000 / 60
            if (diffTime > 5) {
                timeStr = `<div class="sendTim s">${time}</div>`
            }
        } else {
            let diffTime = (lastTime - item.content.createTime) / 1000 / 60
            if (diffTime > 5) {
                lastTime = item.content.createTime
                timeStr = `<div class="sendTim s">${time}</div>`
            }
        }
        str += `<div class="inform-cont ${(item.passportId === undefined) ? (item.user.userType === 1 ? 'preside' : '') : (item.passportId === passportId ? 'preside' : '')} clearfix" data-id=${item.content.contentId}>${timeStr}
                        <div class="inform-portrait"><img src=${item.iconUrl === undefined ? item.user.headUrl : item.iconUrl} alt=""></div>
                        <div class="inform-right-cont">
                            <div class="inform-cont-top">
                                <p class="name">${item.nickName === undefined ? item.user.userName : item.nickName}</p>
                                <p class="time" style="display: none">${time}</p>
                            </div>
                            <p class="r-arrow"></p>
                            <div class="inform-cont-text">${item.content.content !== undefined ? item.content.content : item.content}</div>
                        </div>
                    </div>`
        return str
    }

    /****************************************/

    // 获取往期内容
    function endRoom () {
        ajaxGet(url2, {
            castId: castId
        }, (data) => {
            let dataArr = data.data
            if (data.code === 1) {
                let bannerMessage = dataArr.room.webcast
                $('img.banner-img').attr('src', bannerMessage.coverPic)
                $('.introduction-cont p').html(bannerMessage.desc)
                $('.live-time p span').html(timeStr(bannerMessage.beginTime))
                let str = ''
                dataArr.contentList.map((item, index) => {
                    str += getPresideFn(item)
                })
                $('#informBox').html(str)
            }
        })
    }

    // 获取往期评论
    function endComment (pageSize) {
        ajaxGet(commentUrl, {
            castId: castId,
            pageSize: pageSize,
            currentPage: 1
        }, (data) => {
            let dataArr = data.data
            if (data.code === 1) {
                let str = ''
                dataArr.map((item, index) => {
                    str += getPresideFn(item)
                })
                $('#informComment').html(str)
            }
        })
    }

    if (castId) {
        let websocket = null
        // 判断当前浏览器是否支持WebSocket
        if ('WebSocket' in window) {
            websocket = new WebSocket(websocketUrl)
        } else {
            alert('当前浏览器 Not support websocket')
            return false
        }

        // 将消息显示在网页上
        const setMessageInnerHTML = (innerHTML) => {
            console.log(innerHTML)
            // document.getElementById('message').innerHTML += innerHTML + '<br/>'
        }

        // 关闭WebSocket连接
        const closeWebSocket = () => {
            websocket.close()
            // alert('链接断开，请刷新页面...')
        }

        // 连接发生错误的回调方法
        websocket.onerror = () => {
            setMessageInnerHTML('WebSocket连接发生错误')
        }

        // 连接成功建立的回调方法
        websocket.onopen = () => {
            setMessageInnerHTML('WebSocket连接成功')
            /* setInterval(() => {
             websocket.send(`{"type": 0, "castId": ${castId}}`)
             }, 59000) */
            websocket.send(`{"type": 0, "castId": ${castId}}`)
        }

        // 接收到消息的回调方法
        websocket.onmessage = (event) => {
            let dataArr = JSON.parse(event.data)
            console.log(dataArr)
            if (dataArr.type === 0) {
                let bannerMessage = dataArr.data.room.webcast
                $('.lives-state').html(roomStart(bannerMessage.status))
                Cookies.set('endStart', '')
                $('img.banner-img').attr('src', bannerMessage.coverPic)
                $('.introduction-cont p').html(bannerMessage.desc)
                $('.live-time p span').html(timeStr(bannerMessage.beginTime))
                document.title = bannerMessage.title
                document.description = bannerMessage.desc

                if (dataArr.data.contentList.length === 0) {
                    $('#informM').show()
                    return
                }
                $('#informM').hide()
                let str = ''
                lastTime = 0
                dataArr.data.contentList.map(function (item) {
                    str += getPresideFn(item)
                })
                $('#informBox').html(str)
            } else if (dataArr.type === 1) {
                $('#informBox').prepend(getPresideFn(dataArr.data))
                $('#informM').hide()
            } else if (dataArr.type === 2) {
                let classArr = ''
                $('.inform-cont').each(function (i, d) {
                    if ($('.inform-cont').eq(i).data('id') !== dataArr.data.contentId) {
                        classArr += $(d).get(0).outerHTML
                    }
                })
                $('.details-box').html(classArr)
            } else if (dataArr.type === 3) {
                $('.inform-cont').each(function (i, d) {
                    if ($(d).data('id') === dataArr.data.contentId) {
                        $(d).find('.inform-cont-text').html(dataArr.data.content)
                    }
                })
            } else if (dataArr.type === 4) {
                $('.lives-state').html(roomStart(dataArr.type))
                Cookies.set('endStart', 4)
                showAlert(dataArr.msg)
                endRoom()
                $('#liveComment').on('click', function () {
                    showAlert(dataArr.msg)
                })
            } else if (dataArr.type === 5) {
                $('.lives-state').html(roomStart(dataArr.type))
                Cookies.set('endStart', '')
            } else if (dataArr.type === 2001) {
                $('#commentM').hide()
                $('#informComment').prepend(getPresideFn(dataArr.data))
            } else if (dataArr.type === 2002) {
                if (!dataArr.data) {
                    $('#commentM').show()
                    return
                }
                let str = ''
                $('#commentM').hide()
                dataArr.data.map(function (item) {
                    str += getPresideFn(item)
                })
                $('#informComment').html(str)
            } else if (dataArr.type === 2100) {
                showAlert(dataArr.msg)
            } else if (dataArr.type === 10) {
                // $('#personNum').html(`(${dataArr.data} 人)`)
            }
        }

        // 切换
        $('.swiper-pagination span').on('click', function () {
            let index = $(this).index()
            $(this).addClass('active').siblings().removeClass('active')
            if (index === 0) {
                $('#informBox').show()
                $('#informComment').hide()
                websocket.send(`{"type": 0, "castId": ${castId}}`)
            } else {
                $('#informBox').hide()
                $('#informComment').show()
                console.log(Cookies.get('endStart') === '4')
                if (Cookies.get('endStart') === '4') {
                    endComment(999)
                    return false
                }
                websocket.send(`{"type": 2002, "castId": ${castId}}`)
            }
        })

        // 连接关闭的回调方法
        websocket.onclose = () => {
            setMessageInnerHTML('WebSocket连接关闭')
            showAlert('链接已断开...')
        }

        // 发送评论
        $('#commentBtn').on('click', function () {
            console.log(passportId, token)
            websocket.send(`{"type": "2001", "castId": "${castId}", "data": {"content": "${$('#liveComment').val()}", "passportId": "${passportId}", "token": "${token}", "iconUrl": "${iconUrl}", "nickName": "${nickName}"}}`)
            $('#liveComment').val('')
        })
        // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = () => {
            closeWebSocket()
        }
        // 图片上传
        let uploadId = ''
        let currIndex = 1
        let pause = false

        const Upload = () => {
            let files = document.getElementById('fileInput').files
            if (files.length < 1) {
                layer.msg('请选择文件~')
                return
            }
            let file = files[0]
            let totalSize = file.size // 文件大小
            let blockSize = 1024 * 1024 * 2 // 块大小
            let blockCount = Math.ceil(totalSize / blockSize) // 总块数

            // 创建FormData对象
            let formData = new FormData()
            formData.append('fileName', file.name) // 文件名
            formData.append('blockCount', blockCount) // 总块数
            formData.append('currIndex', currIndex) // 当前上传的块下标
            formData.append('uploadId', uploadId) // 上传编号
            formData.append('uploadFile', null)
            formData.append('type', 'annex')
            UploadPost(file, formData, totalSize, blockCount, blockSize)
            $('.s-name').html(file.name)
            let accessorySize = totalSize / 1024 / 1024
            $('.s-size').html(accessorySize.toFixed(2) + 'MB')
        }

        const UploadPost = (file, formData, totalSize, blockCount, blockSize) => {
            if (pause) {
                return // 暂停
            }
            try {
                let start = (currIndex - 1) * blockSize
                let end = Math.min(totalSize, start + blockSize)
                let uploadFile = file.slice(start, end)
                formData.set('uploadFile', uploadFile)
                formData.set('currIndex', currIndex)
                formData.set('uploadId', uploadId)

                axiosAjax({
                    type: 'post',
                    url: `${proxyUrl}/mgr/file/upload`,
                    // contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                    params: formData,
                    fn: function (res) {
                        if (res.code === 1) {
                            if (currIndex === 1) {
                                uploadId = res.obj
                            }
                            if (currIndex < blockCount) {
                                currIndex++
                                UploadPost(file, formData, totalSize, blockCount, blockSize)
                            }
                        } else if (res.code < 0) {
                            console.log('code:' + res.code + ' msg:' + res.msg)
                        } else if (res.code === 2) {
                            websocket.send(`{"type": "2001", "castId": "${castId}", "data": {"content": "<img src='${res.obj}'/>", "passportId": "${passportId}", "token": "${token}", "iconUrl": "${iconUrl}", "nickName": "${nickName}"}}`)
                        }
                    }
                })
            } catch (e) {
                alert(e)
            }
        }

        $('.fileImg').on('click', function () {
            currIndex = 1
            uploadId = ''
        })
        $('#fileInput').on('change', function (e) {
            let filess = document.getElementById('fileInput').files
            if (filess.length > 0) {
                Upload()
            }
        })
    }

    // 发布评论
    // function issueCommen() {
    //     ajaxGet(url, {
    //         status: status,
    //         pageSize: pageSize,
    //         currentPage: currentPage,
    //         fresh: Math.random()
    //     }, (data) => {
    //
    //     })
    // }

    // let websocket = null
    // // 判断当前浏览器是否支持WebSocket
    // if ('WebSocket' in window) {
    //     websocket = new WebSocket(url)
    // } else {
    //     alert('当前浏览器 Not support websocket')
    // }
    //
    // // 连接发生错误的回调方法
    // websocket.onerror = () => {
    //     setMessageInnerHTML('WebSocket连接发生错误')
    // }
    //
    // // 连接成功建立的回调方法
    // websocket.onopen = () => {
    //     setMessageInnerHTML('WebSocket连接成功')
    //     websocket.send('{"type": 1, "castId": "222"}')
    // }
    //
    // // 接收到消息的回调方法
    // websocket.onmessage = function (event) {
    //     // setMessageInnerHTML(event.data)
    //     let dataArr = JSON.parse(event.data)
    //     console.log(dataArr)
    // }
    //
    // // 连接关闭的回调方法
    // websocket.onclose = () => {
    //     setMessageInnerHTML('WebSocket连接关闭')
    // }
    //
    // // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    // window.onbeforeunload = () => {
    //     closeWebSocket()
    // }
    //
    // // 将消息显示在网页上
    // function setMessageInnerHTML(innerHTML) {
    //     // document.getElementById('message').innerHTML += innerHTML + '<br/>'
    // }
    //
    // // 关闭WebSocket连接
    // function closeWebSocket() {
    //     websocket.close()
    // }
})
