/**
 * Author：tantingting
 * Time：2018/8/13
 * Description：Description
 */
import {pageLoadingHide} from './public/public'
// import {LiveConfig} from './public/liveConfig'
import {LiveDetailConnect} from './live/liveDetail'
import {VideoPlay} from './public/liveConfig'

$(function () {
    pageLoadingHide()
    // new LiveConfig().init()
    // 视频
    new VideoPlay($('.live-contain')).init()
    let id = $('.summit-page2').data('id')
    let liveDeatil = new LiveDetailConnect(id, $('#replyBox'))
    liveDeatil.init()

    // 图集轮播
    let altsSwiper = new Swiper('.summit-page3 .swiper-container', {
        nextButton: '.summit-page3 .swiper-button-next',
        prevButton: '.summit-page3 .swiper-button-prev',
        loop: true,
        autoplay: 5000
    })

    $('.tab-nav').on('click', function () {
        let type = $(this).data('type')
        if ($(this).hasClass('active')) {
            return
        }
        $(this).addClass('active').siblings().removeClass('active')
        if (type === 'live') {
            $('.live-box-main').css({'display': 'block'})
            $('.reply-main-box').css({'display': 'none'})
        } else {
            $('.live-box-main').css({'display': 'none'})
            $('.reply-main-box').css({'display': 'block'})
        }
    })
    altsSwiper.autoplay = true
})
