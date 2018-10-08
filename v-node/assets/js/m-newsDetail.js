/**
 * Author：tantingting
 * Time：2018/4/27
 * Description：Description
 */

import { pageLoadingHide, getTimeContent, ajaxGet, Animation, getHost, rem, axiosAjax, proxyUrl } from './public/public'
import { TopNav } from './modules/m-topNav'
import { downLoadFn } from './m-common'

let url = '/info/news'
let apiInfo = '/info'
// const htmlPath = ''

$(function () {
    pageLoadingHide()

    let opt = {
        isNoSlide: true,
        isBack: true
    }
    let topNav = new TopNav(opt)
    topNav.init()
    let newsId = $('#currNewsBox').data('id')
    let score = $('#currNewsBox').data('score')

    // 音频
    let audio = $('.audio-wrap').data('audio')
    if (!audio) {
    } else {
        let musicList = []
        audio.map(function (item, index) {
            musicList.push({
                title: $.trim(item.fileName.split('.')[0]),
                singer: '',
                cover: '',
                src: item.fileUrl,
                lyric: null
            })
        })
        const smusic = new SMusic({
            musicList: musicList,
            autoPlay: false,
            defaultMode: 1,
            callback: function (obj) {
            }
        })
        console.log(smusic)
    }

    // 超出字数显示省略号
    const cutString = (str, len) => {
        // length属性读出来的汉字长度为1
        if (str.length * 2 <= len) {
            return str
        }
        let strlen = 0
        let s = ''
        for (let i = 0; i < str.length; i++) {
            s = s + str.charAt(i)
            if (str.charCodeAt(i) > 128) {
                strlen = strlen + 2
                if (strlen >= len) {
                    return s.substring(0, s.length - 1) + '...'
                }
            } else {
                strlen = strlen + 1
                if (strlen >= len) {
                    return s.substring(0, s.length - 2) + '...'
                }
            }
        }
        return s
    }

    let newsCorrelation = (tags, newsCounds, id) => {
        ajaxGet(url + '/relatednews', {
            tags: tags,
            newsCounds: newsCounds,
            id: id
        }, (data) => {
            let dataArr = !data.obj.inforList ? [] : data.obj.inforList
            let originalDate = new Date($.ajax({async: false}).getResponseHeader('Date'))
            let serve = originalDate + (3600000 * 8)
            let date = new Date(serve)
            let timestamp = date.getTime()
            let newsList = ''
            dataArr.map(function (d, i) {
                let time = getTimeContent(d.publishTime, timestamp)
                let img = JSON.parse(d.coverPic)
                newsList += `<div class="news-list-more " data="${i}">
                                <a title="${d.title}" href="${i > 2 ? getHost() + '/newsdetail/' + d.id + '.html' : 'javascript:void(0)'}" data-id="${d.id}" data-type="${i}" class="${i > 2 ? '' : 'b-down'}" data-text="${d.title}">
                                    <div class="title">${cutString(d.title, 60)}</div>
                                    <div class="list-text">
                                        <div class="author clearfix"><span>${d.author}</span></div>
                                        <div class="time clearfix"><span>${time}</span></div>
                                        <div class="app" style="display: ${i > 2 ? 'none' : 'block'}">打开APP</div>
                                    </div>
                                    <div class="cover-img-sma"><img src=${img.wap_small} alt="${d.title}"></div>
                                </a>
                            </div>`
            })
            $('.news-list-box').html(newsList)
            $('.news-list-more a').on('click', function () {
                let id = $(this).data('id')
                if ($(this).data('type') <= 2) {
                    downLoadFn($(this), id)
                }
            })
        })
    }

    newsCorrelation($('.details').data('tags'), 5, $('.details').data('id'))

    // 广告
    ajaxGet(apiInfo + '/ad/showad', {
        adPlace: 2,
        type: 2
    }, (data) => {
        const obj = !data.obj[2] ? [] : data.obj[2]
        let list = ''
        obj.map((item) => {
            list += `<div class="block-ad">
                        <div class="block-ad-title">
                            <h3>${item.remake}</h3>
                            ${item.useType === 1 ? '<span>广告</span>' : ''}
                        </div>
                        <div class="block-ad-con">
                            <a title="${item.remake}" href="${item.url}"><img src="${item.img_url}" alt="${item.remake}"/></a>
                        </div>
                    </div>`
        })
        $('.advertising').append(list)
    })

    // 返回顶部
    $(window).on('scroll', function () {
        let backTop = $(window).height() + $(window).scrollTop()
        if (backTop > 1500) {
            $('.back-top').addClass('top')
        } else {
            $('.back-top').removeClass('top')
        }
    })
    $('.back-top').on('click', function () {
        Animation()
    })
    // 详情展开
    if (!$('#currNewsBox').hasClass('openClass')) {
        // 公开课不完整页面没有一下功能
        $('.simditor-body').css({height: rem(1500)})
        $('#concealUnfold').on('click', function () {
            $('.simditor-body').css({height: 'auto', overflow: 'auto'})
            $('.conceal-box').removeClass('active')
            $('.community-img').css({paddingTop: 0})
        })
    }

    // 统计代码
    const caltCount = () => {
        let sendData = {id: newsId, ifRecommend: !score || score > 1 || score < 0 ? 0 : 1}
        axiosAjax({
            type: 'GET',
            url: proxyUrl + '/info/news/addreadcount',
            params: sendData,
            fn: function (resData) {}
        })
    }
    caltCount()

    // $('.lock-btn').on('click', function () {
    //     downLoadFn($(this), newsId)
    // })
})
