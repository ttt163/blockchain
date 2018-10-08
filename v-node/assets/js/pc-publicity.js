/**
 * Author：yangbo
 * Time：2018/7/9 14:50
 * Description：pc-publicity.js
 */
import {pageLoadingHide} from '../js/public/public'
import '../../node_modules/layui-layer/dist/layer.js'
import CanvasParticle from '../js/public/canvas'

$(function () {
    pageLoadingHide()
    window.onload = function () {
        $('.top-nav li').on('click', function () {
            $(this).addClass('active').siblings().removeClass('active')
            let index = $(this).index()

            $('html, body').animate({
                scrollTop: $(`#top${index}`).offset().top
            }, 500)
        })

        // 配置
        let config = {
            vx: 4, // 点x轴速度,正为右，负为左
            vy: 4, // 点y轴速度
            height: 2, // 点高宽，其实为正方形，所以不宜太大
            width: 2,
            count: 100, // 点个数
            color: '121,162,185', // 点颜色
            stroke: '130,255,255', // 线条颜色
            dist: 0, // 点吸附距离
            e_dist: 20000, // 鼠标吸附加速距离
            max_conn: 10 // 点到点最大连接数
        }
        // 调用
        CanvasParticle(config)
    }

    let picture = $('.picture-img img')
    let imgTransition = setInterval(() => {
        let len = picture.length
        let i = Math.floor(len * Math.random())
        picture.eq(i).addClass('rotate')
        setTimeout(() => {
            picture.eq(i).removeClass('rotate')
        }, 500)
    }, 3000)

    let videoSwiper = new Swiper('.swiper-container.video-swiper', {
        nextButton: '.swiper-button-next.video-next',
        prevButton: '.swiper-button-prev.video-prev',
        pagination: '.swiper-pagination.video-page',
        width: 1079,
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 10,
        initialSlide: 0,
        paginationType: 'custom',
        paginationCustomRender: function (swiper, current, total) {
            let paginationHtml = ''
            for (let i = 0; i < total; i++) {
                // 判断是不是激活焦点，是的话添加active类，不是就只添加基本样式类
                if (i === (current - 1)) {
                    paginationHtml += '<span class="swiper-pagination-customs swiper-pagination-customs-active"></span>'
                } else {
                    paginationHtml += '<span class="swiper-pagination-customs"></span>'
                }
            }
            return paginationHtml
        },
        autoplay: 5000
    })

    $('.video-item').on('click', function () {
        let videoSrc = $(this).data('src')
        let videoPlayer = $('#video-player')

        videoPlayer.attr('src', videoSrc)
        $('.video-module').show()
    })

    $('.close-video').on('click', function () {
        let videoPlayer = $('#video-player')
        $('.video-module').hide()
        videoPlayer[0].pause()
    })
})
