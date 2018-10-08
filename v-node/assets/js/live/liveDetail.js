/**
 * Author：tantingting
 * Time：2018/6/19
 * Description：Description
 */
import {add0, showLogin, getTimeContent} from '../public/public'
import Cookies from 'js-cookie'
import layer from 'layui-layer'
import {getPreLiveInfo} from './livePreDetail'

const config = require('../../../config.js')
// 评论
class Reply {
    constructor (warp, id, webSocket) {
        this.warp = warp
        this.websocket = webSocket
        this.castId = id
        this.currentPage = 1
        this.pageSize = 5
        this.recordCount = 0
        this.userNickName = Cookies.get('hx_user_nickname') ? Cookies.get('hx_user_nickname') : ''
        this.userId = Cookies.get('hx_user_id') ? Cookies.get('hx_user_id') : ''
        this.nickUrl = Cookies.get('hx_user_url') ? Cookies.get('hx_user_url') : ''
        this.token = Cookies.get('hx_user_token') ? Cookies.get('hx_user_token') : ''
        this.conmentStr = ''
        this.notLogin = `<div class="prompt-not-login" style="display: ${!this.userId ? 'block' : 'none'};"><p>请先 <span class="reply-login-button">登录</span> 再评论</p></div>`
        this.hasLogin = `<div class="prompt-has-login" style="display: ${!this.userId ? 'none' : 'block'};"><img alt="${this.userNickName}" src="${this.nickUrl}"><div class="reply-editor"><div class="editor"><textarea></textarea></div></div><p class="submit-btn"><span>评论</span></p></div>`
    }

    init () {
        let self = this
        let htmlStr = `<div class="reply-module">${this.notLogin}${this.hasLogin}<div class="reply-section">`
        htmlStr += `</div></div>`
        this.warp.html(htmlStr)
        $('.reply-login-button').on('click', function () {
            // $('#loginModal h1').html(title)
            // 登录弹窗
            showLogin('login', '账号密码登录', '登录')
        })
        // 评论
        $('.submit-btn span').on('click', function () {
            let content = $('.prompt-has-login').find('textarea').val()
            self.addNewsComments(content)
            $('.prompt-has-login').find('textarea').val('')
        })
        // 评论列表
        this.websocket.send(`{"type": 2002, "castId": ${this.castId}}`)

        // 回复
        this.warp.on('click', '.comment-reply-btn', function () {
            let userId = Cookies.get('hx_user_id') ? Cookies.get('hx_user_id') : ''
            if (!userId) {
                layer.msg('请登录后再回复！')
                return
            }
            let parents = $(this).closest('.reply-item')
            parents.find('.reply-editor-section').css({'display': 'block'})
        })

        this.warp.on('click', '.reply-btn-cancel', function () {
            $(this).closest('.reply-editor-section').css({'display': 'none'})
        })

        // 回复
        this.warp.on('click', '.reply-btn-submit', function () {
            let id = $(this).data('id')
            let content = $(this).closest('.reply-editor-section').find('textarea').val()
            self.replyNewsComments(id, content)
        })
    }

    getConmentsStr (arr) {
        let str = ''
        arr.map((item) => {
            let str2 = ''
            let repliesLen = !item.reply ? 0 : item.reply.length
            let repliesBox = ''
            if (!repliesLen) {
                str2 = ''
                repliesBox = `<div class="secord-reply"><ul class="reply-floor">${str2}</ul><p class="all-reply-floor show-secord-all" style="display: none;"><span>查看全部回复</span></p><p class="all-reply-floor show-secord-other" style="display: none;"><span>查看部分回复</span></p></div>`
            } else {
                str2 = this.getSencordConmentsStr(item.reply, 3)
                repliesBox = `<div class="secord-reply"><ul class="reply-floor">${str2}</ul><p class="all-reply-floor show-secord-all" style="display: ${repliesLen > 3 ? 'none' : 'none'};"><span>查看全部回复</span></p><p class="all-reply-floor show-secord-other" style="display: none;"><span>查看部分回复</span></p></div>`
            }
            str += `
                <li class="reply-item">
                    <p class="head-img">
                        <img src="${item.iconUrl}" alt="${item.nickName}">
                    </p>
                    <div class="reply-detail">
                        <p class="reply-author">${item.nickName}</p>
                        <p class="reply-words">${item.content}</p>
                    </div>
                    <div class="reply-info">
                        <span class="reply-date">${getTimeContent(item.addTime)}</span>
                        <p class="reply-info-item">
                            <span class="comment-reply-btn"><i class="iconfont"></i>回复</span>
                            <span data-id="${item.id}" class="comment-del-btn" style="display: ${this.userId === item.passportId ? 'none' : 'none'};">删除</span>
                        </p>
                    </div>
                    <div class="reply-editor-section" style="display: none;">
                    <div class="reply-editor">
                        <div class="editor">
                            <textarea></textarea>
                        </div>
                    </div>
                    <div class="reply-editor-btns">
                        <div data-id="${item.id}" class="reply-btn reply-btn-submit">回复</div>
                        <div class="reply-btn reply-btn-cancel">取消</div>
                    </div>
                </div>${repliesBox}</li>`
        })
        // this.conmentStr = str
        let htmlStr = `<p class="reply-title">评论（${arr.length}条）</p><ul class="reply-content">`
        // let conmentsStr = self.getConmentsStr(data)
        htmlStr += str
        // htmlStr += `</ul><p class="all-reply-btn ${data.recordCount <= (currentPage - 1) * pageSize + data.inforList.length ? 'none' : 'block'}">查看更多评论</p>`
        htmlStr += `</ul>`
        this.warp.find('.reply-section').html(htmlStr)
    }

