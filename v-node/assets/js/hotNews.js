/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */

// import Cookies from 'js-cookie'
import {pageLoadingHide, axiosAjax, proxyUrl, fomartQuery, getTimeContent, getHost} from './public/public'
import {relatedNews} from './modules/index'
import layer from 'layui-layer'

$(function () {
    pageLoadingHide()
    // const tags = getQueryString('tags')
    const tags = $('#newsListContent').data('querytags')
    // const hotNewsId = $('#newsListContent').data('queryid')
    // const hotNewsId = getQueryString('id')
    // 加载更多
    $('.check-more-load').on('click', function () {
        let pageCount = $(this).data('pagecount')
        let currPage = $(this).data('currpage')
        currPage = parseInt(currPage) + 1
        if (currPage > pageCount) {
            layer.msg('暂无更多新闻 !')
            return
        }
        let sendData = {
            currentPage: currPage,
            pageSize: 20,
            tags: encodeURIComponent(tags)
        }
        getNewsList(sendData, (res) => {
            $('#newsListContent').append(getNewsStr(res.obj))
        })
    })
    function getNewsStr (obj) {
        let arr = obj.inforList
        let currentTime = $('.news-hot-label').data('currtime')
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
                        <h6 class="headline">${item.title}</h6>
                        <div class="details">${item.synopsis}</div>
                        </div></a><div class="list-bottom index-mian clearfix">
                        <p class="name">${item.author}</p>
                        <p class="lock-time">${getTimeContent(item.publishTime, currentTime)}</p>
                        <p class="read-num main-read-num">
                        <span class="count-eye">关键字:</span>${titleTag}
                        </p>
                        </div><div class="shadow"></div></div>`
        })
        return str
    }

    function getNewsList (sendData, fn) {
        axiosAjax({
            type: 'get',
            url: proxyUrl + `/info/news/relatednews1?${fomartQuery(sendData)}`,
            formData: false,
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    fn(res)
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

    // 专题内容
    /* axiosAjax({
     type: 'get',
     url: `${proxyUrl}/info/topic/querytopic?${fomartQuery({
     id: hotNewsId
     })}`,
     formData: false,
     params: {},
     fn: function (res) {
     if (res.code === 1) {
     let data = res.obj
     let dateStr = `${add0(parseInt(new Date(data.createTime).getMonth()) + 1)}月${add0(parseInt(new Date(data.createTime).getDate()))}日`
     $('.hot-top-bg').css({background: `url('${data.pcBackImage}') center center no-repeat`})
     $('.hot-top-bg').find('h6').html(data.topicName)
     $('.hot-top-bg').find('span').html(dateStr)
     }
     }
     }) */
})
