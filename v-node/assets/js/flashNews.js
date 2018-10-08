/**
 * Author：tantingting
 * Time：2018/4/27
 * Description：Description
 */
import {
    axiosAjax,
    fomartQuery,
    getHost,
    getHourMinute,
    pageLoadingHide,
    proxyUrl,
    showLogin
} from './public/public'
import {relatedNews} from './modules/index'
import Cookies from 'js-cookie'
import layer from 'layui-layer'

$(function () {
    pageLoadingHide()

    // 前7天
    // setSevenDays()
    //
    // function setSevenDays (time) {
    //     let str = ''
    //     let days = sevenDays()
    //     days.map((item) => {
    //         let queryTime = !time ? Date.parse(new Date(days[0])).toString() : time
    //         let itemDay = new Date(item)
    //         let itemDate = Date.parse(itemDay).toString()
    //         let dataClass = queryTime.substr(0, 8) === itemDate.substr(0, 8) ? 'active' : ''
    //         str += ` <li class="date-item ${dataClass}" data-date="${itemDate}">${add0(itemDay.getDate())}日</li>`
    //     })
    //     $('.news-date-bak').html(str)
    // }
    //
    // $('.news-date').on('click', '.date-item', function () {
    //     let dateTime = $(this).data('date')
    //     getNewsList({
    //         currentPage: 1,
    //         queryTime: dateTime
    //     }, (res) => {
    //         $('#liveNewsContain').html(getNewsStr(res.obj))
    //         $(this).siblings('.date-item').removeClass('active')
    //         $(this).addClass('active')
    //     })
    // })

    $('.news-head').on('click', 'em', function () {
        let channelId = !$(this).data('channelid') ? '' : $(this).data('channelid')
        getNewsList({
            currentPage: 1,
            channelId: channelId
        }, (res) => {
            $('#liveNewsContain').html(getNewsStr(res.obj))
            $(this).siblings('em').removeClass('active')
            $(this).addClass('active')
        })
    })

    // 详情
    const $liveNewsContain = $('#liveNewsContain')
    $liveNewsContain.on('click', '.news-detail', function (e) {
        let id = $(this).data('id')
        window.open(`/liveNewsDetail/${id}.html`, '_blank')
    })
    $liveNewsContain.on('click', '.news-detail a', function (e) {
        e.stopPropagation()
        let thisUrl = $(this).data('url')
        window.open(thisUrl, '_blank')
    })
    // 利好/利空
    bindJudgeProfit()

    function bindJudgeProfit () {
        $('.judge-profit').on('click', 'p', function () {
            let $this = $(this)
            let status = $this.data('status')
            let id = $this.data('id')
            let sendData = {
                passportid: !Cookies.get('hx_user_id') ? '' : Cookies.get('hx_user_id'),
                token: !Cookies.get('hx_user_token') ? '' : Cookies.get('hx_user_token'),
                status: status,
                id: id
            }
            if (!Cookies.get('hx_user_id')) {
                showLogin('login', '账号密码登录', '登录')
            } else {
                axiosAjax({
                    type: 'get',
                    url: proxyUrl + `/info/lives/upordown?${fomartQuery(sendData)}`,
                    formData: false,
                    params: {},
                    fn: function (res) {
                        if (res.code === 1) {
                            let num = parseInt($this.find('.num').html())
                            if ($this.hasClass('active')) {
                                if (num <= 0) {
                                    $this.find('.num').html(0)
                                } else {
                                    $this.find('.num').html(num - 1)
                                }
                                $this.removeClass('active')
                            } else {
                                $this.find('.num').html(num + 1)
                                $this.addClass('active')
                                let $other = $this.siblings('p')
                                if ($other.hasClass('active')) {
                                    let otnerNum = $other.find('.num').html()
                                    if (otnerNum <= 0) {
                                        $other.find('.num').html(0)
                                    } else {
                                        $other.find('.num').html(otnerNum - 1)
                                    }
                                    $other.removeClass('active')
                                }
                            }
                        } else {
                            layer.msg(res.msg)
                        }
                    }
                })
            }
        })
    }

    // 加载更多
    let ifLoad = true
    $(window).scroll(function () {
        const height = $('.header-nav-wrap').height() + $('.flash-news-content').height() + $('#header-roll-msg-wrap').height()
        if ($(this).scrollTop() >= (height - 200 - $(this).height()) && $('.check-more-load').data('currpage') <= 2 && ifLoad) {
            ifLoad = false
            loadMore()
        }
    })
    $('.check-more-load').on('click', function () {
        loadMore()
    })

    function loadMore () {
        const $this = $('.check-more-load')
        let pageCount = $this.data('pagecount')
        let currPage = $this.data('currpage')
        currPage = parseInt(currPage) + 1
        if (currPage > pageCount) {
            layer.msg('暂无更多快讯 !')
            return
        }
        getNewsList({
            currentPage: currPage
        }, (res) => {
            $('#liveNewsContain').append(getNewsStr(res.obj))
        })
    }

    function getNewsStr (obj) {
        if (!obj.inforList) {
            return ''
        }
        let arr = obj.inforList
        let str = ''
        arr.map((item) => {
            let title = ''
            let content = item.content
            if (!item.title) {
                let startIndex = item.content.indexOf('【') === -1 ? 0 : item.content.indexOf('【') + 1
                let endIndex = item.content.indexOf('】') === -1 ? 0 : item.content.indexOf('】')
                title = item.content.substring(startIndex, endIndex)
                content = item.content.substring(endIndex + 1)
            } else {
                title = item.title
                content = item.content
            }
            str += `<li class="flash-news" data-created="${item.createdTime}">
                <div class="news-item">
                    <div class="${parseInt(item.tag) === 2 ? 'item-icons import' : 'item-icons'}">
                        <div class="round"></div>
                        <div class="time-left">
                            <span>${getHourMinute(item.createdTime, 'serverDate')}</span>
                        </div>
                    </div>
                    <a class="" href="${getHost()}/liveNewsDetail/${item.id}.html">
                        <h1 class="${parseInt(item.tag) === 2 ? 'news-title import' : 'news-title'}">${title}</h1>
                    </a>
                    <h2 data-id="${item.id}" class="news-detail">
                        ${content}
                        ${!item.url ? '' : `<a rel="nofollow" title="查看原文" href="javascript:void(0)" data-url="${item.url}" style="color: #0a7ff2" target="_blank"> 「查看原文」</a>`}
                    </h2>
                    ${!item.images ? '' : `<img alt="${!item.imagesRemark ? title : item.imagesRemark}" src="${item.images}"/>`}
                    <div class="judge-profit">
                        <p data-status="1" data-id="${item.id}"
                           class="good-profit ${!item.type || parseInt(item.type) !== 1 ? '' : 'active'}">
                            <i class="iconfont iconfont-trend-up"></i>
                            <span>利好</span>
                            <span class="num"> ${!item.upCounts ? 0 : item.upCounts} </span>
                        </p>
                        <p  data-status="0" data-id="${item.id}" class="bad-profit ${parseInt(item.type) === 0 ? 'active' : ''}">
                            <i class="iconfont iconfont-trend-down"></i>
                            <span>利空</span>
                            <span class="num"> ${!item.downCounts ? 0 : item.downCounts} </span>
                        </p>
                    </div>
                </div>
            </li>`
        })
        return str
    }

    function getNewsList (query, fn) {
        const channelId = $('.news-head em.active').data('channelid')
        const id = !channelId ? '' : channelId
        const created = $('.flash-news-list .flash-news').last().data('created')
        let refreshTime = typeof created === 'undefined' ? '' : created
        let sendData = {
            currentPage: 1,
            pageSize: 30,
            channelId: id,
            passportid: !Cookies.get('hx_user_id') ? '' : Cookies.get('hx_user_id'),
            ...query
        }
        if (sendData.currentPage > 1) {
            sendData = {
                ...sendData,
                refreshTime: refreshTime
            }
        }
        axiosAjax({
            type: 'get',
            url: proxyUrl + `/info/lives/showlives?${fomartQuery(sendData)}`,
            formData: false,
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    ifLoad = true
                    fn(res)
                    bindJudgeProfit()
                    $('.check-more-load').data('pagecount', res.obj.pageCount).data('currpage', sendData.currentPage)
                }
            }
        })
    }

    // 相关新闻
    axiosAjax({
        type: 'get',
        url: `${proxyUrl}/info/news/hotnews?${fomartQuery({
            lastDays: 3,
            readCounts: 50,
            newsCounts: 10
        })}`,
        formData: false,
        params: {},
        fn: function (res) {
            if (res.code === 1) {
                let data = res.obj.inforList
                let right = relatedNews(data, 'right')
                $('.hot-news-wrap .news-recommend').html(right)
            }
        }
    })

    // 新闻排行
    axiosAjax({
        type: 'get',
        url: `${proxyUrl}/info/news/recommend?${fomartQuery({
            lastDays: 3,
            readCounts: 50,
            newsCounts: 10
        })}`,
        formData: false,
        params: {},
        fn: function (res) {
            if (res.code === 1) {
                let data = res.obj.inforList
                let str = getSortNewsStr(data)
                $('.hot-news-wrap .news-sort-box').html(str)
            }
        }
    })

    function getSortNewsStr (arr) {
        let str = ''
        arr.map((item, index) => {
            str += `<div class="list-box clearfix"><span>${index + 1}</span><a title="${item.title}" target="_blank" class="right-text" href="${getHost()}/newsdetail/${item.id}.html">${item.title}</a></div>`
        })
        return str
    }
})
