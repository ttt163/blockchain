/**
 * Author：tantingting
 * Time：2018/4/23
 * Description：Description
 */
import Cookies from 'js-cookie'
import layer from 'layui-layer'
import LazyLoading from './modules/lazyLoading'
import {
    pageLoadingHide,
    axiosAjax,
    proxyUrl,
    fomartQuery,
    getTimeContent,
    getHost,
    getTimeContentToTime,
    showLogin
} from './public/public'

import { AsideMarked } from './newsDetail/index'
// import {initTopMarkets} from './index/topMarket'

let userId = !Cookies.get('hx_user_id') ? '' : Cookies.get('hx_user_id')
$(function () {
    // 关闭国庆背景
    $('.national-btn').click(function () {
        $('.national-section').fadeOut(100)
        $('.hx-main-box').stop().animate({
            'marginTop': 0
        }, 100)
    })
    const marsNewId = 333 // 火星专栏虚假id
    let jsonData = JSON.parse($('#jsonData').val())
    // 涨幅榜
    let indexMmarket = new AsideMarked($('.market-cont'))
    indexMmarket.init()
    pageLoadingHide()

    // 推荐新闻
    let recommendSwiper = new Swiper('.swiper-container.primary-carousel', {
        nextButton: '.swiper-button-next.rm-next',
        prevButton: '.swiper-button-prev.rm-prev',
        pagination: '.swiper-pagination.rm-pag',
        paginationType: 'progress',
        loop: true,
        preventClicks: false,
        autoplay: 5000,
        autoplayDisableOnInteraction: false
    })
    recommendSwiper.autoplay = true

    // 首页顶部广告
    let topAdSwiper = new Swiper('.swiper-container.top-ad-swiper', {
        pagination: '.top-ad-swiper-wrap .swiper-pagination',
        // 如果需要前进后退按钮
        nextButton: '.top-ad-swiper-wrap .swiper-button-next',
        prevButton: '.top-ad-swiper-wrap .swiper-button-prev',
        paginationClickable: true,
        loop: false,
        autoplay: 5000,
        preventClicks: false
    })
    topAdSwiper.autoplay = true

    // 首页广告
    let advertisingSwiper = new Swiper('.swiper-container.ad', {
        pagination: '.swiper-pagination.ad-page',
        paginationClickable: true,
        loop: false,
        autoplay: 5000,
        autoplayDisableOnInteraction: false,
        preventClicks: false
    })
    advertisingSwiper.autoplay = true

    // 首页专栏作家
    let authorSwiper = new Swiper('.swiper-container.author', {
        pagination: '.swiper-pagination.author-page',
        paginationClickable: true,
        loop: false,
        autoplay: 5000,
        autoplayDisableOnInteraction: false,
        preventClicks: false
    })
    authorSwiper.stopAutoplay()
    $(window).scroll(() => {
        let t = $(window).scrollTop()
        if (t > ($('.index-news-right').offset().top)) {
            authorSwiper.stopAutoplay()
            authorSwiper.slideTo(1)
        } else {
            authorSwiper.startAutoplay()
        }
    })

    // 首页往期活动
    let activitySwiper = new Swiper('.swiper-container.activity', {
        pagination: '.swiper-pagination.activity-page',
        paginationClickable: true,
        loop: false,
        autoplay: 5000,
        preventClicks: false,
        autoplayDisableOnInteraction: false
    })
    activitySwiper.autoplay = true

    let mySwiper = new Swiper('#adSwiper', {
        loop: false,
        autoplay: 5000,
        pagination: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        preventClicks: false
    })
    const $adSwiper = $('.ad-swiper')
    $adSwiper.on('mouseenter', function () {
        mySwiper.stopAutoplay()
    })
    $adSwiper.on('mouseleave', function () {
        mySwiper.startAutoplay()
    })
    $adSwiper.on('click', 'a', function () {
        let href = $(this).attr('href')
        window.open(href, '_black')
    })

    // 人民币兑换美元
    const getUSD = () => {
        axiosAjax({
            type: 'get',
            url: proxyUrl + '/market/coin/financerate',
            formData: false,
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    let data = res.data.legal_rate.CNY
                    Cookies.set('USD', data)
                }
            }
        })
    }
    getUSD()
    if (Cookies.get('USD') === undefined) {
        getUSD()
    }

    // 顶部行情
    // initTopMarkets()

    // 快讯
    const newsFlash = () => {
        axiosAjax({
            type: 'GET',
            url: proxyUrl + '/info/lives/showlives?currentPage=1&pageSize=10',
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
                            str += `<div class="item fadeIn ${parseInt(item.tag) === 2 ? 'item-icons import' : 'item-icons'}" id="${item.id}">
                                        <div class="time-left">
                                            <span>${getTimeContentToTime(item.createdTime, '')}</span>
                                        </div>
                                        <a target="_blank" title="${title}" href="/liveNewsDetail/${item.id}"><h3>${title}</h3></a>
                                    <div class="share-box">
                                        <span>分享:</span>
                                        <div class="share-newFlash" data-weibo-title="${title}"  data-qq-title="${title}"data-url="/liveNewsDetail/${item.id}" data-description="${title}"></div>
                                    </div>
                                </div>`
                        })
                        $('.item-box').html(str)
                        $('.share-newFlash').share({sites: ['wechat', 'weibo', 'qq']})
                    }
                }
            }
        })
    }
    setInterval(newsFlash, 10000)

    // 快讯分享
    $('.share-newFlash').share({sites: ['wechat', 'weibo', 'qq']})

    // 懒加载
    let loadingNew = new LazyLoading($('#newsBlock0'))
    loadingNew.init()
    let loadingIndexRight = new LazyLoading($('.main-box-right'))
    loadingIndexRight.init()

    // 新闻
    let loadMoreId = 0
    $('#newsTabs li').on('click', function () {
        if ($(this).hasClass('active')) {
            return
        }
        let id = $(this).data('id')
        loadMoreId = id
        $('#newsTabs li').removeClass('active')
        $(this).addClass('active')
        $('.block-style').css({'display': 'none'})
        $(`#newsBlock${id}`).css({'display': 'block'})
        if (!$(this).data('loading')) {
            $(this).data('loading', 'true')
            new LazyLoading($(`#newsBlock${id}`)).init()
        }
    })

    // 火星号专栏新闻
    const getMarksNews = (obj) => {
        let sendData = {
            currentPage: 1,
            pageSize: 20,
            ...obj
        }
        let id = marsNewId
        axiosAjax({
            type: 'complexpost',
            url: proxyUrl + '/info/news/column/list',
            params: sendData,
            fn: function (res) {
                ifLoad = true
                if (res.code === 1) {
                    let list = !res.obj.inforList || !res.obj.inforList.length ? [] : res.obj.inforList
                    let block = $(`#newsBlock${id}`)
                    block.find('.news-list-content').append(getNewsStr(res.obj))
                    block.find('.check-more-load').data('pagecount', res.obj.pageCount).data('currpage', sendData.currentPage).data('time', list[list.length - 1].publishTime)
                }
            }
        })
    }

    // 加载更多
    let ifLoad = true
    $(window).scroll(function () {
        const $loadMore = $('#loadMore' + loadMoreId)
        const height = $('.header-nav-wrap').height() + $('.hx-main-box').height() + $('#header-roll-msg-wrap').height()
        if ($(this).scrollTop() >= (height - 200 - $(this).height()) && $loadMore.data('currpage') <= 2 && ifLoad) {
            ifLoad = false
            loadMore($loadMore)
        }
    })

    $('.check-more-load').on('click', function () {
        loadMore($(this))
    })
    function loadMore ($this) {
        let pageCount = $this.data('pagecount')
        let currPage = $this.data('currpage')
        let size = $this.data('size')
        let id = parseInt($this.data('id'))
        currPage = parseInt(currPage) + 1
        let lastTime = $this.data('time')
        if (currPage > pageCount) {
            layer.msg('暂无更多新闻 !')
            return
        }
        if (id === 0) {
            let refreshTime = $this.data('refreshtime')
            getNewsRecommend(id, refreshTime, currPage, size)
        } else if (id === marsNewId) {
            getMarksNews({
                currentPage: currPage,
                pageSize: size,
                refreshTime: lastTime
            })
        } else {
            getNewsList(currPage, size, id, lastTime)
        }
    }

    function getNewsStr (obj) {
        let arr = obj.inforList
        let currentTime = obj.currentTime
        let str = ''
        arr.map((item) => {
            let arrTags = !item.tags ? '' : item.tags.split(',')
            let strA = ''
            let currNavIndex = jsonData.newNavData.findIndex((navItem) => {
                return navItem.channelId === item.channelId
            })
            arrTags.map((itemA, index) => {
                if (index === 0) {
                    strA += ` <a title=${itemA} target="_blank" href="${getHost()}/hot/${itemA}">${itemA}</a>`
                } else if (index > 0 && index <= 2) {
                    strA += `, <a title=${itemA} target="_blank" href="${getHost()}/hot/${itemA}">${itemA}</a>`
                }
            })
            str += `<div class="index-news-list">
                        <a title="${item.title}" target="_blank" href="${getHost()}/newsdetail/${item.id}.html">
                        <div class="list-left">
                                 <span class="channel-text">${jsonData.newNavData[currNavIndex].channelName}</span>
                                <img src="${(!item.coverPic || !JSON.parse(item.coverPic).pc) ? `http://static.huoxing24.com/images/2018/03/05/1520243882098653.svg` : JSON.parse(item.coverPic).pc}" alt="${item.title}">
                        </div>
                        <div class="list-right" style="width: 560px;">
                            <h1 class="headline">${item.title}</h1>
                            <h3 class="details">${item.synopsis}</h3>
                        </div>
                        </a>
                        <div class="list-bottom index-mian clearfix">
                            <p class="name">${item.cateId === 1 ? item.nickName : item.author}</p>
                            <p class="lock-time">${!item.score ? getTimeContent(item.publishTime, currentTime) : ''}</p>
                            <p class="read-num main-read-num"><span class="count-eye">关键字:</span>${strA}</p>
                        </div>
                        <div class="shadow"></div>
                    </div>`
        })
        return str
    }

    function getNewsList (currPage, pageSize, id, lastTime, fn) {
        let sendData = null
        if (typeof lastTime === 'function') {
            sendData = {
                currentPage: !currPage ? 1 : currPage,
                pageSize: !pageSize ? 25 : pageSize,
                channelId: !id ? 0 : id
            }
        } else {
            sendData = {
                currentPage: !currPage ? 1 : currPage,
                pageSize: !pageSize ? 25 : pageSize,
                channelId: !id ? 0 : id,
                refreshTime: lastTime
            }
        }
        axiosAjax({
            type: 'get',
            url: proxyUrl + `/info/news/shownews?${fomartQuery(sendData)}`,
            formData: false,
            params: {},
            fn: function (res) {
                ifLoad = true
                if (res.code === 1) {
                    let list = res.obj.inforList
                    if (typeof lastTime === 'function') {
                        lastTime(res)
                    }
                    if (fn) {
                        fn(res)
                    }
                    let block = $(`#newsBlock${id}`)
                    block.find('.news-list-content').append(getNewsStr(res.obj))
                    block.find('.check-more-load').data('pagecount', res.obj.pageCount).data('currpage', sendData.currentPage).data('time', list[list.length - 1].publishTime)
                }
            }
        })
    }

    // 首页推荐
    function getNewsRecommend (id, refreshTime, currentPage, pageSize, fn) {
        let sendData = {
            refreshType: 2,
            refreshTime: refreshTime,
            passportId: !userId ? '' : userId,
            currentPage: currentPage,
            pageSize: pageSize
        }
        axiosAjax({
            type: 'post',
            url: proxyUrl + `/info/recommend/getnews`,
            formData: true,
            params: sendData,
            fn: function (res) {
                ifLoad = true
                if (res.code === 1) {
                    let list = res.obj.inforList
                    let lastTime = list.pop().publishTime
                    let block = $(`#newsBlock${id}`)
                    block.find('.news-list-content').append(getNewsStr(res.obj))
                    block.find('.check-more-load').data('pagecount', res.obj.pageCount).data('currpage', sendData.currentPage).data('time', list[list.length - 1].publishTime).data('refreshtime', lastTime)
                }
            }
        })
    }

    // 关注作者
    $('.cancel-attention').on('click', function () {
        let authorId = $(this).data('id')
        attention(authorId, 'delete', (res) => {
            if (res.code === 1) {
                layer.msg('关注已取消')
                $(this).css({'display': 'none'})
                $(this).siblings('.attention').css({'display': 'block'})
                let crowd = $(this).closest('.list-author').find('.crowd span')
                let count = parseInt(crowd.text()) - 1
                crowd.html(count)
            } else {
                layer.msg(res.msg)
            }
        })
    })
    $('.attention').on('click', function () {
        let authorId = $(this).data('id')
        if (!Cookies.get('hx_user_id')) {
            showLogin('login', '账号密码登录', '登录')
            return
        }
        attention(authorId, 'add', (res) => {
            if (res.code === 1) {
                layer.msg('关注成功')
                $(this).css({'display': 'none'})
                $(this).siblings('.cancel-attention').css({'display': 'block'})
                let crowd = $(this).closest('.list-author').find('.crowd span')
                let count = parseInt(crowd.text()) + 1
                crowd.html(count)
            } else if (res.code === 0) {
                layer.msg(res.msg)
                $(this).css({'display': 'none'})
                $(this).siblings('.cancel-attention').css({'display': 'block'})
            } else {
                layer.msg(res.msg)
            }
        })
    })

    function attention (authorId, type, fun) {
        let sendData = {
            'passportid': Cookies.get('hx_user_id'),
            'token': Cookies.get('hx_user_token'),
            'authorId': authorId
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
})
