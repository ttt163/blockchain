/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */

import {pageLoadingHide, axiosAjax, proxyUrl, fomartQuery, getTimeContent, getHost} from './public/public'
import {relatedNews} from './modules/index'
import layer from 'layui-layer'

$(function () {
    pageLoadingHide()

    // if (window.location.href.indexOf('news') !== -1) {
    //     $('.nav-content li').eq(3).addClass('active')
    // }

    // 加载更多
    $('.check-more-load').on('click', function () {
        let pageCount = $(this).data('pagecount')
        let currPage = $(this).data('currpage')
        let lastTime = $(this).data('time')
        let id = $('.nav-box a.active').data('id')
        currPage = parseInt(currPage) + 1
        if (currPage > pageCount) {
            layer.msg('暂无更多新闻 !')
            return
        }
        getNewsList(currPage, 10, id, lastTime, (res) => {
            $('#newsListContent').append(getNewsStr(res.obj))
        })
    })
    function getNewsStr (obj) {
        let arr = obj.inforList
        let currentTime = obj.currentTime
        let str = ''
        arr.map((item) => {
            let tagsArr = !item.tags ? '' : item.tags.split(',')
            let titleTag = ''
            tagsArr.map((item, index) => {
                if (index === 0) {
                    titleTag += `<a title="${item}" target="_blank" href="${getHost()}/hot/${item}">${item}</a>`
                } else if (index > 0 && index <= 2) {
                    titleTag += ` , <a title="${item}" target="_blank" href="${getHost()}/hot/${item}">${item}</a>`
                }
            })
            str += `<div class="index-news-list">
                      <a title="${item.title}" target="_blank" href="${getHost()}/newsdetail/${item.id}.html">
                        <div class="list-left">
                                <img src="${(!item.coverPic || !JSON.parse(item.coverPic).pc) ? `http://static.huoxing24.com/images/2018/03/05/1520243882098653.svg` : JSON.parse(item.coverPic).pc}" alt="${item.title}">
                        </div>
                        <div class="list-right" style="width: 560px;">
                            <h1 class="headline">${item.title}</h1>
                            <h3 class="details">${item.synopsis}</h3>
                        </div>
                       </a>
                        <div class="list-bottom index-mian clearfix">
                            <h4 class="name">${item.cateId === 1 ? item.nickName : item.author}</h4>
                            <p class="lock-time">${getTimeContent(item.publishTime, currentTime)}</p>
                            <p class="read-num main-read-num"><span class="count-eye">关键字:</span>${titleTag}</p>
                        </div>
                        <div class="shadow"></div>
                        </div>`
        })
        return str
    }
    function getNewsList (currPage, pageSize, id, lastTime, fn) {
        let sendData = {
            currentPage: !currPage ? 1 : currPage,
            pageSize: !pageSize ? 10 : pageSize,
            channelId: !id ? 0 : id,
            refreshTime: lastTime
        }
        axiosAjax({
            type: 'get',
            url: proxyUrl + `/info/news/shownews?${fomartQuery(sendData)}`,
            formData: false,
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    fn(res)
                    let list = res.obj.inforList
                    $('.check-more-load').data('pagecount', res.obj.pageCount).data('currpage', sendData.currentPage).data('time', list[list.length - 1].publishTime)
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
            newsCounts: 6
        })}`,
        formData: false,
        params: {},
        fn: function (res) {
            if (res.code === 1) {
                let data = res.obj.inforList
                // let bottom = relatedNews(data, 'bottom')
                let right = relatedNews(data, 'right')
                $('.ad-recomend .news-recommend').html(right)
                // $('.bottom-recommend-news .news-contain').html(bottom)
            }
        }
    })
})