    getSencordConmentsStr (arr, len) {
        let str = ''
        // let currArr = len === 'all' ? arr : arr.slice(0, len)
        let currArr = arr
        currArr.map((item) => {
            str += `
                <li class="reply-floor-item">
                    <span data-id="${item.id}" class="comment-del-btn" style="display: ${this.userId === item.passportId ? 'none' : 'none'};">删除</span>
                    <p class="reply-floor-author">${item.nickName}</p>
                    <p class="reply-floor-text">${item.content}</p>
                </li>`
        })
        return str
    }

    // 查看回复
    showReply (data, $this, type) {
        let len = type === 'all' ? 'all' : 3
        let secordStr = this.getSencordConmentsStr(data, len)
        $this.parent('.secord-reply').find('.reply-floor').html(secordStr)
        $this.css({'display': 'none'})
        if (type === 'all') {
            $this.siblings('.show-secord-other').css({'display': 'block'})
        } else {
            $this.siblings('.show-secord-all').css({'display': 'block'})
        }
    }

    // 回复
    replyNewsComments (commentsId, content) {
        let sendData = {
            pid: commentsId,
            content: content,
            passportId: Cookies.get('hx_user_id'),
            token: Cookies.get('hx_user_token'),
            iconUrl: Cookies.get('hx_user_url'),
            nickName: Cookies.get('hx_user_nickname')
        }
        this.websocket.send(`{"type": 2001, "castId": ${this.castId}, "data": ${JSON.stringify(sendData)}}`)
    }
    // 发送评论
    addNewsComments (content) {
        let sendData = {
            content: content,
            passportId: Cookies.get('hx_user_id'),
            token: Cookies.get('hx_user_token'),
            iconUrl: Cookies.get('hx_user_url'),
            nickName: Cookies.get('hx_user_nickname')
        }
        this.websocket.send(`{"type": 2001, "castId": ${this.castId}, "data": ${JSON.stringify(sendData)}}`)
    }
}

// 直播中
class LiveDetailConnect {
    constructor (castId, warp, url) {
        this.warp = warp
        this.websocket = null
        this.url = !url ? `ws://${config.pcUrl}/push/websocket/text` : url
        this.castId = castId
        this.contentList = [] // 直播列表
        this.status = 2 // 即将开始0， 进行中1， 已结束2
        this.reply = null
        this.type = 0
        this.replyList = []
        this.lastTime = 0
        this.preUpTime = 5
    }

    init () {
        // let self = this
        if ('WebSocket' in window) {
            this.websocket = new WebSocket(this.url)
            // 加载关闭
            window.onbeforeunload = () => {
                alert(this.status)
                this.websocket.close()
            }
            // 连接
            this.getWebSocketConnect()
            // $('#replyBox').on('click', function () {
            //     self.sendComment()
            // })
        } else {
            alert('当前浏览器 Not support websocket')
        }
    }

    // 连接
    getWebSocketConnect () {
        let self = this
        // 连接发生错误的回调方法
        this.websocket.onerror = () => {
            // console.log('WebSocket连接发生错误')
        }
        // 连接成功建立的回调方法
        this.websocket.onopen = () => {
            // console.log('WebSocket连接成功')
            this.websocket.send(`{"type": 0, "castId": ${this.castId}}`)
            // 评论
            if ($('#replyBox').length > 0) {
                this.reply = new Reply($('#replyBox'), this.castId, this.websocket)
                this.reply.init()
            }
        }
        // 接收到消息的回调方法
        this.websocket.onmessage = function (event) {
            let data = JSON.parse(event.data)
            self.getWebSocketSuccess(data)
        }

        // 连接关闭的回调方法
        this.websocket.onclose = () => {
            // console.log('WebSocket连接关闭')
            if (this.type === 4) {
                getPreLiveInfo(this.warp, this.castId)
            }
        }
    }

