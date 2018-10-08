/**
 * Author：tantingting
 * Time：2018/4/9
 * Description：Description
 */

import Cookies from 'js-cookie'
import {pageLoadingHide, axiosAjax, proxyUrl, showLogin, ajax} from './public/public'
import {ad, relatedNews, NewsAuthor, hotNews} from './modules/index'
import {AsideMarked, Reply, MusicPlay} from './newsDetail/index'

$(function () {
    // let newsId = getQueryString('id')
    pageLoadingHide()
    let newsDataInfo = $('.news-detail').data('info')
    let newsId = newsDataInfo.id

    // 右侧广告
    let newsAdvertising = new Swiper('.swiper-container.news-ad', {
        pagination: '.swiper-pagination.news-page',
        autoplay: 5000,
        loop: true,
        observer: true,
        observeParents: true,
        autoplayDisableOnInteraction: false
    })
    newsAdvertising.autoplay = true

    // 广告
    const advertising = ajax({
        type: 'get',
        url: proxyUrl + '/info/ad/showad',
        formData: false,
        params: {
            adPlace: '6,7',
            type: '1'
        }
    })

    let favorite
    // 感兴趣的内容
    if (!Cookies.get('hx_user_token')) {
        // 默认
        favorite = ajax({
            type: 'get',
            url: proxyUrl + '/info/news/hotnews',
            formData: false,
            params: {
                lastDays: 30,
                readCounts: 100,
                newsCounts: 6
            }
        })
    } else {
        // 推荐
        favorite = ajax({
            type: 'get',
            url: proxyUrl + '/info/recommend/getplatenews',
            formData: false,
            params: {
                pageSize: 6,
                currentPage: 1,
                passportId: Cookies.get('hx_user_id')
            }
        })
    }

    // 作者信息
    const author = ajax({
        type: 'get',
        url: `${proxyUrl}/info/news/getauthorinfo`,
        formData: false,
        params: {
            passportId: newsDataInfo.createdBy,
            myPassportId: !Cookies.get('hx_user_id') ? '' : Cookies.get('hx_user_id')
        }
    })

    // 相关新闻
    const news = ajax({
        type: 'get',
        url: `${proxyUrl}/info/news/relatednews`,
        formData: false,
        params: {
            tags: newsDataInfo.tags,
            id: newsDataInfo.id,
            newsCounts: 6,
            publishTime: newsDataInfo.publishTime
        }
    })

    Promise.all([advertising, favorite, author, news]).then(function (data) {
        const advertising = data[0]
        const favorite = data[1]
        const author = data[2]
        const news = data[3]

        if (advertising.code === 1) {
            let bottomAd = ad(advertising.obj[6], 6)
            let rightAd = ad(advertising.obj[7], 7)
            $('#adBottomBox').html(bottomAd)
            $('#adRight').html(rightAd)
        }

        if (news.code === 1) {
            if (!news.obj.inforList || !news.obj.inforList.length) {
                $('.new-interest').css({'display': 'none'})
            } else {
                let newsData = hotNews(news.obj.inforList)
                $('.interest-box').html(newsData)
            }
        }

        if (author.code === 1) {
            let authorIn = new NewsAuthor(author.obj)
            authorIn.init($('.authorinfo'), 'right')
            authorIn.init($('.share-authorinfo'), 'bottom')
        }

        if (favorite.code === 1) {
            if (!favorite.obj.inforList || !favorite.obj.inforList.length) {
                $('.ad-recomend').css({'display': 'none'})
            } else {
                let dataIn = favorite.obj.inforList
                let right = relatedNews(dataIn, 'right')
                $('.ad-recomend .news-recommend').html(right)
            }
        }

        const $nextPage = $('.next-page')
        const $adRecomend = $('.ad-recomend')
        const $replyModule = $('.reply-module')

        $(window).scroll(function () {
            const ifOne = ($(this).scrollTop() + $(this).height()) >= ($('.footer-main').offset().top - 50)
            const ifTwo = $('.footer-main').height() + $nextPage.height() > $(this).height()
            if (ifOne && ifTwo) {
                $nextPage.css({
                    position: 'fixed',
                    top: 'auto',
                    bottom: $(this).scrollTop() + $(this).height() - $replyModule.offset().top - $replyModule.height() - 62,
                    right: ($(window).width() - 1200) / 2
                })
            } else if ($(this).scrollTop() >= ($adRecomend.position().top + $adRecomend.height())) {
                $nextPage.css({
                    position: 'fixed',
                    top: 0,
                    bottom: 'auto',
                    right: ($(window).width() - 1200) / 2
                })
            } else {
                $nextPage.css({
                    position: 'inherit',
                    top: 0,
                    right: 0
                })
            }
        })
    }).catch(function (error) {
        console.log(error)
    })

    // 行情
    let marked = new AsideMarked($('.news-market'))
    marked.init()

    // 评论
    let reply = new Reply($('#replyBox'), newsId)
    reply.init()

    // 音频
    if ($('#react-music-player').length) {
        let musicPlay = new MusicPlay($('#react-music-player').data('info'), $('#react-music-player'))
        musicPlay.init()
    }

    // 收藏
    $('.collect-img').on('click', function () {
        let $this = $(this)
        let userId = Cookies.get('hx_user_id')
        let token = Cookies.get('hx_user_token')
        if (!userId) {
            showLogin('login', '账号密码登录', '登录')
        } else {
            let ifCollect = $(this).data('ifcollect')
            let status = parseInt(ifCollect) === 1 ? -1 : 1
            let sendData = {
                newsId: newsId,
                passportId: userId,
                token: token,
                status: status
            }
            axiosAjax({
                type: 'get',
                url: proxyUrl + '/info/news/collect',
                formData: false,
                params: sendData,
                fn: function (res) {
                    if (res.code === 1) {
                        if (parseInt(ifCollect) === 0) {
                            $this.data('ifcollect', '1')
                            $this.addClass('active')
                        } else {
                            $this.data('ifcollect', '0')
                            $this.removeClass('active')
                        }
                    }
                }
            })
        }
    })

    $('#shareBox').share({sites: ['qq', 'weibo', 'wechat']})
    $('#backTop').on('click', function () {
        $('html, body').animate({
            scrollTop: 0
        }, 500)
    })

    // let isAllLoaded = false
    window.onload = function () {
        // 所有内容，包括图片，加载完毕后执行
        // isAllLoaded = true
        let replyBoxTop = $('#replyIssue').offset().top
        $('.comment-btn').on('click', function () {
            $('html, body').animate({
                scrollTop: replyBoxTop
            }, 500)
        })
        let fixedBottom = $('#topFixed').offset().top
        let detailsCont = $('#detailBox').outerHeight() + 145
        $('#newsShare').css({
            'position': 'fixed'
        })
        if (detailsCont > $(window).height()) {
            $(window).scroll(() => {
                let t = $(window).scrollTop()
                if (t < (fixedBottom - $(window).height() + 60)) {
                    $('#newsShare').css({
                        'position': 'fixed',
                        'bottom': 0
                    })
                } else {
                    $('#newsShare').css({
                        'position': 'static'
                    })
                }
            })
        } else {
            $('#newsShare').css({
                'position': 'static'
            })
        }
    }

    // 统计代码
    const caltCount = () => {
        let sendData = {id: newsId, ifRecommend: !newsDataInfo.score || newsDataInfo.score > 1 || newsDataInfo.score < 0 ? 0 : 1}
        axiosAjax({
            type: 'GET',
            url: proxyUrl + '/info/news/addreadcount',
            params: sendData,
            fn: function (resData) {}
        })
    }
    caltCount()
})
