/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */

import {
    pageLoadingHide, axiosAjax, proxyUrl, fomartQuery, getTimeContent, getTimeContentToTime
} from './public/public'
import {NewsAuthor} from './modules/index'
import {Reply} from './newsDetail/index'
import Cookies from 'js-cookie'
$(function () {
    pageLoadingHide()
    let newsDataInfo = $('.video-details').data('info')
    let newsId = newsDataInfo.id
    // 作者信息
    axiosAjax({
        type: 'get',
        url: `${proxyUrl}/info/news/getauthorinfo?${fomartQuery({
            passportId: newsDataInfo.createdBy,
            myPassportId: !Cookies.get('hx_user_id') ? '' : Cookies.get('hx_user_id')
        })}`,
        formData: false,
        params: {},
        fn: function (res) {
            if (res.code === 1) {
                let author = new NewsAuthor(res.obj)
                // author.init($('.authorinfo'), 'right')
                author.init($('.authorinfo-bottom'), 'bottom')
                $('.t-name em').html(res.obj.newsCount)
                $('.author-x').attr('src', res.obj.iconUrl)
                $('.t-slogan').html(res.obj.introduce)
                // let bottom = new newsAuthor($('.authorinfo-bottom'), res.obj, 'bottom')
                // bottom.init()
            }
        }
    })
    // 评论
    // let newsId = getQueryString('id')
    let reply = new Reply($('#replyBox'), newsId, 'video')
    reply.init()
    // 最新视频
    axiosAjax({
        type: 'get',
        url: `${proxyUrl}/info/video/getvideolist`,
        formData: false,
        params: {
            currentPage: 1,
            pageSize: 2
        },
        fn: function (res) {
            let newestVideo = res.obj.inforList
            let str = ''
            newestVideo.map((item, index) => {
                let imgUrl = JSON.parse(item.coverPic).pc
                str += `<div class="video-list" data-src="">
                        <a title="${item.title}" href='/videoDetails/${item.id}/${item.publishTime}'>
                            <div class="list-img"><img src="${imgUrl}" alt="${item.title}"></div>
                            <div class="list-text">
                                <h3>${item.title}</h3>
                                <p>${getTimeContent(item.publishTime, new Date().getTime(), '刚刚', '分钟前', '小时前')}</p>
                            </div>
                        </a>
                    </div>`
            })
            $('.newest-video').html(str)
        }
    })

    // 快讯
    const newsFlash = () => {
        axiosAjax({
            type: 'GET',
            url: proxyUrl + '/info/lives/showlives?currentPage=1&pageSize=20',
            params: {},
            noloading: true,
            fn: function (resData) {
                if (resData.code === 1) {
                    let flashDataFirst = resData.obj.inforList[0]
                    let itemBox = $('.item-box .item').eq(0).attr('id')
                    if (flashDataFirst.id === itemBox) {
                        return false
                    } else {
                        let str = ''
                        resData.obj.inforList.map((item, index) => {
                            let startIndex = item.content.indexOf('【') === -1 ? 0 : item.content.indexOf('【') + 1
                            let endIndex = item.content.indexOf('】') === -1 ? 0 : item.content.indexOf('】')
                            let title = item.content.substring(startIndex, endIndex)
                            str += `<div class="item fadeIn" id="${item.id}">
                                    <div class="${parseInt(item.tag) === 2 ? 'item-icons import' : 'item-icons'}">
                                        <div class="time-left">
                                            <span>${getTimeContentToTime(item.createdTime, '')}</span>
                                        </div>
                                    </div>
                                    <a target="_blank" title="${title}" href="/liveNewsDetail/${item.id}"><h3>${title}</h3></a>
                                </div>`
                        })
                        $('.item-box').html(str)
                    }
                }
            }
        })
    }
    newsFlash()
    setInterval(newsFlash, 10000)
})
