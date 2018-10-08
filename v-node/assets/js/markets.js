/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */

// import Cookies from 'js-cookie'
import Pagination from './public/Pagination'
import {pageLoadingHide, axiosAjax, proxyUrl, numTrans, formatPrice, fomartQuery, fomartQueryObj} from './public/public'
// import {pageLoadingHide, axiosAjax, proxyUrl, fomartQuery, getTimeContent, getQueryString} from './public/public'
import layer from 'layui-layer'
import Cookies from 'js-cookie'

$(function () {
    pageLoadingHide()
    let currList = !$('#tableContain').data('list') ? [] : $('#tableContain').data('list')
    let cTimeId = 0

    $('#tableContain').on('click', '.attention ', function (e) {
        e.stopPropagation()
        if (!Cookies.get('hx_user_id')) {
            layer.msg('请登录后，再关注')
            return
        }
        let id = $(this).data('id')
        let status = $(this).hasClass('active') ? -1 : 1
        let $this = $(this)
        let sendData = {
            coinId: id,
            status: status,
            passportId: Cookies.get('hx_user_id'),
            token: Cookies.get('hx_user_token')
        }
        axiosAjax({
            type: 'get',
            url: `${proxyUrl}/market/coin/addcollect?${fomartQuery(sendData)}`,
            formData: false,
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    if (parseInt(sendData.status) === -1) {
                        $this.removeClass('active')
                    } else {
                        $this.addClass('active')
                    }
                } else {
                    if (res.code === -2) {
                        $this.addClass('active')
                    }
                    layer.msg(res.msg)
                }
            }
        })
    })

    cTimeId = setInterval(() => {
        getMarketsData()
    }, 60000)

    // 分页
    let pageTotal = $('#pagination').data('total')
    let pag = new Pagination($('#pagination'), {
        prevContent: '<i class="iconfont iconfont-left"></i>',
        nextContent: '<i class="iconfont iconfont-right"></i>',
        total: pageTotal, // 数据总条数
        size: 20, // 每页显示的条数,
        current: 1, // 当前第几页
        changePage: (p) => {
            getPageData(p)
        }
    })
    pag.init()

    function getPageData (p) {
        let sendData = {
            currentPage: p
        }
        if ($('.market-cut-tab .all').hasClass('active')) {
            getAllMarket(sendData)
        } else {
            getMarketsData(sendData)
        }
    }

    // 全部
    $('.market-cut-tab .all').on('click', function () {
        if ($(this).hasClass('active')) {
            return
        }
        $(this).addClass('active')
        $('.market-cut-tab .my-attention').removeClass('active')
        let obj = {
            myCollect: 0,
            currentPage: 1
        }
        getAllMarket(obj)
    })

    // 我关注的
    $('.market-cut-tab .my-attention').on('click', function () {
        if ($(this).hasClass('active')) {
            return
        }
        if (!Cookies.get('hx_user_id')) {
            // showLogin('login', '登录')
            layer.msg('请登录后，再查看我的关注 !')
            return
        }
        $(this).addClass('active')
        $('.market-cut-tab .all').removeClass('active')
        let obj = {
            myCollect: 1,
            currentPage: 1,
            passportId: Cookies.get('hx_user_id')
        }
        getMarketsData(obj)
    })

    // 全部
    function getAllMarket (obj, fn) {
        let sortValue = $('.sort-select').val().split('-')
        let sendData = {
            currentPage: 1,
            // isMineable: $('.mining-select').val() === 'all' ? null : $('.mining-select').val(),
            isMineable: 'all',
            myCollect: $('.my-attention ').hasClass('active') ? 1 : 0,
            pageSize: 20,
            passportId: !Cookies.get('hx_user_id') ? '' : Cookies.get('hx_user_id'),
            value: $('.search-keyword input').val(),
            sort: {
                column: sortValue[0],
                order: sortValue[1]
            },
            ...obj
        }
        clearInterval(cTimeId)
        axiosAjax({
            type: 'post',
            url: `${proxyUrl}/market/coin/querycoins`,
            formData: false,
            params: sendData,
            fn: function (res) {
                if (res.code === 1) {
                    if (fn) {
                        fn(res.data.coin)
                    }
                    currList = res.data.coin
                    appendTableTr(res.data.coin, $('.currency-select').val())
                    let pag = new Pagination($('#pagination'), {
                        prevContent: '<i class="iconfont iconfont-left"></i>',
                        nextContent: '<i class="iconfont iconfont-right"></i>',
                        total: res.data.count, // 数据总条数
                        size: 20, // 每页显示的条数,
                        current: sendData.currentPage, // 当前第几页
                        changePage: (p) => {
                            getPageData(p)
                        }
                    })
                    pag.init()
                }
                cTimeId = setInterval(() => {
                    getAllMarket()
                }, 60000)
            }
        })
    }

    // 排序
    $('.sort-select').on('change', function (e) {
        let sortValue = e.target.value.split('-')
        let sort = {
            column: sortValue[0],
            order: sortValue[1]
        }
        if ($('.market-cut-tab .all').hasClass('active')) {
            getAllMarket({sort: sort})
        } else {
            getMarketsData({sort: sort})
        }
    })

    // 人民币，美元
    $('.currency-select').on('change', function (e) {
        let val = e.target.value
        appendTableTr(currList, val)
    })

    // 挖矿
    // $('.mining-select').on('change', function (e) {
    //     let isMineable = e.target.value === 'all' || e.target.value === '' ? null : e.target.value
    //     if ($('.market-cut-tab .all').hasClass('active')) {
    //         getAllMarket({isMineable: isMineable})
    //     } else {
    //         getMarketsData({isMineable: isMineable})
    //     }
    // })

    // 搜索
    $('.search-keyword input').on('change', function (e) {
        let val = e.target.value
        if ($('.market-cut-tab .all').hasClass('active')) {
            getAllMarket({value: val.toUpperCase()})
        } else {
            getMarketsData({value: val.toUpperCase()})
        }
    })

    $('.search-keyword .search').on('click', function () {
        let val = $('.search-keyword input').val()
        if ($('.market-cut-tab .all').hasClass('active')) {
            getAllMarket({value: val.toUpperCase()})
        } else {
            getMarketsData({value: val.toUpperCase()})
        }
    })

    function getMarketsData (obj, fn) {
        let sortValue = $('.sort-select').val().split('-')
        let sendData = {
            currentPage: 1,
            // mineable: 'all',
            // mineable: $('.mining-select').val() === 'all' ? '' : $('.mining-select').val(),
            // myCollect: $('.my-attention ').hasClass('active') ? 1 : 0,
            pageSize: 20,
            passportId: !Cookies.get('hx_user_id') ? '' : Cookies.get('hx_user_id'),
            token: Cookies.get('hx_user_token'),
            value: $('.search-keyword input').val(),
            sort: {
                column: sortValue[0],
                order: sortValue[1]
            },
            ...obj
        }
        clearInterval(cTimeId)
        axiosAjax({
            type: 'post',
            url: `${proxyUrl}/market/coin/showcollectlist?${fomartQueryObj(sendData)}`,
            formData: false,
            params: {},
            contentType: 'application/x-www-form-urlencoded',
            fn: function (res) {
                if (res.code === 1) {
                    if (fn) {
                        fn(res.data.inforList)
                    }
                    currList = res.data.inforList
                    appendTableTr(res.data.inforList, $('.currency-select').val())
                    let pag = new Pagination($('#pagination'), {
                        prevContent: '<i class="iconfont iconfont-left"></i>',
                        nextContent: '<i class="iconfont iconfont-right"></i>',
                        total: res.data.recordCount, // 数据总条数
                        size: 20, // 每页显示的条数,
                        current: res.data.currentPage, // 当前第几页
                        changePage: (p) => {
                            getPageData(p)
                        }
                    })
                    pag.init()
                }
                cTimeId = setInterval(() => {
                    getMarketsData()
                }, 60000)
            }
        })
    }

    function appendTableTr (arr, rateType) {
        if (!arr.length) {
            $('#tableContain').html(`<div class="loading">暂无相关内容... </div>`)
            return
        }
        let str = ''
        let rateData = $('.market-column-box').data('rate')
        let rate = rateData.CNY
        let symbol = '￥'
        if (parseInt(rateType) === 1) {
            rate = rateData.CNY
            symbol = '￥'
        } else {
            rate = rateData.USD
            symbol = '＄'
        }
        arr.map((item) => {
            str += `
            <tr data-id="${item.coin_id}" data-name="${item.symbol + (item.cn_name ? ('-' + item.cn_name) : '')}">
                    <td>
                        <div data-id="${item.coin_id}"  data-type="${item.ifCollect}"
                             class="attention ${item.ifCollect === 1 ? 'active' : ''}"
                             id="${item.coin_id}"></div>
                    </td>
                    <td>${item.rank}</td>
                    <td class="coins-name-column">
                        <font class="img-log">
                            <img src="${item.icon}" >
                        </font>
                        <span class="blue">${item.symbol + (item.cn_name ? ('-' + item.cn_name) : '')}</span>
                    </td>
                    <td>
                        ${symbol}<span>${numTrans(item.available_supply * item.price_usd * parseFloat(rate)).value}</span>${numTrans(item.available_supply * item.price_usd * parseFloat(rate)).label}
                    </td>
                    <td class="blue">${symbol}${formatPrice(item.price_usd * parseFloat(rate))}</td>
                    <td>
                        <span>${numTrans(item.available_supply).value}</span>${numTrans(item.available_supply).label}
                    </td>
                    <td class="blue">
                        ${symbol}<span>${numTrans(item.volume_usd_24h).value}</span>${numTrans(item.volume_usd_24h).label}
                    </td>
                    <td class="${item.percent_change_24h >= 0 ? 'green' : 'red'}">${item.percent_change_24h}
                        %
                    </td>
                    <td>
                        <img src="${!item.price_chart ? '../../img/market/no-data-img.png' : item.price_chart}">
                    </td>
                </tr>
            `
        })
        str = `<div class="market-tab-list"><table><tbody>${str}</tbody></table></div>`
        $('#tableContain').html(str)
    }

    $(document).on('click', '#tableContain tr', function () {
        let coinId = $(this).data('id')
        window.open(`/project/${coinId}`, '_blank')
    })
})
