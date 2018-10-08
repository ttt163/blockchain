/**
 * Author：zhoushuanglong
 * Time：2018-04-08 15:46
 * Description：Description
 */

import '../../node_modules/layui-layer/dist/layer.js'
import {pageLoadingHide, isPc, getHost, axiosAjax, proxyUrl} from '../js/public/public'
import {TopNav} from './modules/m-topNav'
import {NewsList} from './modules/m-newsList'

if (isPc()) {
    window.location.href = 'http://www.huoxing24.com'
}

$(function () {
    pageLoadingHide()

    // 滚动显示底部下载条
    const $wTop = $('#wTop')
    const $bottomDown = $('.bottom-down')
    let position = 0
    let top = 0
    $(window).scroll(function (e) {
        position = $(this).scrollTop()
        if (position > 200) {
            if (top <= position) {
                $wTop.addClass('index-active')
                $bottomDown.addClass('index-active')
            } else {
                $wTop.removeClass('index-active')
                $bottomDown.removeClass('index-active')
            }
            top = position
            setTimeout(function () {
                top = position
            }, 0)
        }
    })

    // 广告
    const getAd = () => {
        let sendData = {
            adPlace: 1,
            type: 2
        }
        axiosAjax({
            type: 'get',
            url: `${proxyUrl}/info/ad/showad`,
            formData: false,
            params: sendData,
            fn: function (data) {
                if (data.code === 1) {
                    const obj = !data.obj[1] ? [] : data.obj[1]
                    let list = ''
                    obj && obj.length !== 0 && obj.map((item) => {
                        list += `<a title="${item.remake}" rel="nofollow" class="href-btn" href="${item.url}">
                        <img src="${item.img_url}" alt="${item.remake}">
                    </a>`
                    })
                    $('.index-ad').append(list)
                }
            }
        })
    }
    getAd()

    // 导航
    let topNav = new TopNav({isHideTop: false})
    topNav.init()

    // 推荐轮播
    class Recommend {
        constructor (warp) {
            this.warp = warp
            this.dataUrl = `${proxyUrl}/info/homerecommend/gettypelist`
        }

        init () {
            this.getData().then((arr) => {
                this.randerHtml(arr)
                let swiper2 = new Swiper('#newsWrap', {
                    pagination: {
                        el: '#newsWrap .paginationBanner',
                        clickable: false
                    },
                    autoplay: {
                        delay: 4000,
                        stopOnLastSlide: true,
                        disableOnInteraction: false
                    },
                    loop: true,
                    observer: true,
                    observeParents: true
                })
                swiper2.init()
            })
        }

        // 获取数据
        async getData () {
            let url = this.dataUrl
            let sendData = {
                position: 1,
                status: 1,
                pageSize: 20,
                currentPage: 1
            }
            let data = await new Promise((resolve) => {
                axiosAjax({
                    type: 'get',
                    url: url,
                    formData: false,
                    params: sendData,
                    fn: function (res) {
                        if (res.code === 1) {
                            let arr = !res.obj[1] ? [] : res.obj[1]
                            resolve(arr)
                        }
                    }
                })
            })

            return data
        }

        // 数据渲染
        randerHtml (arr) {
            let swiperSlide = ''
            for (let i = 0; i < arr.length; i++) {
                let d = arr[i]
                let type = parseInt(d.type)
                let url = ''
                if (type === 1 || type === 2 || type === 6 || type === 7 || type === 8 || type === 9) {
                    if (type === 1) {
                        // 新闻详情
                        url = `${getHost()}/newsdetail/${d.typeLink}.html`
                    } else if (type === 2) {
                        // 新闻频道
                        url = `${getHost()}/news/${d.typeLink}.html`
                    } else {
                        // 纯链接
                        url = d.typeLink
                    }
                    swiperSlide += `<div class="swiper-slide">
                    <a title="${d.title}" href="${url}">
                        <img src=${d.mImgSrc} alt="${d.title}">
                    </a>
                    <span class="img-news-title">${d.title}</span>
                </div>`
                }
            }
            this.warp.html(swiperSlide)
        }
    }

    new Recommend($('#newsWrap .newsWrap')).init()

    // 新闻列表
    new NewsList($('#listBox0')).init()
})
