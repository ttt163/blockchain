/**
 * Author：tantingting
 * Time：2018/8/2
 * Description：新闻列表
 */
import {axiosAjax, proxyUrl, getTimeContent, getHost} from '../public/public'
export class NewsList {
    constructor (warp, newsId) {
        this.warp = warp
        this.channelId = !newsId ? 0 : newsId
        this.dataUrl = `${proxyUrl}/info/news/shownews`
        this.$moreBtn = this.warp.next()
        this.moreState = true
    }
    init () {
        let self = this
        // 滑到底部加载更多新闻
        $(window).on('scroll', function () {
            let btnMoreTop = self.$moreBtn.offset().top
            let nowtop = $(window).scrollTop() + $(window).height()
            if (nowtop > btnMoreTop && self.moreState) {
                self.moreState = false
                self.getData()
            }
        })

        // 加载更多
        this.$moreBtn.on('click', function () {
            self.moreState = false
            self.getData()
        })
    }

    // 获取数据
    getData (obj) {
        let self = this
        let url = this.dataUrl
        let sendData = {
            currentPage: parseInt(this.$moreBtn.data('page')) + 1,
            pageSize: this.$moreBtn.data('size'),
            channelId: this.channelId,
            refreshTime: this.$moreBtn.data('time')
        }
        if (obj) {
            sendData = {
                ...sendData,
                ...obj
            }
        }
        if (sendData.currentPage > this.$moreBtn.data('count')) {
            this.$moreBtn.html('没有更多了!')
            return
        }
        axiosAjax({
            type: 'get',
            url: url,
            formData: false,
            params: sendData,
            fn: function (res) {
                let obj = {
                    ...res.obj,
                    currentPage: sendData.currentPage
                }
                if (res.code === 1) {
                    self.randerHtml(obj)
                    let lastTime = !obj.inforList || !obj.inforList.length ? 0 : obj.inforList[obj.inforList.length - 1].publishTime
                    self.$moreBtn.data('count', obj.pageCount)
                    self.$moreBtn.data('page', obj.currentPage)
                    self.$moreBtn.data('time', lastTime)
                }
                self.moreState = true
            }
        })
    }

    // 数据渲染
    randerHtml (obj) {
        let str = ''
        let arr = !obj.inforList ? [] : obj.inforList
        arr.map((item) => {
            str += `<div class="news-list-more ">
                        <a title="${item.title}" href="${getHost()}/newsdetail/${item.id}.html}">
                            <div class="title">${item.title}</div>
                            <div class="list-text">
                                <div class="author read-number clearfix"><sapn>${item.hotCounts}</sapn></div>
                                <div class="bottom-left clearfix">
                                    <div class="nick-name">${item.nickName}</div>
                                    <div class="time"><span>${getTimeContent(item.publishTime, obj.currentTime)}</span></div>
                                </div>
                            </div>
                            <div class="cover-img-sma"><img src="${!item.coverPic || !JSON.parse(item.coverPic).wap_small ? '' : JSON.parse(item.coverPic).wap_small}" alt="${item.title}"></div>
                        </a>
                    </div>`
        })
        this.warp.append(str)
    }
}
