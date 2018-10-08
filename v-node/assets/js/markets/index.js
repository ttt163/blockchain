/**
 * Author：tantingting
 * Time：2018/5/4
 * Description：Description
 */
import Cookies from 'js-cookie'
import {axiosAjax, proxyUrl, fomartQuery, formatPrice, numTrans} from '../public/public'
import layer from 'layui-layer'

class MessageBanner {
    constructor (coinId, rate) {
        this.priceType = $('#currencySelect').val()
        this.coinId = coinId
        this.rate = !rate ? 1 : rate
        this.userId = !Cookies.get('hx_user_id') ? '' : Cookies.get('hx_user_id')
        this.currPriceData = null
    }

    init () {
        let self = this
        // this.getCoinInfo()
        // this.getCoinPrice()
        // 美元，人民币
        $('#currencySelect').on('change', function (e) {
            let priceType = e.target.value
            let symbol = parseInt(priceType) === 0 ? '＄' : '￥'
            if (parseInt(priceType) === 0) {
                let h6 = $('.currency-price h6')
                h6.find('font').html(symbol)
                h6.find('span').html(h6.data('en'))
                let deal24 = $('.deal-24')
                let high24 = deal24.find('.highest-24')
                let lowe24 = deal24.find('.lowest-24')
                high24.find('span').html(high24.data('en'))
                lowe24.find('span').html(lowe24.data('en'))
                let marketNum = $('.market-num')
                let dealNum = $('.deal-num')
                marketNum.find('span').html(marketNum.data('en'))
                dealNum.find('span').html(dealNum.data('en'))
            } else {
                let h6 = $('.currency-price h6')
                h6.find('font').html(symbol)
                h6.find('span').html(h6.data('cn'))
                let deal24 = $('.deal-24')
                let high24 = deal24.find('.highest-24')
                let lowe24 = deal24.find('.lowest-24')
                high24.find('span').html(high24.data('cn'))
                lowe24.find('span').html(lowe24.data('cn'))
                let marketNum = $('.market-num')
                let dealNum = $('.deal-num')
                marketNum.find('span').html(marketNum.data('cn'))
                dealNum.find('span').html(dealNum.data('cn'))
            }
            // self.renderPrice(self.currPriceData, e.target.value)
        })

        // 查看介绍
        $('.currency-introduce').on('click', '.particulars-btn', function () {
            // let text = $('.currency-text').html()
            // $('.currency-introduce-pop .introduce-cont').html(text)
            self.isShowModal('show')
        })

        $('.currency-introduce-pop .close').on('click', function () {
            self.isShowModal('close')
        })

        // 关注
        $('.currency-introduce').on('click', '.attention span ', function (e) {
            e.stopPropagation()
            if (!Cookies.get('hx_user_id')) {
                layer.msg('请登录后，再关注')
                return
            }
            let status = $(this).hasClass('active') ? -1 : 1
            let $this = $(this)
            let sendData = {
                coinId: self.coinId,
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
    }

    isShowModal (type) {
        if (type === 'show') {
            $('.currency-introduce-pop').addClass('show')
            $('.shade ').addClass('show')
        } else {
            $('.currency-introduce-pop').removeClass('show')
            $('.shade ').removeClass('show')
        }
    }

    // 详情
    getCoinInfo () {
        let self = this
        let sendData = {
            coinid: this.coinId,
            passportId: this.userId
        }
        axiosAjax({
            type: 'get',
            url: `${proxyUrl}/market/coin/queryinfo?${fomartQuery(sendData)}`,
            formData: false,
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    self.renderInfo(res.data)
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }

    renderInfo (particularsCont) {
        let websites = particularsCont.websites.split(',')
        let explorer = particularsCont.explorer.split(',')
        let str = `
        <div class="currency-title" data-name="${!particularsCont.cn_name ? particularsCont.en_name : particularsCont.cn_name}">
                <span>
                    <img src="${particularsCont.icon}" alt="">
                </span>
                <h6>${particularsCont.cn_name}${particularsCont.name}</h6>
            </div>
            <div class="attention">
                <font>关注：</font>
                <span data-name="${particularsCont.name}" class="${particularsCont.ifCollect === 1 ? 'active' : ''}" data-id="${particularsCont.ifCollect}"></span>
            </div>
            <p class="currency-text">${particularsCont.description === '' ? '暂无信息' : particularsCont.description}</p>
            <div class="${particularsCont.description === '' ? 'particulars-btn none' : 'particulars-btn'}">查看介绍</div>
            <div style="clear: both;"></div>
            <div class="currency-bazaar">
                <p class="time">发行时间: <span>${parseInt(particularsCont.release_time) === 0 ? '暂无信息' : new Date(particularsCont.release_time).toLocaleString().split(' ')[0].split('/').join('-')}</span></p>
                <p class="putaway">上架交易所: <span>${particularsCont.marketcount}</span>家</p>
                <p class="ranking">市场排名: <span>第<font>${particularsCont.rank}</font>名</span></p>
            </div>
            <div class="official">
                <p>官方网站：</p>
                <span>
                    <a title="${!websites[0] ? '暂无信息' : websites[0]}" href="${websites[0]}" target="_blank">${!websites[0] ? '暂无信息' : websites[0]}</a>
                </span>
                <span>
                    <a title="${websites[1]}" target="_blank" href="${websites[1]}">${websites[1]}</a>
                </span>
            </div>
            <div class="block">
                <p>区块站：</p>
                <span>
                    <a title="${!explorer[0] ? '暂无信息' : explorer[0]}" href="${explorer[0]}" target="_blank">${!explorer[0] ? '暂无信息' : explorer[0]}</a>
                </span>
                <span>
                    <a title="${explorer[1]}" target="_blank" href="${explorer[1]}">${explorer[1]}</a>
                </span>
            </div>
        `
        $('.currency-introduce').html(str)
    }

    // 价格
    getCoinPrice () {
        let self = this
        let sendData = {
            coinid: this.coinId
        }
        axiosAjax({
            type: 'get',
            url: `${proxyUrl}/market/coin/queryprice?${fomartQuery(sendData)}`,
            formData: false,
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    self.currPriceData = res.data
                    self.renderPrice(res.data, self.priceType)
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }

    renderPrice (currencyPrice, priceType) {
        let symbol = parseInt(priceType) === 0 ? '＄' : '￥'
        let rate = parseInt(priceType) === 0 ? this.rate.USD : this.rate.CNY
        let str = `
        <div class="currency-price">
                <h6><font style="font-size: 28px;">${symbol}</font><span>${formatPrice(parseFloat(currencyPrice.price_usd) * rate)}</span></h6>
                <p class="${parseFloat(currencyPrice.percent_change_24h) > 0 ? 'float' : 'float lose'}"><span>${currencyPrice.percent_change_24h}</span>%</p></div>
            <div class="deal-24">
                <div class="highest-24"><font>24H最高：</font>${currencyPrice.high_price_in_24h === 0 ? 'N/A' : `<span>${symbol}<span>${formatPrice(parseFloat(currencyPrice.high_price_in_24h) * rate)}</span></span>`}</div>
                <div class="lowest-24"><font>24H最低：</font>${currencyPrice.low_price_in_24h === 0 ? 'N/A' : `<span>${symbol}<span>${formatPrice(parseFloat(currencyPrice.low_price_in_24h) * rate)}</span></span>`}</div>
            </div>
            <div class="market-price">
                <div class="market-num"><font>流通市值</font>${currencyPrice.available_supply === 0 ? '暂无信息' : `<span>${symbol}<span>${numTrans(currencyPrice.available_supply * currencyPrice.price_usd * parseFloat(rate)).value}</span>${numTrans(currencyPrice.available_supply * currencyPrice.price_usd * parseFloat(rate)).label}</span>`}</div>
                <div class="deal-num"><font>24H成交额</font><span>${symbol}<span>${numTrans(currencyPrice.volume_usd_24h * parseFloat(rate)).value}</span>${numTrans(currencyPrice.volume_usd_24h * parseFloat(rate)).label}</span></div>
            </div>
            <div class="sum-issue">
                <div class="market-quantity"><font>流通量</font>${currencyPrice.available_supply === 0 ? '暂无信息' : `<span><span>${numTrans(currencyPrice.available_supply).value}</span>${numTrans(currencyPrice.available_supply).label}</span>`}</div>
                <div class="issue-num"><font>总发行量</font>${currencyPrice.max_supply === 0 ? '暂无信息' : `<span><span>${numTrans(currencyPrice.max_supply).value}</span>${numTrans(currencyPrice.max_supply).label}</span>`}</div>
            </div>
        `
        $('#currencyDealContent').html(str)
    }
}

export {
    MessageBanner
}
