/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */

import {pageLoadingHide, axiosAjax, proxyUrl, getTimeContent, getHost, getHourMinute} from './public/public'
import {relatedNews} from './modules/index'
// import layer from 'layui-layer'

$(function () {
    pageLoadingHide()
    // 相关新闻
    axiosAjax({
        type: 'get',
        url: `${proxyUrl}/info/news/hotnews`,
        formData: false,
        params: {
            lastDays: 3,
            readCounts: 50,
            newsCounts: 6
        },
        fn: function (res) {
            if (res.code === 1) {
                let data = res.obj.inforList
                // if (!data || !data.length) {
                //     $('.news-recommend').html(`<div class="new-list-box"><div class="loading">暂无相关新闻</div></div>`)
                //     return
                // }
                let right = relatedNews(data, 'right')
                $('.news-recommend').html(right)
                // $('.bottom-recommend-news .news-contain').html(bottom)
            }
        }
    })

    // 搜索
    class Search {
        constructor () {
            this.contain = $('#searchPage')
            this.searchInput = this.contain.find('.search-input')
            this.searchtabs = this.contain.find('.tabs')
            this.isSearching = false
            this.randerContain = $('#newsListContent')
            this.searchQuery = this.searchInput.val()
            this.searchType = this.searchtabs.find('li.active').data('type')
            this.currPage = this.randerContain.data('currpage')
            this.total = this.randerContain.data('pagecount')
            this.pageSize = this.randerContain.data('pagesize')
        }

        init () {
            let self = this
            // 回车搜索
            document.addEventListener('keydown', (event) => {
                if (!self.isSearching && event.keyCode === 13) {
                    self.getNewsList({page: 1})
                }
            })

            // tab切换
            this.searchtabs.on('click', 'li', function () {
                $(this).addClass('active').siblings().removeClass('active')
                self.getNewsList({page: 1, type: $(this).data('type')})
            })

            // 滚动加载更多
            $(window).on('scroll', function () {
                if (self.isSearching) {
                    return
                }
                if (self.contain.height() < $(window).scrollTop() + $(window).height()) {
                    self.getNewsList({page: parseInt(self.currPage) + 1})
                }
            })

            // 快讯
            this.randerContain.on('click', '.news-detail', function (e) {
                let id = $(this).data('id')
                window.open(`${getHost()}/liveNewsDetail/${id}.html`, '_blank')
            })
            this.randerContain.on('click', '.news-detail a', function (e) {
                e.stopPropagation()
                let thisUrl = $(this).data('url')
                window.open(thisUrl, '_blank')
            })
        }

        keyLight (content, key, color) {
            let bgColor = color || '#e61e1e'
            let sKey = `<span style='color: ${bgColor}'>${key}</span>`
            return content.split(key).join(sKey)
        }

        getNewsList (obj) {
            let self = this
            this.searchQuery = this.searchInput.val()
            this.searchType = this.searchtabs.find('li.active').data('type')
            this.currPage = this.randerContain.data('currpage')
            let sendData = {
                page: this.currPage,
                pageSize: this.pageSize,
                type: this.searchType,
                q: this.searchQuery
            }
            if (obj) {
                sendData = {
                    ...sendData,
                    ...obj
                }
            }
            if ((sendData.page > 1) && (sendData.page > this.total)) {
                return
            }
            self.isSearching = true
            axiosAjax({
                type: 'get',
                url: proxyUrl + `/info/news/multisearch`,
                formData: false,
                params: sendData,
                fn: function (res) {
                    self.isSearching = false
                    if (res.code === 1) {
                        if (!res.obj || !res.obj.inforList) {
                            self.renderNoData()
                            self.contain.find('.result-num span').html(0)
                            self.randerContain.data('pagecount', 0).data('currpage', sendData.page)
                            self.currPage = sendData.page
                            self.total = 0
                        } else {
                            self.renderStr(sendData.type, res.obj.inforList, sendData.page)
                            self.contain.find('.result-num span').html(res.obj.recordCount)
                            self.randerContain.data('pagecount', res.obj.totalIndex).data('currpage', sendData.page)
                            self.currPage = sendData.page
                            self.total = res.obj.totalIndex
                        }
                    } else {
                        self.renderNoData()
                    }
                }
            })
        }

        // render
        renderStr (type, arr, currPage) {
            if (!arr.length) {
                this.renderNoData()
                return
            }
            if (parseInt(type) === 2) {
                this.renderFlashNews(arr, currPage)
            } else if (parseInt(type) === 3) {
                this.renderAuthor(arr, currPage)
            } else if (parseInt(type) === 4) {
                this.renderhotNews(arr, currPage)
            } else {
                this.renderNews(arr, currPage)
            }
        }

        // 没数据
        renderNoData () {
            let str = `
            <div class="no-data">
                <img src="../../img/search-nodata.png">
                <p>很抱歉，没有找到<span>“${this.searchQuery}”</span>相关结果，请修改或者尝试其他搜索词</p>
            </div>`
            this.randerContain.html(str)
        }

        // 新闻
        renderNews (arr, currPage) {
            let str = ''
            arr.map((item) => {
                str += `<div class="index-news-list">
        <a title="${item.title}" target="_blank" href="${getHost()}/newsdetail/${item.id}.html">
    <div class="list-left">
            <img alt="${item.title}" src="${(!item.coverPic || !JSON.parse(item.coverPic).pc ? 'http://static.huoxing24.com/images/2018/03/05/1520243882098653.svg' : JSON.parse(item.coverPic).pc)}">
    </div>
    <div class="list-right" style="width: 560px;">
            <h1 class="headline">${this.keyLight(item.title, this.searchQuery)}</h1>
            <h3 class="details">${this.keyLight(item.synopsis, this.searchQuery)}</h3>
    </div>
    </a>
    <div class="shadow"></div>
    <div class="list-bottom index-mian clearfix">
            <p class="name">${item.author}</p>
            <p class="lock-time">${getTimeContent(item.publishTime)}</p>
        </div>
</div>`
            })
            if (parseInt(currPage) === 1) {
                this.randerContain.html(str)
            } else {
                this.randerContain.append(str)
            }
        }

        // 快讯
        renderFlashNews (arr, currPage) {
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
                str += `<li class="flash-news">
        <div class="news-item">
            <div class="item-icons">
                <div class="round"></div>
                <div class="time-left">
                    <span>${getHourMinute(item.createdTime)}</span>
                </div>
            </div>
            <a class="" target="_blank" href="${getHost()}/liveNewsDetail/${item.id}.html">
                <h1 class="${parseInt(item.tag) === 2 ? 'news-title import' : 'news-title'}">${title}</h1>
            </a>
            <h2 class="news-detail" data-id="${item.id}">${this.keyLight(content, this.searchQuery)}`
                if (item.url) {
                    str += ` <a rel="nofollow" title="查看原文" href="javascript:void(0)" data-url="${item.url}" style="color: #0a7ff2" target="_blank"> 「查看原文」</a>`
                }
                str += `</h2>`
                if (item.images) {
                    str += `<img alt="${!item.imagesRemark ? title : item.imagesRemark}" src="${item.images}"/>`
                }
                str += `</div></li>`
            })

            if (parseInt(currPage) === 1) {
                this.randerContain.html(`<ul id="liveNewsContain" class="flash-news-list">${str}</ul>`)
            } else {
                this.randerContain.find('#liveNewsContain').append(str)
            }
        }

        // 专题
        renderhotNews (arr, currPage) {
            let str = ''
            arr.map((d) => {
                let item = d.topic
                let news = !d.contentList ? [] : d.contentList
                str += `<div class="news-item">
            <div class="news-item-contain">
                <a target="_blank" class="mews-item-top clearfix" href="${getHost()}/hot/${item.tags}/${item.id}">
                    <img src="${!item.newSmallPcImgSrc ? '../../img/default-img.svg' : item.newSmallPcImgSrc}" alt="${item.topicName}">
                    <h3>${this.keyLight(item.topicName, this.searchQuery)}</h3>
                </a>`
                if (news.length > 0) {
                    str += `<div class="desc clearfix"><i class="round"></i><a target="_blank" href="${getHost()}/newsdetail/${news[0].id}.html">${this.keyLight(news[0].title, this.searchQuery)}</a></div>`
                }
                str += `</div></div>`
            })
            if (parseInt(currPage) === 1) {
                this.randerContain.html(`<div class="hot-news-warp"><div class="hot-news-list clearfix">${str}</div></div>`)
            } else {
                this.randerContain.find('.hot-news-list').append(str)
            }
        }

        // 作者
        renderAuthor (arr, currPage) {
            let str = ''
            arr.map((item) => {
                str += `
                <div class="author-list-item">
                    <a target="_blank" title="${item.nickName}" class="author-icon" href="${getHost()}/newsauthor/${item.passportId}">
                        <img alt="${item.nickName}" src="${item.iconUrl}">
                    </a>
                    <a target="_blank" title="${item.nickName}" class="author-name" href="${getHost()}/newsauthor/${item.passportId}">${this.keyLight(item.nickName, this.searchQuery)}</a>
                    <p class="author-desc">${!item.introduce ? '' : this.keyLight(item.introduce, this.searchQuery)}</p>
                </div>
                `
            })
            if (parseInt(currPage) === 1) {
                this.randerContain.html(str)
            } else {
                this.randerContain.append(str)
            }
        }
    }

    let serchNews = new Search()
    serchNews.init()
})
