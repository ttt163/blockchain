/**
 * Author：tantingting
 * Time：2018/8/13
 * Description：Description
 */
import {pageLoadingHide, axiosAjax, proxyUrl, getHost} from './public/public'
// import {Alert} from './modules/alertModal'
import {VideoPlay} from './public/liveConfig'
$(function () {
    pageLoadingHide()

    const calculatePx = (x) => {
        // 计算640，下面对应的px
        let rootFontsize = parseInt($('html').css('fontSize'))
        return x * rootFontsize / 24
    }

    // 推荐新闻
    let swiperItem = $('.summit-page2').find('.swiper-slide')
    if (swiperItem.length > 1) {
        let winW = document.body.scrollWidth
        let itemW = calculatePx(500)
        let space = calculatePx(20)
        let recommendSwiper = new Swiper('.summit-page2 .swiper-container', {
            width: itemW * 3 + space * 2,
            slidesPerView: 3,
            initialSlide: 1,
            slidesOffsetBefore: (winW - itemW - space * 2) / 2 + space,
            spaceBetween: space,
            // grabCursor: true,
            loop: true,
            speed: 300,
            autoplay: {
                delay: 5000,
                stopOnLastSlide: false,
                disableOnInteraction: false
            }
        })
        console.log(recommendSwiper)
        // recommendSwiper.autoplay = true
    }

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
            this.nextCount = 0
            this.nextBtn = this.warp.find('.button-next')
            this.liveList = this.warp.find('.live-list')
            this.liveItem = this.liveList.find('.live-item')
            this.liveLen = this.liveItem.length
            this.itemHeight = this.liveItem.height()
        }

        init () {
            // let self = this
            this.nextBtn.on('click', () => {
                this.showNextNews()
            })

            setInterval(() => {
                this.getLatestNews()
            }, 50000)
        }

        // 快讯
        showNextNews () {
            if (this.nextCount < this.liveLen - 1) {
                this.nextCount++
                this.liveList.css({'transform': `translateY(-${(this.itemHeight + calculatePx(20)) * this.nextCount}px)`})
            } else {
                this.nextCount = 0
                this.liveList.css({'transform': `translateY(0px)`})
            }
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
                params: sendData,
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
                let dateTime = formatDateTime(item.createdTime, '/').split(' ')
                let date = ''
                let time = ''
                if (dateTime.length > 1) {
                    date = dateTime[0]
                    time = dateTime[1]
                } else {
                    time = dateTime[0]
                }
                str += `
                <div class="live-item clearfix">
                            <div class="live-data">
                                <span class="time">${time}</span>
                                <span class="date">${date}</span>
                            </div>
                            <a href="${getHost()}/liveNewsDetail/${item.id}" title="${title}">
                                <h3>${title}</h3>
                            </a>
                        </div>
                `
            })
            this.liveList.html(str)
            this.nextCount = 0
            this.liveList.css({'transform': `translateY(0px)`})
        }
    }
    new ShowLiveNews($('.live-box')).init()

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
                params: sendData,
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
                    if (coverPic.wap_small) {
                        pcImg = coverPic.wap_small
                    }
                }
                str += `
                <a class="news-item clearfix" href="${getHost()}/newsdetail/${item.id}" title="${item.title}">
                        <div class="news-img">
                            <img src="${pcImg}" alt="${item.title}" >
                        </div>
                        <div class="news-right">
                            <h3>${item.title}</h3>
                            <span>${getTimeContent(item.publishTime, obj.currentTime, '/')}</span>
                        </div>
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
    // 视频
    new VideoPlay().init()
})
