/**
 * @Author：zhoushuanglong
 * @Time：2018-08-14 10:34
 * @Desc：bu download
 */
import {pageLoadingHide} from './public/public'

$(function () {
    pageLoadingHide()

    let administration = new Swiper('.administration', {
        pagination: '.adminP',
        loop: true,
        autoplay: 5000,
        autoplayDisableOnInteraction: false
    })
    administration.autoplay = true

    let dataSwiper = new Swiper('.data', {
        pagination: '.dataP',
        loop: true,
        autoplay: 5000,
        autoplayDisableOnInteraction: false
    })
    dataSwiper.autoplay = true
})
