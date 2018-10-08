/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */

import {pageLoadingHide, axiosAjax, proxyUrl, fomartQuery, formatDate, getHost} from './public/public'
import {MessageBanner} from './markets/index'
import layer from 'layui-layer'
// import Cookies from 'js-cookie'

$(function () {
    pageLoadingHide()
    const coinId = $('#containMain').data('id')
    const coinTags = $('#containMain').data('tags')
    // const coinTitleName = $('#containMain').data('cname')
    const rateData = $('#containMain').data('rate')
    // let coinName = $('#containMain').data('cname')

    // 上边详情
    let messageBanner = new MessageBanner(coinId, rateData)
    messageBanner.init()

    // 相关新闻
    // 加载更多
    $('#newsMore').on('click', function () {
        let pageCount = $(this).data('pagecount')
        let currPage = $(this).data('currpage')
        // let tags = getQueryString('tags')
        currPage = parseInt(currPage) + 1
        if (currPage > pageCount) {
            layer.msg('暂无更多新闻 !')
            return
        }
        let sendData = {
            currentPage: currPage
        }
        getNewsList(sendData)
    })
    function getNewsStr (obj) {
        let arr = obj.inforList
        // let currentTime = $('.news-hot-label').data('currtime')
        let str = ''
        arr.map((item) => {
            str += `
                    <div class="index-news-list">
                      <a title="${item.title}" target="_blank" href="${getHost()}/newsdetail/${item.id}.html">
                        <div class="list-left">
                                <img src="${(!item.coverPic || !JSON.parse(item.coverPic).pc) ? `http://static.huoxing24.com/images/2018/03/05/1520243882098653.svg` : JSON.parse(item.coverPic).pc}" alt="${item.title}">
                        </div>
                    <div class="list-right" style="width:455px;">
                            <h2 class="headline">${item.title}</h2>
                            <h3 class="details">${item.synopsis}</h3>
                        </div>
                        </a>
                    <div class="list-bottom index-mian clearfix" style="width: 455px;">
                        <p class="name">${item.author}</p>
                        <p class="lock-time">${formatDate(item.publishTime)}</p>
                        <p class="read-num main-read-num"><span class="count-eye"> </span><span class="read-count">热度：${item.hotCounts}</span></p></div>
                        <div class="shadow" style="width: 730px;"></div></div>`
        })
        return str
    }

    function getNewsList (sendData, fn) {
        let data = {
            // tags: !coinName ? coinId : coinName,
            tags: coinTags,
            currentPage: 1,
            pageSize: 10,
            ...sendData
        }
        axiosAjax({
            type: 'get',
            url: proxyUrl + `/info/news/relatednews1?${fomartQuery(data)}`,
            formData: false,
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    if (fn) {
                        fn(res)
                    }
                    let str = getNewsStr(res.obj)
                    if (parseInt(data.currentPage) === 1) {
                        $('#newsListContent').html(str)
                    } else {
                        $('#newsListContent').append(str)
                    }
                    $('#newsMore').data('pagecount', res.obj.pageCount).data('currpage', data.currentPage)
                }
            }
        })
    }

    // 右侧table
    getMarketsData()
    function getMarketsData (obj, fn) {
        let sendData = {
            currentpage: 1,
            pagesize: 10,
            coinid: coinId
        }
        sendData = !obj ? sendData : {...sendData, ...obj}
        axiosAjax({
            type: 'get',
            url: `${proxyUrl}/market/coin/exchange?${fomartQuery(sendData)}`,
            formData: false,
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    if (fn) {
                        fn(res.data.inforList)
                    }
                    appendTableTr(res.data.inforList)
                    $('.market-correlation-list .check-more-load').data('record', res.data.recordCount).data('len', res.data.inforList.length)
                }
            }
        })
    }

    function appendTableTr (arr, rateType) {
        if (!arr.length) {
            $('.market-correlation-list tbody').html(`<tr><td colspan="4">暂无数据！</td></tr>`)
            return
        }
        rateType = !rateType ? 1 : rateType
        let str = ''
        // let rateData = $('#containMain').data('rate')
        let rate = rateData.CNY
        let symbol = '￥'
        if (parseInt(rateType) === 1) {
            rate = rateData.CNY
            symbol = '￥'
        } else {
            rate = rateData.USD
            symbol = '＄'
        }
        arr.map((exchangeItem) => {
            str += `
           <tr>
                    <td>${exchangeItem.exchange_name}</td>
                    <td>${exchangeItem.pair}</td>
                    <td>${symbol}${parseInt(parseFloat(exchangeItem.price * rate))}</td>
                    <td>${exchangeItem.volume_rate_24h}%</td>
                </tr>
            `
        })
        // str = `<div class="market-tab-list"><table><tbody>${str}</tbody></table></div>`
        $('.market-correlation-list tbody').html(str)
    }
})
