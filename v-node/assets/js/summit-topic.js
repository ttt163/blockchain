/**
 * Author：tantingting
 * Time：2018/8/13
 * Description：Description
 */
import {pageLoadingHide, axiosAjax, proxyUrl, getHost} from './public/public'
// import layer from 'layui-layer'
import {VideoPlay} from './public/liveConfig'
$(function () {
    pageLoadingHide()

    // 推荐新闻
    let recommendSwiper = new Swiper('.summit-page2 .swiper-container', {
        nextButton: '.summit-page2 .swiper-button-next',
        prevButton: '.summit-page2 .swiper-button-prev',
        pagination: '.summit-page2 .swiper-pagination',
        paginationType: 'progress',
        loop: true,
        preventClicks: false,
        autoplay: 5000
    })
    console.log(recommendSwiper)
    // recommendSwiper.autoplay = true

    // 图集轮播
    let altsSwiper = new Swiper('.summit-page4 .swiper-container', {
        nextButton: '.summit-page4 .swiper-button-next',
        prevButton: '.summit-page4 .swiper-button-prev',
        loop: true,
        autoplay: 5000
    })
    altsSwiper.autoplay = true

    // 处理时间
    const add0 = (m) => {
        return m < 10 ? '0' + m : m
    }
    const formatDate = (publishDate, str) => {
        str = !str ? '-' : str
        let publish = new Date(publishDate)
        let y = publish.getFullYear()
        let m = publish.getMonth() + 1
        let d = publish.getDate()
        const h = publish.getHours()
        const mn = publish.getMinutes()
        return `${y}${str}${add0(m)}${str}${add0(d)} ${add0(h)}:${add0(mn)}`
    }
    const getTimeContent = (publishTime, requestTime, str) => {
        requestTime = !requestTime ? new Date().getTime() : requestTime
        let limit = parseInt((requestTime - publishTime)) / 1000
        let content = ''
        if (limit < 60) {
            content = '刚刚'
        } else if (limit >= 60 && limit < 3600) {
            content = Math.floor(limit / 60) + '分钟前'
        } else if (limit >= 3600 && limit < 86400) {
            content = Math.floor(limit / 3600) + '小时前'
        } else {
            content = formatDate(publishTime, '/')
        }
        return content
    }
    const formatDateTime = (publishDate, currDate, str) => {
        str = !str ? '-' : str
        let curr = new Date()
        let publish = new Date(publishDate)
        if (currDate && !isNaN(currDate)) {
            curr = new Date(currDate)
        } else {
            str = currDate
        }
        let m = publish.getMonth() + 1
        let d = publish.getDate()
        const h = publish.getHours()
        const mn = publish.getMinutes()
        let dateStr = ''
        if (publish.getDate() !== curr.getDate()) {
            // 当天之外
            dateStr = `${add0(m)}${str}${add0(d)} ${add0(h)}:${add0(mn)}`
        } else {
            // 当天之内
            dateStr = `${add0(h)}:${add0(mn)}`
        }
        return dateStr
    }

    // 快讯
    class ShowLiveNews {
        constructor (warp) {
            this.warp = warp
            this.liveList = this.warp.find('.live-list')
        }

        init () {
            setInterval(() => {
                this.getLatestNews()
            }, 50000)
        }

        // 最新快讯
        getLatestNews () {
            let self = this
            let sendData = {
                currentPage: 1,
                pageSize: 999,
                channelId: 7
            }
            axiosAjax({
                type: 'get',
                url: proxyUrl + `/info/lives/showlives`,
                formData: false,
                params: {...sendData},
                fn: function (res) {
                    if (res.code === 1) {
                        let list = !res.obj.inforList || !res.obj.inforList.length ? [] : res.obj.inforList
                        self.randerNews(list)
                    }
                }
            })
        }

        randerNews (list) {
            let str = ''
            list.map((item) => {
                let title = ''
                // let content = item.content
                if (!item.title) {
                    let startIndex = item.content.indexOf('【') === -1 ? 0 : item.content.indexOf('【') + 1
                    let endIndex = item.content.indexOf('】') === -1 ? 0 : item.content.indexOf('】')
                    title = item.content.substring(startIndex, endIndex)
                    // content = item.content.substring(endIndex + 1)
                } else {
                    title = item.title
                    // content = item.content
                }
                let dateTime = formatDateTime(item.createdTime, '/')
                str += `
                <a class="live-item clearfix" href="${getHost()}/liveNewsDetail/${item.id}" title="${title}" target="_blank">
                                <span>${dateTime}</span>
                                <h3>${title}</h3>
                            </a>
                `
            })
            this.liveList.html(str)
        }
    }
    new ShowLiveNews($('.summit-page2 .live-box')).init()

    // 加载更多新闻
    class ShowNews {
        constructor (warp) {
            this.warp = warp
            this.newsBox = this.warp.find('.news-list')
            this.moreBtn = this.warp.find('.news-more-btn')
            this.noMore = this.warp.find('.news-no-more')
            this.pageCount = parseInt(this.moreBtn.data('count'))
            this.pageSize = parseInt(this.moreBtn.data('size'))
            this.currentPage = parseInt(this.moreBtn.data('page'))
            this.refreshTime = this.moreBtn.data('time')
            this.newsTags = '硅谷峰会'
        }

        init () {
            let self = this
            this.moreBtn.on('click', function () {
                if (self.currentPage < self.pageCount) {
                    self.getNews({currentPage: self.currentPage + 1})
                } else {
                    $(this).css({'display': 'none'})
                    self.noMore.css({'display': 'block'})
                }
            })
        }

        getNews (obj) {
            let self = this
            let sendData = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                tags: this.newsTags
            }
            if (obj) {
                sendData = {
                    ...sendData,
                    ...obj
                }
            }
            axiosAjax({
                type: 'get',
                url: proxyUrl + `/info/news/relatednews1`,
                formData: false,
                params: {...sendData},
                fn: function (res) {
                    if (res.code === 1) {
                        let list = !res.obj.inforList || !res.obj.inforList.length ? [] : res.obj.inforList
                        self.pageCount = parseInt(res.obj.pageCount)
                        self.refreshTime = list[list.length - 1].publishTime
                        self.currentPage = sendData.currentPage
                        self.randerNews(res.obj)
                        if (self.currentPage === self.pageCount || list.length < self.pageSize) {
                            self.moreBtn.css({'display': 'none'})
                            self.noMore.css({'display': 'block'})
                        }
                    }
                }
            })
        }

        randerNews (obj) {
            let list = !obj.inforList || !obj.inforList.length ? [] : obj.inforList
            let str = ''
            list.map((item) => {
                let pcImg = '../../img/default-img.svg'
                if (item.coverPic) {
                    let coverPic = JSON.parse(item.coverPic)
                    if (coverPic.pc) {
                        pcImg = coverPic.pc
                    }
                }
                str += `
                <a class="news-item" href="${getHost()}/newsdetail/${item.id}" title="${item.title}" target="_blank">
                        <div class="news-img">
                            <img src="${pcImg}" alt="${item.title}" >
                        </div>
                        <h3>${item.title}</h3>
                        <span>发布时间：${getTimeContent(item.publishTime, obj.currentTime, '/')}</span>
                    </a>
                `
            })
            this.newsBox.append(str)
        }
    }
    new ShowNews($('.summit-page3')).init()

    // 直播
    /* let skilConfig = {
        'skinLayout': []
    }
    new LiveConfig(skilConfig).init() */

    // play按钮，跳转详情页
    /* if ($('.video-box').find('.mask').length > 0) {
        $('.video-box').hover(function () {
            $(this).find('.mask').css({'display': 'block'})
        }, function () {
            $(this).find('.mask').css({'display': 'none'})
        })
    } */

    // 视频
    new VideoPlay().init()
})
