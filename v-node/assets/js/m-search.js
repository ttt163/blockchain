/**
 * Author: yangbo
 * Time: 2018-05-17 11:26:23
 * Description: Description
 */
import {
    pageLoadingHide,
    axiosAjax,
    proxyUrl,
    formatDateMore,
    getTimeContent,
    getHost
} from '../js/public/public'

$(function () {
    pageLoadingHide()
    const abPath = getHost()

    let newsFlag = true
    let livesFlag = true
    let empty = $('.search-empty')
    let resDoc = $('.search-res')
    let cancel = $('.cancel-search')
    const typeDoc = (data, type) => { // msg-mark
        switch (type) {
            case 'lives':
                if (!data.title) {
                    data.content.replace(/【([^【】]+)】/g, function () {
                        data.title = arguments[1]
                    })
                }

                return `<div class="lives-item">
                            <div class="lives-item-time">
                                <i class="iconfont iconfont-time"></i>${formatDateMore(data.createdTime)}
                            </div>
                            <div class="lives-item-content">
                                <p class="content-title"><a title="${data.title}" href="${abPath}/liveNewsDetail/${data.id}.html">${data.title}</a></p>
                                <p class="content-msg">${data.content}</p>
                            </div>
                        </div>`
            case 'news':
                return `<div class="news-item">
                            <div class="news-item-content">
                                <p class="content-title"><a title="${data.title}" href="${abPath}/newsdetail/${data.id}.html">${data.title}</a></p>
                                <p class="content-sup">
                                    <span>${data.author}</span>
                                    <span>${getTimeContent(data.createTime, new Date().getTime())}</span>
                                </p>
                            </div>
                            <div class="news-item-img">
                                <img src="${JSON.parse(data.coverPic).wap_small}" class="img-pic" alt="${data.title}">
                            </div>
                        </div>`
        }
        return ``
    }

    $('.res-tab').on('click', 'li', function () {
        let type = $(this).data('type')
        let index = $(this).index()
        let scrollItem = $('.scroll-item')
        $(this).addClass('active').siblings().removeClass('active')
        scrollItem.eq(index).addClass('item-show').siblings().removeClass('item-show')
        $('.scroll-box').data('type', type)
    })

    $('.scroll-box').on('click', '.more-link', function () {
        let type = $(this).data('type')
        let scrollItem = $('.scroll-item')
        let showPage = $(`.res-tab li[data-type=${type}]`)
        showPage.addClass('active').siblings().removeClass('active')
        scrollItem.eq(showPage.index()).addClass('item-show').siblings().removeClass('item-show')
    })

    $('.search-group').on('input', '.search', function () {
        let val = $.trim($(this).val())
        if (!val) {
            empty.show()
            resDoc.hide()
            cancel.removeClass('input-in')
        } else {
            cancel.addClass('input-in')
        }
    })

    $('.search-group').on('keypress', '.search', function (e) {
        let that = $(this)
        let val = $.trim(that.val())
        let keycode = e.keyCode
        let livesRes = []
        let newsRes = []
        let newsAll = $('#newsAll').find('.news-content')
        let livesAll = $('#livesAll').find('.lives-content')
        let news = $('#news')
        let lives = $('#lives')
        let limit = 10

        if (parseInt(keycode) === 13) {
            if (val === '') {
                // layer.msg('搜索内容不能为空!')
                return
            }
            e.preventDefault()
            $(`.res-tab li`).data('flag', 'yes')

            axiosAjax({
                type: 'complexpost',
                url: proxyUrl + '/info/news/search',
                params: {
                    pageSize: limit,
                    page: 1,
                    q: val
                },
                fn: function (data) {
                    newsRes = data.obj.inforList.map(item => typeDoc(item, 'news')).join('')
                    axiosAjax({
                        type: 'complexpost',
                        url: proxyUrl + '/info/lives/search',
                        params: {
                            pageSize: limit,
                            page: 1,
                            keyWord: val
                        },
                        fn: function (data) {
                            livesRes = data.obj.inforList.map(item => typeDoc(item, 'lives')).join('')
                            if (livesRes.length < 1 && newsRes.length < 1) {
                                // layer.msg('未找到匹配结果')
                                return
                            } else {
                                resDoc.show()
                                empty.hide()
                            }

                            if (newsRes.length < 1) {
                                $('.news-box').hide()
                            }
                            if (livesRes.length < 1) {
                                $('.lives-box').hide()
                            }

                            newsAll.html(newsRes)
                            news.html(newsRes)
                            livesAll.html(livesRes)
                            lives.html(livesRes)
                        }
                    })
                }
            })
        }
    })

    $('.search-group').on('click', '.cancel-search', function () {
        window.history.go(-1)
    })

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
        let val = $('.search').val()
        let that = $(this)
        let type = that.data('type')
        let flag = $(`.res-tab li[data-type=${type}]`).data('flag')
        let limit = 10
        if (type === 'all' || flag === 'no') return

        let e = arguments[0]
        let {scrollHeight, clientHeight, scrollTop} = e.target

        if (scrollTop + clientHeight + 50 > scrollHeight) {
            if (type === 'lives') {
                if (!livesFlag) {
                    return
                }
                let page = $(`.res-tab li[data-type=${type}]`).data('page')
                livesFlag = false
                axiosAjax({
                    type: 'complexpost',
                    url: proxyUrl + '/info/lives/search',
                    params: {
                        pageSize: limit,
                        page,
                        keyWord: val
                    },
                    fn: function (data) {
                        livesFlag = true
                        if (page >= data.obj.totalIndex) {
                            $(`.res-tab li[data-type=${type}]`).data('flag', 'no')
                            return
                        }
                        $(`.res-tab li[data-type=${type}]`).data('page', ++page)
                        let result = data.obj.inforList.map(item => typeDoc(item, 'lives')).join('')
                        $(`#${type}`).append(result)
                    }
                })
            }
            if (type === 'news') {
                if (!newsFlag) {
                    return
                }
                let page = $(`.res-tab li[data-type=${type}]`).data('page')
                newsFlag = false
                axiosAjax({
                    type: 'complexpost',
                    url: proxyUrl + '/info/news/search',
                    params: {
                        pageSize: limit,
                        page,
                        q: val
                    },
                    fn: function (data) {
                        newsFlag = true
                        if (page >= data.obj.totalIndex) {
                            $(`.res-tab li[data-type=${type}]`).data('flag', 'no')
                            return
                        }
                        $(`.res-tab li[data-type=${type}]`).data('page', ++page)

                        let result = data.obj.inforList.map(item => typeDoc(item, 'news')).join('')
                        $(`#${type}`).append(result)
                    }
                })
            }
        }
    }

    $('.scroll-box').on('scroll', debounce(foo, 34))

    $('.hot-link').on('click', 'span', function () {
        let value = $.trim($(this).text())
        let livesRes = []
        let newsRes = []
        let newsAll = $('#newsAll').find('.news-content')
        let livesAll = $('#livesAll').find('.lives-content')
        let news = $('#news')
        let lives = $('#lives')
        let limit = 10

        $('.search').val(value)
        axiosAjax({
            type: 'complexpost',
            url: proxyUrl + '/info/news/search',
            params: {
                pageSize: limit,
                page: 1,
                q: value
            },
            fn: function (data) {
                newsRes = data.obj.inforList.map(item => typeDoc(item, 'news')).join('')
                axiosAjax({
                    type: 'complexpost',
                    url: proxyUrl + '/info/lives/search',
                    params: {
                        pageSize: limit,
                        page: 1,
                        keyWord: value
                    },
                    fn: function (data) {
                        livesRes = data.obj.inforList.map(item => typeDoc(item, 'lives')).join('')
                        if (livesRes.length < 1 && newsRes.length < 1) {
                            // layer.msg('未找到匹配结果')
                            return
                        } else {
                            resDoc.show()
                            empty.hide()
                        }

                        if (newsRes.length < 1) {
                            $('.news-box').hide()
                        }
                        if (livesRes.length < 1) {
                            $('.lives-box').hide()
                        }

                        newsAll.html(newsRes)
                        news.html(newsRes)
                        livesAll.html(livesRes)
                        lives.html(livesRes)
                    }
                })
            }
        })
    })
})
