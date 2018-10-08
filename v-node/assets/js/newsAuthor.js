/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */

// import Cookies from 'js-cookie'
import {pageLoadingHide, axiosAjax, proxyUrl, fomartQuery, getTimeContent, getHost} from './public/public'
import {relatedNews, NewsAuthor} from './modules/index'
import layer from 'layui-layer'
import Cookies from 'js-cookie'

$(function () {
    pageLoadingHide()
    // let userId = getQueryString('userId')
    let userId = $('#newsListContent').data('id')
    // 加载更多
    $('.check-more-load').on('click', function () {
        let pageCount = $(this).data('pagecount')
        let currPage = $(this).data('currpage')
        currPage = parseInt(currPage) + 1
        if (currPage > pageCount) {
            layer.msg('暂无更多新闻 !')
            return
        }
        getNewsList(currPage, 10, (res) => {
            $('#newsListContent').append(getNewsStr(res.obj))
        })
    })
    function getNewsStr (obj) {
        let arr = obj.inforList
        let currentTime = obj.currentTime
        let str = ''
        arr.map((item) => {
            str += `<div class="index-news-list">
<a title="${item.title}" target="_blank" href="${getHost()}/newsdetail/${item.id}.html">
<div class="list-left">
<img src="${(!item.coverPic || !JSON.parse(item.coverPic).pc) ? `http://static.huoxing24.com/images/2018/03/05/1520243882098653.svg` : JSON.parse(item.coverPic).pc}" alt="${item.title}">
</div>
<div class="list-right" style="width: 560px;">
<h6 class="headline">${item.title}</h6>
<div class="details">${item.synopsis}</div></div>
</a>
<div class="shadow"></div>
<div class="list-bottom index-mian clearfix">
<p class="lock-time">${getTimeContent(item.publishTime, currentTime)}</p><p class="read-num main-read-num"><span class="count-eye"> </span><span class="read-count">${item.hotCounts}</span></p></div></div>`
        })
        return str
    }
    function getNewsList (currPage, pageSize, fn) {
        let sendData = {
            currentPage: !currPage ? 1 : currPage,
            pageSize: !pageSize ? 10 : pageSize,
            passportId: userId,
            status: 1
        }
        axiosAjax({
            type: 'get',
            url: proxyUrl + `/info/news/showcolumnlist?${fomartQuery(sendData)}`,
            formData: false,
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

    // 作者信息
    axiosAjax({
        type: 'get',
        url: `${proxyUrl}/info/news/getauthorinfo?${fomartQuery({
            passportId: userId,
            myPassportId: !Cookies.get('hx_user_id') ? '' : Cookies.get('hx_user_id')
        })}`,
        formData: false,
        params: {},
        fn: function (res) {
            if (res.code === 1) {
                let author = new NewsAuthor(res.obj)
                author.init($('.news-author'), 'right')
                // let bottom = new newsAuthor($('.authorinfo-bottom'), res.obj, 'bottom')
                // bottom.init()
            }
        }
    })
})
