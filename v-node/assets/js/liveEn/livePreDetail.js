/**
 * Author：tantingting
 * Time：2018/6/19
 * Description：Description
 */
import {add0, getTimeContent, axiosAjax, fomartQuery} from '../public/public'
import Cookies from 'js-cookie'
// import layer from 'layui-layer'
const {pcUrl} = require('../../../config.js')
let proxyUrl = `http://${pcUrl}`
// 评论
class PreReply {
    constructor (warp, id) {
        this.warp = warp
        this.castId = id
        this.userNickName = Cookies.get('hx_user_nickname') ? Cookies.get('hx_user_nickname') : ''
        this.userId = Cookies.get('hx_user_id') ? Cookies.get('hx_user_id') : ''
        this.nickUrl = Cookies.get('hx_user_url') ? Cookies.get('hx_user_url') : ''
        this.token = Cookies.get('hx_user_token') ? Cookies.get('hx_user_token') : ''
        this.conmentStr = ''
        this.list = []
    }

    init () {
        let self = this
        let htmlStr = `<div class="reply-module"><div class="reply-section">`
        htmlStr += `</div></div>`
        this.warp.html(htmlStr)
        // 评论列表
        this.getNewsConments()

        // 查看全部回复
        this.warp.on('click', '.show-secord-all', function () {
            let index = $(this).closest('.reply-item').index()
            self.showReply(self.list[index].reply, $(this), 'all')
        })

        // 查看部分回复
        this.warp.on('click', '.show-secord-other', function () {
            let index = $(this).closest('.reply-item').index()
            self.showReply(self.list[index].reply, $(this), 'other')
        })
    }

    getConmentsStr (arr) {
        let self = this
        let str = ''
        // let recordCount = data.recordCount
        arr.map((item) => {
            let str2 = ''
            let repliesLen = !item.reply ? 0 : item.reply.length
            let repliesBox = ''
            if (!repliesLen) {
                str2 = ''
                repliesBox = `<div class="secord-reply"><ul class="reply-floor">${str2}</ul><p class="all-reply-floor show-secord-all" style="display: none;"><span>查看全部回复</span></p><p class="all-reply-floor show-secord-other" style="display: none;"><span>查看部分回复</span></p></div>`
            } else {
                str2 = this.getSencordConmentsStr(item.reply, 3)
                repliesBox = `<div class="secord-reply"><ul class="reply-floor">${str2}</ul><p class="all-reply-floor show-secord-all" style="display: ${repliesLen > 3 ? 'block' : 'none'};"><span>查看全部回复</span></p><p class="all-reply-floor show-secord-other" style="display: none;"><span>查看部分回复</span></p></div>`
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
                    </div>
                    ${repliesBox}</li>`
        })
        this.conmentStr = str
        let htmlStr = `<p class="reply-title">评论（${arr.length}条）</p><ul class="reply-content">`
        htmlStr += str
        htmlStr += `</ul>`
        self.warp.find('.reply-section').html(htmlStr)
    }

    getSencordConmentsStr (arr, len) {
        let str = ''
        let currArr = len === 'all' ? arr : arr.slice(0, len)
        currArr.map((item) => {
            str += `
                <li class="reply-floor-item">
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

    // 获取评论
    getNewsConments () {
        let self = this
        let sendData = {
            castId: this.castId
        }
        let url = `${proxyUrl}/push/text/room/comment/list?${fomartQuery(sendData)}`
        axiosAjax({
            type: 'get',
            url: url,
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    let data = res.data
                    self.list = res.data
                    self.getConmentsStr(data)
                }
            }
        })
    }
}
// 直播信息
function getPreLiveInfo (warp, id) {
    let preReply = new PreReply(warp, id)
    preReply.init()

    let preInfo = new LivePreDetail(id)
    preInfo.init()
}
class LivePreDetail {
    constructor (castId) {
        this.castId = castId
        this.reply = null
        this.replyList = []
        this.lastTime = 0
        this.preUpTime = 5
    }

    init () {
        this.getRoomInfo()
    }

    getRoomInfo () {
        let self = this
        let sendData = {castId: self.castId}
        axiosAjax({
            type: 'get',
            url: `${proxyUrl}/push/text/room/content/list?${fomartQuery(sendData)}`,
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    let data = res.data
                    if (!data) {
                        return
                    }
                    let room = data.room
                    self.renderRoomInfo(room)
                    let contentList = data.contentList
                    self.renderLiveList(contentList)
                }
            }
        })
    }

    // 直播信息
    renderRoomInfo (info) {
        let guest = info.guest
        let webcast = info.webcast
        let guestBox = $('.figure')
        guestBox.find('.portrait img').attr('src', guest.headUrl).attr('alt', guest.userName)
        guestBox.find('.name h5').html('Vitalik Buterin')
        guestBox.find('.name p').html('Vitalik Buterin is a Russian-Canadian programmer and writer who is best known for creating Ethereum, which has been called “the world’s hottest new cryptocurrency.”')

        // $('.live-topic-img').attr('src', webcast.backImage)
        $('.introduce-text p').html(webcast.desc)
        $('.live-state').removeClass().addClass(`live-state state${webcast.status}`)
    }

    // 直播对话str
    renderLiveList (contentList) {
        if (!contentList || contentList.length < 1) {
            $('#livListBox').html('<div class="no-cont">暂无直播内容...</div>')
            return
        }
        let str = ''
        this.lastTime = 0
        contentList.map((item) => {
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
    getPreLiveInfo
}
