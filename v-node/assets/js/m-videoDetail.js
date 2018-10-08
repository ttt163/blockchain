/**
 * Author：zhoushuanglong
 * Time：2018-04-08 15:46
 * Description：Description
 */

import {pageLoadingHide, axiosAjax, proxyUrl, fomartQuery, getTimeContent, getHost} from '../js/public/public'
import {TopNav} from './modules/m-topNav'

$(function () {
    pageLoadingHide()
    let currBox = $('#currNewsBox')
    let searchId = currBox.data('id')

    let topNav = new TopNav({isHideTop: false})
    topNav.init()

    let moreState = true

    currBox.find('.btn-more').click(function () {
        if (moreState) {
            moreState = false
            let currPage = currBox.data('page')
            getNewsList({
                currentPage: currPage
            })
        }
    })

    function getNewsList (obj) {
        let sendData = {
            currentPage: currBox.data('page'),
            pageSize: 20,
            channelId: searchId,
            ...obj
        }
        let pageCount = currBox.data('count')
        if (sendData.currentPage > pageCount) {
            currBox.find('.btn-more').html('没有更多了')
            return
        }
        axiosAjax({
            type: 'get',
            url: `${proxyUrl}/info/news/shownews?${fomartQuery(sendData)}`,
            formData: false,
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    let data = res.obj
                    currBox.data('page', data.currentPage)
                    renderNewsList(data)
                    moreState = true
                }
            }
        })
    }

    function renderNewsList (obj) {
        let str = ''
        let arr = !obj.inforList ? [] : obj.inforList
        arr.map((item) => {
            str += `<div class="news-list-more ">
                        <a title="${item.title}" href="${getHost()}/newsdetail/${item.id}.html}">
                            <div class="title">${item.title}</div>
                            <div class="list-text">
                                <div class="author read-number clearfix"><sapn>${item.hotCounts}</sapn></div>
                                <div class="time clearfix"><span>${getTimeContent(item.publishTime, obj.currentTime)}</span></div>
                            </div>
                            <div class="cover-img-sma"><img src="${!item.coverPic || !JSON.parse(item.coverPic).wap_small ? '' : JSON.parse(item.coverPic).wap_small}" alt="${item.title}"></div>
                        </a>
                    </div>`
        })
        currBox.find('.list-box').append(str)
    }
    // 最新视频
    function newestVideo () {
        axiosAjax({
            type: 'get',
            url: `${proxyUrl}/info/video/getvideolist`,
            formData: false,
            params: {
                currentPage: 1,
                pageSize: 3
            },
            fn: function (res) {
                if (res.code === 1) {
                    let data = res.obj
                    renderNewestVideo(data)
                }
            }
        })
    }
    newestVideo()
    function renderNewestVideo (obj) {
        let str = ''
        let dataArr = !obj.inforList ? [] : obj.inforList
        dataArr.map((item) => {
            let imgUrl = JSON.parse(item.coverPic)
            str += `<div class="newest-list">
                        <a href="/videoDetails/${item.id}/${item.createTime}">
                            <div class="list-img"><img src="${imgUrl.video_m}" alt=""></div>
                            <div class="list-right">
                                <h6>${item.title}</h6>
                                <div class="author-time">
                                    <p class="newest-author">${item.author}</p>
                                    <p class="time">${getTimeContent(item.createTime, new Date().getTime(), '刚刚', '分钟前', '小时前')}</p>
                                </div>
                            </div>
                        </div>
                        </a>
                </div>`
        })
        $('.newest-box').html(str)
    }
    // 评论
    function renderCommentVideo (obj) {
        let str = ''
        let arr = !obj.inforList ? [] : obj.inforList
        arr.map((item) => {
            str += `<div class="comment-list clearfix">
                        <div class="user-img"><img src="${item.comment.userIcon}" alt=""></div>
                        <div class="comment-text">
                            <div class="name">${item.comment.userNickName}</div>
                            <div class="text">${item.comment.content}</div>
                            <div class="time">${getTimeContent(item.comment.createTime, new Date().getTime(), '刚刚', '分钟前', '小时前')}</div>
                        </div>
                    </div>`
        })
        $('.comment-box').html(str)
    }
    function getVideoComment () {
        let sendData = {
            id: $('.curr-video').data('id'),
            currentPage: 1,
            pageSize: 5
        }
        axiosAjax({
            type: 'get',
            url: `${proxyUrl}/info/comment/getbyarticle?${fomartQuery(sendData)}`,
            formData: false,
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    let data = res.obj
                    renderCommentVideo(data)
                }
            }
        })
    }
    getVideoComment()
})