    // 请求成功
    getWebSocketSuccess (res) {
        // type: 0进入直播间，5: 开后台已经开始，1 直播内容， 2 删除直播内容, 3 修改直播内容, 4 停止直播，2002评论列表, 2001接受新的评论
        if (res.type === 0) {
            // 进入直播间
            let room = res.data.room
            this.renderRoomInfo(room)
            this.contentList = res.data.contentList
            this.renderLiveList()
        } else if (res.type === 1) {
            // 直播内容
            this.contentList = [
                res.data,
                ...this.contentList
            ]
            this.renderLiveList()
        } else if (res.type === 2) {
            //  删除直播内容
            // console.log('删除直播内容')
            let index = this.contentList.findIndex((item, index, arr) => {
                return item.content.contentId === res.data.contentId
            })
            if (index === -1) {
                return
            }
            this.contentList = [
                ...this.contentList.slice(0, index),
                ...this.contentList.slice(index + 1)
            ]
            this.renderLiveList()
        } else if (res.type === 3) {
            // 修改直播内容
            // console.log('修改直播内容')
            let index = this.contentList.findIndex((item, index, arr) => {
                return item.content.contentId === res.data.contentId
            })
            if (index === -1) {
                return
            }
            let currItem = this.contentList[index]
            let content = {
                ...currItem.content,
                ...res.data
            }
            this.contentList = [
                ...this.contentList.slice(0, index),
                {
                    ...currItem,
                    content: content
                },
                ...this.contentList.slice(index + 1)
            ]
            this.renderLiveList()
        } else if (res.type === 4) {
            // 结束直播
            $('.live-state').removeClass().addClass(`live-state state2`)
            this.status = 2
            this.type = 4
            // console.log('结束直播')
            // this.websocket.close()
        } else if (res.type === 5) {
            $('.live-state').removeClass().addClass(`live-state state1`)
        } else if (res.type === 2002) {
            // 评论列表
            this.replyList = !res.data ? [] : res.data
            this.reply.getConmentsStr(this.replyList)
        } else if (res.type === 2001) {
            // 接收新的评论
            if (!res.data.pid) {
                this.replyList = [
                    res.data,
                    ...this.replyList
                ]
                this.reply.getConmentsStr(this.replyList)
            } else {
                let index = this.replyList.findIndex((item, index, arr) => {
                    return item.id === res.data.pid
                })
                if (index === -1) {
                    return
                }
                let currReply = this.replyList[index]
                let secordReply = currReply.reply
                if (!secordReply) {
                    currReply = {
                        ...currReply,
                        reply: [res.data]
                    }
                } else {
                    currReply = {
                        ...currReply,
                        reply: [
                            res.data,
                            ...secordReply
                        ]
                    }
                }
                this.replyList = [
                    ...this.replyList.slice(0, index),
                    currReply,
                    ...this.replyList.slice(index + 1)
                ]
                this.reply.getConmentsStr(this.replyList)
            }
        }
        // this.type = res.type
    }

    // 直播信息
    renderRoomInfo (info) {
        let guest = info.guest
        let webcast = info.webcast
        let guestBox = $('.figure')
        guestBox.find('.portrait img').attr('src', guest.headUrl).attr('alt', guest.userName)
        guestBox.find('.name h5').html(guest.userName)
        guestBox.find('.name p').html(guest.description)

        $('.live-topic-img').attr('src', webcast.backImage)
        $('.introduce-text p').html(webcast.desc)
        $('.live-state').removeClass().addClass(`live-state state${webcast.status}`)
        this.status = webcast.status
    }

    // 直播对话str
    renderLiveList () {
        if (!this.contentList || this.contentList.length < 1) {
            $('#livListBox').html('<div class="no-cont">暂无直播内容...</div>')
            return
        }
        let str = ''
        this.lastTime = 0
        this.contentList.map((item) => {
            str += this.liveItemStr(item)
        })
        $('#livListBox').html(str)
    }

    liveItemStr (item) {
        let content = item.content
        let user = item.user
        let createTime = new Date(content.createTime)
        let timeStr = ''
        if (this.lastTime === 0) {
            this.lastTime = content.createTime
            let diffTime = (new Date().getTime() - content.createTime) / 1000 / 60
            if (diffTime > this.preUpTime) {
                this.lastTime = content.createTime
                timeStr = `<div class="live-cont-time">${add0(createTime.getHours())}:${add0(createTime.getMinutes())}</div>`
            }
        } else {
            let diffTime = (this.lastTime - content.createTime) / 1000 / 60
            if (diffTime > this.preUpTime) {
                this.lastTime = content.createTime
                timeStr = `<div class="live-cont-time">${add0(createTime.getHours())}:${add0(createTime.getMinutes())}</div>`
            }
        }
        let str = `
        <div class="live-cont">
            ${timeStr}
            <div class="${parseInt(user.userType) === 2 ? 'left clearfix' : 'right clearfix'}">
                <div class="live-portrait">
                    <img src="${user.headUrl}" alt="${user.userName}">
                </div>
                <div class="live-right-cont">
                    <div class="user-name">${user.userName}</div>
                    <div class="live-cont-reply-box">
                        <div class="rr"><img src="${parseInt(user.userType) === 2 ? '../../img/liveDetail/r-r.png' : '../../img/liveDetail/r-r2.png'}" alt="火星财经"></div>
                        <div class="live-cont-text">
                            ${content.content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
        return str
    }
}

export {
    LiveDetailConnect
}
