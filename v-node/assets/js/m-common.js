/**
 * Author：tantingting
 * Time：2018/4/27
 * Description：Description
 */
import { isWeixin, proxyUrl, fomartQuery, axiosAjax, isIos, isAndroid } from './public/public'
// import {Alert} from './modules/alertModal'

// 二维码路径改为不带域名路径
const imgArr = ['#shareBackground', '#shareTime', '#shareQrcode']
const domain = window.location.host.split('.')
const hostUrl = `${domain[1]}.${domain[2]}`
$.each(imgArr, function (index, item) {
    if ($(item).length !== 0) {
        if ($(item).attr('src').indexOf(hostUrl) > -1) {
            const newUrl = $(item).attr('src').split(hostUrl)[1]
            $(item).attr('src', newUrl)
        }
    }
})

// 下载，app内打开
let iosUrl = 'https://itunes.apple.com/cn/app/id1343659925?mt=8'
let andUrl = 'http://android.myapp.com/myapp/detail.htm?apkName=com.linekong.mars24&ADTAG=mobile#opened'
let yybUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.linekong.mars24'
let downLoad = $('.b-down')
let isLoding = false
$(document).on('click', '.b-down', function () {
    if (isLoding) {
        return
    }
    let dataId = $(this).data('id')
    isLoding = true
    let currLoaction = location.href
    if (isWeixin()) {
        // 微信浏览器打开应用宝
        $(this).attr('href', yybUrl)
    } else {
        let openUrl = ''
        if (currLoaction.toLocaleLowerCase().indexOf('/news') !== -1) {
            if (currLoaction.indexOf('/newsdetail') !== -1) {
                // 新闻详情
                openUrl = `marsbusiness://news/${$('#currNewsBox').data('id')}`
            } else {
                // 新闻列表
                openUrl = `marsbusiness://newlist/${$('#currNewsBox').data('id')}`
            }
        } else if (currLoaction.toLocaleLowerCase().indexOf('/newsdetail') !== -1) {
            openUrl = `marsbusiness://news/${$('#currNewsBox').data('id')}`
        } else if (currLoaction.toLocaleLowerCase().indexOf('/livenews') !== -1) {
            if (currLoaction.indexOf('/liveNewsDetail') !== -1) {
                // 快讯详情
                openUrl = `marsbusiness://fast/${dataId}`
            } else {
                // 快讯列表
                openUrl = `marsbusiness://home/fast`
            }
        } else if (currLoaction.toLocaleLowerCase().indexOf('/video') !== -1) {
            if (currLoaction.indexOf('/videoDetails') !== -1) {
                // 视频详情
                openUrl = `marsbusiness://video/${$('#currNewsBox').find('.curr-video').data('id')}`
            } else {
                // 视频列表
                openUrl = `marsbusiness://home/video`
            }
        } else {
            // 首页
            openUrl = `marsbusiness://home/new`
        }
        // alert(openUrl)
        openApp(openUrl)
    }
})
// 检查app是否打开
const checkOpen = (callback) => {
    let _clickTime = +(new Date())
    // 启动间隔20ms运行的定时器，并检测累计消耗时间是否超过3000ms，超过则结束
    let _count = 0
    let intHandle
    intHandle = setInterval(() => {
        _count++
        let elsTime = +(new Date()) - _clickTime
        if (_count >= 100 || elsTime > 3000) {
            clearInterval(intHandle)
            // alert(elsTime)
            console.log(elsTime)
            if (elsTime > 3000 || document.hidden || document.webkitHidden) {
                console.log('正在打开app')
            } else {
                callback()
            }
            isLoding = false
        }
    }, 20)
}
// 打开app
const openApp = (url) => {
    location.href = url
    checkOpen(() => {
        if (isIos()) {
            console.log(iosUrl)
            location.href = iosUrl
        } else if (isAndroid()) {
            location.href = andUrl
        }
    })
}

// 返回
$('.back-prev-page').on('click', function (e) {
    e.preventDefault()
    e.stopPropagation()
    window.history.back()
})
// 底部滚动
const getBottomCon = () => {
    let sendData = {
        currentPage: 1,
        pageSize: 3,
        recommend: 1,
        status: 1
    }
    axiosAjax({
        type: 'post',
        url: `${proxyUrl}/info/news/shownews`,
        params: fomartQuery(sendData),
        fn: function (res) {
            if (res.code === 1) {
                let str = ''
                let dataArr = res.obj.inforList
                dataArr.map((item, index) => {
                    str += `<div class="swiper-slide"><a href="javascript:void(0)" data-id="${item.id}"><img src="${item.iconUrl}" alt=""><p>${item.title}</p></a></div>`
                })
                $('#bottomSwiper').html(str)
                let bottomSwiper = new Swiper('#bottomSwiperBox', {
                    pagination: {
                        el: '#bottomPagination',
                        clickable: true
                    },
                    autoplay: {
                        delay: 3000,
                        stopOnLastSlide: true,
                        disableOnInteraction: false
                    },
                    observer: true,
                    observeParents: true,
                    autoplayDisableOnInteraction: false
                })
                console.log(bottomSwiper)
            }
        }
    })
}
// 设置底部id
if ($('#bottomSwiper').length) {
    getBottomCon()
}
