/**
 * Author：zhoushuanglong
 * Time：2018-04-08 15:46
 * Description：Description
 */

import {
    pageLoadingHide,
    axiosAjax,
    proxyUrl,
    fomartQuery,
    add0,
    getHost,
    formatDateMore,
    GetLength
} from '../js/public/public'
import {TopNav} from './modules/m-topNav'
import html2canvas from 'html2canvas'

$(function () {
    pageLoadingHide()
    let currBox = $('#currNewsBox')
    // let searchId = currBox.data('id')

    // 导航
    let topNav = new TopNav({isNav: true})
    topNav.init()

    // 跳转详情
    // $('.lives-box').on('click', '.text-flash p', function (e) {
    //     let id = $(this).data('id')
    //     location.href = `${getHost()}/liveNewsDetail/${id}.html`
    //     // window.open(`/liveNewsDetail/${id}.html`, '_blank')
    // })
    // $('.lives-box').on('click', '.text-flash p a', function (e) {
    //     e.stopPropagation()
    //     let thisUrl = $(this).data('url')
    //     location.href = thisUrl
    //     // window.open(thisUrl, '_blank')
    // })

    let moreState = true
    let titleStr = ''

    let formatTime = (time) => {
        let newDate = new Date(time)
        let day = newDate.getDay()
        let mouth = newDate.getMonth() + 1
        let date = newDate.getDate()
        let dayArr = ['日', '一', '二', '三', '四', '五', '六']

        return `${mouth < 10 ? '0' + mouth : mouth}月${date < 10 ? '0' + date : date}日 星期${dayArr[day]}`
    }

    // 初始化最新文章日期
    let lastestTime = formatTime($('.new-fash-list').eq(0).data('date'))
    $('.fash-title').html(lastestTime)

    // 滚动节流函数
    function debounce (fn, delay) {
        let timer = null
        return function () {
            let context = this
            let args = arguments
            clearTimeout(timer)
            timer = setTimeout(function () {
                fn.apply(context, args)
            }, delay)
        }
    }

    function foo () {
        let btnMoreTop = currBox.find('.btn-more').offset().top
        let nowtop = $(window).scrollTop() + $(window).height()
        let $fashTitle = $('.fash-title')
        let $fashList = $('.new-fash-list')

        $fashList.forEach((item, index) => {
            if (index === 0) return
            if (($(window).scrollTop() + 50) > $(item).offset().top && $(item).next().offset().top > $(window).scrollTop()) {
                let date = formatTime($(item).data('date'))
                if (titleStr !== date) {
                    $fashTitle.html(date)
                    titleStr = date
                }
            }
        })

        if (nowtop > btnMoreTop && moreState) {
            moreState = false
            let currPage = parseInt(currBox.data('page')) + 1
            let index = $('.fash-title span.active').index()
            if (index === 1) {
                getNewsList({queryTime: '', currentPage: currPage}, 'newest')
            } else {
                let queryTime = $('.fash-title').data('time')
                getNewsList({queryTime: queryTime, currentPage: currPage})
            }
        }
    }

    $(window).on('scroll', debounce(foo, 17))

    currBox.find('.btn-more').click(function () {
        if (moreState) {
            moreState = false
            let currPage = parseInt(currBox.data('page')) + 1
            let index = $('.fash-title span.active').index()
            if (index === 1) {
                getNewsList({queryTime: '', currentPage: currPage}, 'newest')
            } else {
                let queryTime = $('.fash-title').data('time')
                getNewsList({queryTime: queryTime, currentPage: currPage})
            }
        }
    })

    function getNewsList (obj, type) {
        // let nextPage = parseInt(currBox.data('page')) + 1
        let refreshTime = $('.new-fash-list').last().data('date')
        let sendData = {
            currentPage: currBox.data('page'),
            pageSize: 30,
            queryTime: '',
            refreshTime: refreshTime,
            ...obj
        }
        let pageCount = currBox.data('count')
        if (parseInt(sendData.currentPage) !== 1) {
            if (sendData.currentPage > pageCount) {
                currBox.find('.btn-more').html('没有更多了')
                return
            }
        }
        axiosAjax({
            type: 'get',
            url: `${proxyUrl}/info/lives/showlives?${fomartQuery(sendData)}`,
            formData: false,
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    let data = res.obj
                    currBox.data('page', sendData.currentPage)
                    currBox.data('count', data.pageCount)
                    renderNewsList(data, type, sendData.currentPage)
                    moreState = true
                    if (sendData.currentPage > data.pageCount) {
                        currBox.find('.btn-more').html('没有更多了')
                    }
                }
            }
        })
    }

    function renderNewsList (obj, type, page) {
        let str = ''
        let arr = !obj.inforList ? [] : obj.inforList
        arr.map((item) => {
            let timeTemp = new Date(item.createdTime)
            let dateStr = type === 'newest' ? `${add0(timeTemp.getHours())}:${add0(timeTemp.getMinutes())}` : `${add0(timeTemp.getHours())}:${add0(timeTemp.getMinutes())}`
            let reg = /【([^【】]+)】([^【】]*)/
            let cont = !item.title ? (reg.exec(item.content) ? reg.exec(item.content)[1] : '快讯') : `${item.title}`
            let msg = reg.exec(item.content) ? reg.exec(item.content)[2] : item.content
            str += `<div class="new-fash-list" data-date="${item.createdTime}">
                        <i class="iconfont iconfont-circle new-mark"></i>
                        <div class="time-flash">${dateStr}</div>
                        <div class="text-flash clearfix">
                            <div data-id="${item.id}" class="text-box">
                                <a class="text-title ${parseInt(item.tag) === 2 ? 'blue' : ''}" href="${getHost()}/liveNewsDetail/${item.id}" title="${cont}">${cont}</a>
                                <p class="text-msg ${GetLength(msg) > 80 ? 'maxH' : ''}">${msg}
                                    ${item.url ? `<a rel="nofollow" data-url="${item.url}"  href="${item.url}" class="original">「查看原文」</a>` : ''}
                                </p>
                                ${GetLength(msg) > 80 ? `<p class="open-msg">展开 <i class="iconfont iconfont-open"></i></p>` : ''}
                                ${item.images ? `<div class="text-img"><img class="item-img" src="${item.images}" alt="${item.imagesRemark}"><p class="img-remark">${item.imagesRemark ? '( ' + item.imagesRemark + ' )' : ''}</p></div>` : ''}
                            </div>
                            <div class="share" data-time="${item.createdTime}"></div>
                        </div>
                        <div style="clear: both"></div>
                    </div>`
        })
        if (parseInt(page) === 1) {
            currBox.find('.lives-box').html(str)
        } else {
            currBox.find('.lives-box').append(str)
        }
    }

    // 展开
    $('.lives-box').on('click', '.text-msg', function () {
        if (!$(this).hasClass('maxH')) return
        $(this).removeClass('maxH').next().hide()
    })
    $('.lives-box').on('click', '.open-msg', function () {
        if (!$(this).prev().hasClass('maxH')) return
        $(this).hide().prev().removeClass('maxH')
    })

    // 快讯分享
    const $shareBox = $('#shareBox')
    const $shareTime = $('#shareTM')
    const $shareCon = $('#shareCon')
    const $imgWrap = $('#imgWrap')
    const $imgCon = $('#imgCon')
    const $imgConMask = $('#imgConMask')
    const $peitu = $('#peitu')
    const $peituiMsg = $('#peitu-msg')

    function Plane (obj) {
        $shareTime.text(obj.time)
        $('#articleTitle').text(obj.title)
        $shareCon.text(obj.text)
        $peitu.attr({'src': obj.imgUrl, 'alt': obj.remark})
        $peituiMsg.text(obj.remark)
        $shareBox.show()
        setTimeout(function () {
            const conHeight = parseInt($shareBox.find('.share-cont').height())
            const conPadding = parseInt($shareBox.find('.share-box').css('padding-top'))
            $shareBox.height(conPadding + conHeight)
            html2canvas(document.getElementById('shareBox'), {
                useCORS: true
            }).then(canvas => {
                let imgUri = canvas.toDataURL('image/jpeg') // 获取生成的图片的url
                $imgCon.attr('src', imgUri)
                $imgWrap.show()
            })
        }, 100)
    }

    $(document).on('click', '.new-fash-list .share', function () {
        let time = formatDateMore($(this).data('time'))
        let cont = $(this).closest('.text-flash').find('.text-msg').text().replace('「查看原文」', '')
        let title = $(this).closest('.text-flash').find('.text-title').text()
        let imgDoc = $(this).closest('.text-flash').find('.item-img')
        let imgUrl = imgDoc.attr('src') ? imgDoc.attr('src') : ''
        let remark = imgDoc.attr('src') ? $(this).closest('.text-flash').find('.img-remark').text() : ''
        const conTitle = $.trim(title)
        const conText = $.trim(cont)
        let shareData = {
            title: conTitle,
            text: conText,
            remark,
            imgUrl,
            time
        }

        if (!imgUrl) {
            Plane(shareData)
            return
        }

        axiosAjax({
            type: 'get',
            url: '/format',
            params: {
                imgUrl
            },
            fn: function (res) {
                shareData.imgUrl = res.imgUrl
                Plane(shareData)
            }
        })
    })
    $imgConMask.click(function () {
        $shareBox.hide()
        $imgWrap.hide()
    })
})
