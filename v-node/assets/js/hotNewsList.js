/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */

// import Cookies from 'js-cookie'
import {pageLoadingHide, axiosAjax, proxyUrl, fomartQuery, getHost} from './public/public'
import Pagination from './public/Pagination'
// import {pageLoadingHide, axiosAjax, proxyUrl, fomartQuery, getTimeContent, getHost} from './public/public'
// import layer from 'layui-layer'

$(function () {
    pageLoadingHide()

    // 初始化轮播图
    initSwiper()
    function initSwiper () {
        let mySwiper = new Swiper('#hotSwiper', {
            loop: false,
            autoplay: 3000,
            // 如果需要分页器
            pagination: '.swiper-pagination'
        })
        $('#hotSwiper').on('click', 'a', function () {
            let href = $(this).attr('href')
            window.open(href, '_black')
        })
        $('#hotSwiper').on('mouseenter', function () {
            mySwiper.stopAutoplay()
        })
        $('#hotSwiper').on('mouseleave', function () {
            mySwiper.startAutoplay()
        })
    }

    // tab切换
    $('#tabs').on('click', 'a', function () {
        $(this).addClass('active').siblings().removeClass('active')
        getNewsList({orderType: $(this).data('type'), currentPage: 1}, (res) => {
            initPage({
                total: res.recordCount, // 数据总条数
                size: res.pageSize, // 每页显示的条数,
                current: 1 // 当前第几页
            })
        })
    })

    // 分页
    let pageTotal = $('#pagination').data('total')
    let pageSize = $('#pagination').data('size')
    initPage()
    function initPage (obj) {
        let opt = {
            prevContent: '上一页',
            nextContent: '下一页',
            total: pageTotal, // 数据总条数
            size: pageSize, // 每页显示的条数,
            current: 1, // 当前第几页
            changePage: (p) => {
                getPageData(p)
            }
        }
        if (obj) {
            opt = {
                ...opt,
                ...obj
            }
        }
        let pag = new Pagination($('#pagination'), opt)
        pag.init()
    }
    function getPageData (p) {
        getNewsList({currentPage: p})
    }

    function getNewsList (obj, fn) {
        let sendData = {
            currentPage: 1,
            pageSize: 15,
            orderType: $('#tabs a').data('type')
        }
        if (obj) {
            sendData = {
                ...sendData,
                ...obj
            }
        }
        axiosAjax({
            type: 'get',
            url: proxyUrl + `/info/topic/gettopicpage?${fomartQuery(sendData)}`,
            formData: false,
            params: {},
            fn: function (res) {
                self.isSearching = false
                if (res.code === 1) {
                    renderHotList(!res.obj || !res.obj.inforList ? [] : res.obj.inforList)
                    if (fn) {
                        fn(res.obj)
                    }
                }
            }
        })
    }

    function renderHotList (arr) {
        let str = ''
        arr.map((d) => {
            let item = d.topic
            let news = !d.contentList ? [] : d.contentList
            str += `
            <div class="news-item">
            <div class="news-item-contain">
                <a target="_blank" class="mews-item-top clearfix" href="${getHost()}/hot/${item.tags}/${item.id}">
                    <img src="${!item.newSmallPcImgSrc ? '../../img/default-img.svg' : item.newSmallPcImgSrc}" alt="${item.topicName}">
                    <h3>${item.topicName}</h3>
                </a>`
            if (news.length > 0) {
                str += `<div class="desc clearfix"><i class="round"></i><a target="_blank" href="${getHost()}/newsdetail/${news[0].id}.html">${news[0].title}</a></div>`
            }
            str += `</div></div>`
        })
        $('.hot-news-list').html(str)
    }
})
