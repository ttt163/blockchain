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

$(function () {
    pageLoadingHide()
    const formatDate = (date, str) => {
        let time = new Date(date)
        let m = time.getMonth() + 1
        let d = time.getDate()
        if (date) {
            return m + '月' + d + '日'
        } else {
            return ''
        }
    }
    let bannerNum = $('.banner').data('num')
    if (bannerNum === 0) {
        $('.home-top').css({
            height: '65px',
            background: '#f4f4f4',
            border: 'none'
        })
    } else if (bannerNum > 2) {
        let activity = new Swiper('.activity-banner', {
            pagination: '.activity-p',
            nextButton: '.activity-n-x',
            prevButton: '.activity-p-x',
            loop: true,
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            preventClicks: false,
            paginationClickable: false,
            autoplayDisableOnInteraction: false,
            autoplay: 5000,
            coverflow: {
                rotate: 30, // 旋转的角度
                stretch: 300, // 拉伸   图片间左右的间距和密集度
                depth: 431, // 深度   切换图片间上下的间距和密集度
                modifier: 2, // 修正值 该值越大前面的效果越明显
                slideShadows: false // 页面阴影效果
            }
        })
        activity.autoplay = true
    } else {
        $('.banner').css('width', '1200px')
        $('.activity-next').css('left', '1130px')
        $('.activity-prev').css('left', '10px')
        let activity = new Swiper('.activity-banner', {
            pagination: '.activity-p',
            nextButton: '.activity-next',
            prevButton: '.activity-prev',
            paginationClickable: false,
            autoplayDisableOnInteraction: false,
            loop: true,
            autoplay: 5000,
            preventClicks: false
        })
        activity.autoplay = true
    }

    // 获取列表
    const getList = (place, timeType, currentPage, index) => {
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
            noloading: true,
            fn: function (res) {
                if (res.code === 1) {
                    $('#activityListBox').html(listStr(res.obj))
                    let pageStr = ''
                    for (let i = 1; i <= res.obj.pageCount; i++) {
                        pageStr += `<span data-page="${i}" class="${i === index ? 'active' : ''}">${i}</span>`
                    }
                    $('.page-num').html(pageStr)
                }
            }
        })
    }
    const listStr = (obj) => {
        let arr = obj.inforList
        let str = ''
        if (parseInt(obj.pageCount) > 1) {
            $('.activity-page').css('height', '40px')
        } else {
            $('.activity-page').css('height', 0)
        }
        if (arr.length === 0) {
            return '<div class="not-available"></div>'
        }
        arr.map((item, index) => {
            let coverPic = JSON.parse(item.coverPic)
            str += `<a href="/huodongDetail/${item.id}" class="list-box" title="${item.title}" target="_blank">
                    <div class="activity-state ${obj.currentTime > item.endTime ? 'over' : ''}">${obj.currentTime > item.endTime ? '已结束' : '报名中'}</div>
                    <img src="${coverPic.pc}" alt="${item.title}" title="${item.title}">
                    <p title="${item.title}">${item.title}</p>
                    <div class="list-b">
                        <p class="p-site"><img src="../img/activity/site.png" alt=""><span>${item.place}</span></p>
                        <p class="p-time"><img src="../img/activity/time.png" alt=""><span>${parseInt(item.endTime) - parseInt(item.startTime) < 86400000 ? formatDate(item.startTime) : (formatDate(item.startTime) + '-' + formatDate(item.endTime))}</span></p>
                    </div>
                </a>`
        })
        return str
    }
    $('#activityNav li').on('click', function () {
        $(this).addClass('active').siblings().removeClass('active')
        let timeType = $('.activity-data p.active').data('id')
        let type = $(this).data('type')
        getList(type, timeType, 1, 1)
    })
    $('.activity-data p').on('click', function () {
        $(this).addClass('active').siblings().removeClass('active')
        let timeType = $(this).data('id')
        let type = $('#activityNav li.active').data('type')
        getList(type, timeType, 1, 1)
    })

    // 分页
    let pagePresent = 1
    $('.page-num').on('click', 'span', function () {
        $(this).addClass('active').siblings().removeClass('active')
        let index = ($(this).index() + 1)
        pagePresent = index
        let type = $('#activityNav li.active').data('type')
        let timeType = $('.activity-data p.active').data('id')
        let page = $(this).data('page')
        getList(type, timeType, page, index)
    })
    // 下一页
    $('.activity-next').on('click', function () {
        pagePresent++
        let lastPage = $('.page-num span:last-child').data('page')
        if (pagePresent > lastPage) {
            pagePresent = lastPage
            return false
        }
        let type = $('#activityNav li.active').data('type')
        let timeType = $('.activity-data p.active').data('id')
        getList(type, timeType, pagePresent, pagePresent)
    })
    // 上一页
    $('.activity-prev').on('click', function () {
        pagePresent--
        if (pagePresent < 1) {
            pagePresent = 1
            return false
        }
        let type = $('#activityNav li.active').data('type')
        let timeType = $('.activity-data p.active').data('id')
        getList(type, timeType, pagePresent, pagePresent)
    })

    // 点击复制
    $('#activityCopy').on('click', function () {
        tapCopy()
    })
    function tapCopy () {
        selectText('fMailbox')
        document.execCommand('copy')
        alert('复制成功')
    }
    // 选中文本
    function selectText (element) {
        let text = document.getElementById(element)
        // 做下兼容
        if (document.body.createTextRange) { // 如果支持
            let range = document.body.createTextRange() // 获取range
            range.moveToElementText(text) // 光标移上去
            range.select() // 选择
        } else if (window.getSelection) {
            let selection = window.getSelection() // 获取selection
            let range = document.createRange() // 创建range
            range.selectNodeContents(text) // 选择节点内容
            selection.removeAllRanges() // 移除所有range
            selection.addRange(range) // 添加range
        } else {
            alert('复制失败')
        }
    }
})
