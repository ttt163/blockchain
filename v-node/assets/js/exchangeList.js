/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */

// import Cookies from 'js-cookie'
import Pagination from './public/Pagination'
import {pageLoadingHide, axiosAjax, proxyUrl, formatPrice, fomartQuery} from './public/public'
import {MessageBanner} from './markets/index'
// import layer from 'layui-layer'
// import Cookies from 'js-cookie'

$(function () {
    pageLoadingHide()
    const coinId = $('#containMain').data('id')
    const rateData = $('#containMain').data('rate')

    // 上边详情
    let messageBanner = new MessageBanner(coinId, rateData)
    messageBanner.init()

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
            currentpage: p
        }
        getMarketsData(sendData)
    }

    function getMarketsData (obj, fn) {
        let sendData = {
            currentpage: 1,
            pagesize: 20,
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
                }
            }
        })
    }

    function appendTableTr (arr, rateType) {
        if (!arr.length) {
            $('#tableContain tbody').html(`<tr class="market-table-tr"><td colspan="7">暂无数据！</td></tr>`)
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
           <tr class="market-table-tr">
                        <td><span>${exchangeItem.rank}</span></td>
                        <td class="blue"><span>${exchangeItem.exchange_name}</span></td>
                        <td class="blue"><span>${exchangeItem.pair}</span></td>
                        <td><span>${symbol}${formatPrice(parseFloat(exchangeItem.price * rate))}</span></td>
                        <td><span>${parseFloat(exchangeItem.volume_in_24h).toFixed(7)}</span></td>
                        <td><span>${exchangeItem.volume_rate_24h}%</span></td>
                        <td><span>${exchangeItem.updated}</span></td>
            </tr>
            `
        })
        // str = `<div class="market-tab-list"><table><tbody>${str}</tbody></table></div>`
        $('#tableContain tbody').html(str)
    }
})
