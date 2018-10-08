/**
 * @Author：liushaozong
 * @Time：2018-08-15 11:30
 * @Desc：activity
 */
import {
    pageLoadingHide,
    axiosAjax,
    proxyUrl,
    fomartQuery
} from './public/public'
import {TopNav} from './modules/m-topNav'
const formatDate = (date) => {
    // let _str = !str ? '-' : str
    // const zero = (m) => {
    //     return m < 10 ? '0' + m : m
    // }
    let time = new Date(date)
    let m = time.getMonth() + 1
    let d = time.getDate()
    if (date) {
        return m + '月' + d + '日'
    } else {
        return ''
    }
}
$(function () {
    pageLoadingHide()
    let topNav = new TopNav({isHideTop: false})
    topNav.init()
    let activityBanner = new Swiper('.swiper-container', {
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        autoplay: {
            delay: 5000,
            stopOnLastSlide: false,
            disableOnInteraction: true
        },
        autoplayDisableOnInteraction: false,
        loop: true,
        observer: true,
        observeParents: true
    })
    activityBanner.autoplay = true
    let bannerNum = $('#activityBanner').data('num')
    if (bannerNum === 0) {
        $('.m-activity-banner').css({
            height: 0
        })
    }

    // 获取列表
    const getList = (place, timeType, currentPage, more) => {
        let sendData = {
            place: place,
            timeType: timeType,
            recommend: 0,
            currentPage: currentPage,
            pageSize: 9
        }
        axiosAjax({
            type: 'post',
            url: `${proxyUrl}/info/activity/newlist`,
            params: fomartQuery(sendData),
            fn: function (res) {
                if (res.code === 1) {
                    if (more === 'more') {
                        $('.activity-list').append(listStr(res.obj))
                    } else {
                        $('.activity-list').html(listStr(res.obj))
                    }
                }
            }
        })
    }
    const listStr = (obj) => {
        let arr = obj.inforList
        let str = ''
        if (parseInt(obj.pageCount) > 1) {
            $('.activity-more').show()
        } else {
            $('.activity-more').hide()
        }
        if (arr.length === 0) {
            return '<div class="not-available"></div>'
        }
        arr.map((item, index) => {
            $('.activity-more').data('page', obj.pageCount)
            let coverPic = JSON.parse(item.coverPic)
            str += `<div class="list">
            <a href="/huodongDetail/${item.id}" title="<%=item.title%>">
                <img src="${coverPic.wap_small}" alt="">
                <div class="list-right">
                    <h5 class="clearfix">${item.title}</h5>
                    <span class="state ${item.ingOrEnd === 1 ? '' : 'end'}">${item.ingOrEnd === 1 ? '报名中' : '已结束'}</span>
                    <p class="list-site clearfix"><span><img src="../img/activity/site.png" alt=""></span>${item.place}</p>
                    <p class="list-time"><span><img src="../img/activity/time.png" alt=""></span>${parseInt(item.endTime) - parseInt(item.startTime) < 86400000 ? formatDate(item.startTime) : (formatDate(item.startTime) + '-' + formatDate(item.endTime))}</p>
                </div>
            </a>
        </div>`
        })
        return str
    }
    let pagePresent = 1
    $('.site-con span').on('click', function () {
        pagePresent = 1
        $(this).addClass('active').siblings().removeClass('active')
        let timeType = $('.scope-box span.active').data('id')
        let type = $(this).data('type')
        getList(type, timeType, 1, 'tab')
    })
    $('.scope-box span').on('click', function () {
        pagePresent = 1
        $(this).addClass('active').siblings().removeClass('active')
        let timeType = $(this).data('id')
        let type = $('.site-con span.active').data('type')
        getList(type, timeType, 1, 'tab')
    })
    // 加载
    $('.activity-more').on('click', function () {
        pagePresent++
        let allPage = $(this).data('page')
        if (pagePresent > allPage) {
            pagePresent = allPage
            $('.activity-more').hide()
            return false
        }
        let type = $('.site-con span.active').data('type')
        let timeType = $('.scope-box span.active').data('id')
        getList(type, timeType, pagePresent, 'more')
    })
})
