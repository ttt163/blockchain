/**
 * Author：tantingting
 * Time：2018/4/16
 * Description：Description
 */

import {axiosAjax, proxyUrl, formatDate, fomartQuery, getHost, showLogin} from '../public/public'
import Cookies from 'js-cookie'

// 广告
const ad = (arr, num) => {
    if (num === 6) {
        let itemBottomStr = ''
        if (arr.length === 0) {
            $('.ad-bottom').css('display', 'none')
        } else {
            $('.ad-bottom').css('display', 'block')
            arr.map((item, index) => {
                if (index > 2) {
                    return false
                } else {
                    itemBottomStr += `<a href=${item.url} rel="nofollow" title=${item.title} target="_blank">
                            <img src=${item.img_url} title=${item.title} alt=${item.title}>
                            <h6>${item.title}</h6>
                            <p>${item.description}</p>
                        </a>`
                }
            })
        }
        return !arr.length ? '' : itemBottomStr
    }
    if (num === 7) {
        let itemRightStr = ''
        if (arr.length === 0) {
            $('.news-advertising').css({'height': 0, 'marginBottom': 0})
        } else {
            $('.news-advertising').css({'height': '250', 'marginBottom': 20})
            arr.map((item) => {
                itemRightStr += `<div class="swiper-slide">
                        <a href=${item.url} title=${item.remake} target="_blank" rel="nofollow" class="slide-list clearfix">
                            <img src=${item.img_url} alt="" title=${item.remake} alt=${item.remake}>
                        </a>
                        <span><img src="../../img/newsDetail/ad-title.png" alt=""></span>
                    </div>`
            })
        }
        return !arr.length ? '' : itemRightStr
    }
}

// 感兴趣的内容
const relatedNews = (dataArr, dir) => {
    let itemStr = ''
    let str = ''
    let arr = !dataArr ? [] : dataArr
    if (dir === 'right') {
        if (!arr.length) {
            return `<div class="new-list-box"><div class="loading">暂无内容！</div></div>`
        }
        arr.map((item) => {
            itemStr += `<a title="${item.title}" class="list-box" target="_blank" href="${getHost()}/newsdetail/${item.id}.html">
                            <div>
                                <div class="left-img">
                                    <img src="${!item.coverPic ? `http://static.huoxing24.com/images/2018/03/05/1520243882098653.svg` : JSON.parse(item.coverPic).pc}" alt="${item.title}">
                                </div>
                                <h3 class="right-text">${item.title}</h3>
                                <span class="time">${!item.createTime ? '' : formatDate(item.createTime, '.')}</span>
                            </div></a>`
        })
        str = `<div class="new-list-box">${itemStr}</div>`
    }
    return str
}
// 相关新闻
const hotNews = (dataArr) => {
    let str = ''
    let arr = !dataArr ? [] : dataArr
    arr.map((item) => {
        let imgSrc = JSON.parse(item.coverPic)
        str += `<a href="/newsdetail/${item.id}" title=${item.title} target="_blank">
                            <img src=${imgSrc.pc} alt=${item.title}  title=${item.title}>
                            <p>${item.title}</p>
                        </a>`
    })
    return str
}

// 作者
class NewsAuthor {
    constructor (item) {
        // this.dir = !dir ? 'right' : dir // right,bottom
        this.info = item
        // this.warp = warp
        this.htmlStr = ``
    }

    init (warp, dir) {
        let self = this
        warp.html(this.getStr(dir))
        warp.find('.attention').on('click', function () {
            // let type = 'add'
            if (!Cookies.get('hx_user_id')) {
                showLogin('login', '账号密码登录', '登录')
                return
            }
            let ifCollect = parseInt(self.info.ifCollect)
            let infoData = self.info
            let type = ifCollect === 1 ? 'delete' : 'add'
            // let $this = $(this)
            self.attention(type, (res) => {
                if (res.code === 1) {
                    if (ifCollect === 1) {
                        // 取消关注
                        infoData = {
                            ...infoData,
                            ifCollect: 0,
                            followCount: infoData.followCount - 1
                        }
                        $('.attention').html('关注').removeClass('active')
                    } else {
                        // 关注
                        infoData = {
                            ...infoData,
                            ifCollect: 1,
                            followCount: infoData.followCount + 1
                        }
                        $('.attention').html('已关注').addClass('active')
                    }
                    $('.fans-num').html(infoData.followCount)
                    self.info = infoData
                }
            })
        })
    }

    getStr (dir) {
        if (dir === 'right') {
            let stateTyep = ''
            let stateTitle = ''
            if (parseInt(this.info.role) === 2) {
                stateTyep = 'v-compile'
                stateTitle = '官方账号'
            }
            if (parseInt(this.info.vGrade) === 1) {
                stateTyep = 'v-personal'
                stateTitle = this.info.nickName
            } else if (parseInt(this.info.vGrade) === 2) {
                stateTyep = 'v-enterprise'
                stateTitle = this.info.nickName
            }
            let infolistArr = !this.info.infolist ? [] : this.info.infolist
            let infolistStr = ''
            infolistArr.map((item) => {
                infolistStr += `<a href="/newsdetail/${item.id}" title=${item.title} target="_blank" class="clearfix">
                                <span></span>
                                <p>${item.title}</p>
                            </a>`
            })
            this.htmlStr = `
                    <div class="authorinfo-top clearfix">
                        <a href="/newsauthor/${this.info.passportId}" title="${this.info.nickName}" target="_blank"><img class="portrait" src="${this.info.iconUrl}" alt="${this.info.nickName}"></a>
                        <span class=${stateTyep} title=${stateTitle}></span>
                        <div class="introduce">
                            ${parseInt(this.info.ifCollect) === 1 ? `<div class="attention active">已关注</div>` : `<div class="attention">关注</div>`}
                            <h3><a href="/newsauthor/${this.info.passportId}" title="${this.info.nickName}" target="_blank">${this.info.nickName}</a></h3>
                            <p>${!this.info.introduce ? '' : this.info.introduce}</p>
                        </div>
                    </div>
                    <div class="authorinfo-infolist" style="display: ${!this.info.infolist ? 'none' : 'block'}">
                        <h5>最近更新</h5>
                        <div class="authorinfo-news">${infolistStr}</div>
                    </div>`
        }
        return this.htmlStr
    }

    attention (type, fun) {
        let sendData = {
            'passportid': !Cookies.get('hx_user_id') ? '' : Cookies.get('hx_user_id'),
            'token': !Cookies.get('hx_user_token') ? '' : Cookies.get('hx_user_token'),
            'authorId': this.info.passportId
        }
        let url = `${proxyUrl}/info/follow/author/${type}?${fomartQuery(sendData)}`
        axiosAjax({
            type: 'post',
            url: url,
            formData: false,
            params: {},
            fn: function (resData) {
                if (fun) {
                    fun(resData)
                }
            }
        })
    }
}

export {
    ad,
    relatedNews,
    NewsAuthor,
    hotNews
}
