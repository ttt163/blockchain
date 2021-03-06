/**
 * Author：tantingting
 * Time：2018/5/16
 * Description：Description
 */
import {getHost} from '../public/public'
// m端头部
class TopNav {
    constructor (option) {
        let opt = {
            isBack: false,
            isSearch: true,
            isSlide: false,
            isHideTop: true
        }
        if (option) {
            opt = {
                ...opt,
                ...option
            }
        }
        this.swiperContain = $('#hxwrap')
        this.swiperPagination = $('#hxWrapPage')
        this.containWarp = $('#overAllBox')
        this.downNavUl = $('.nav-down-contain ul')
        this.mTop = $('#wTop')
        this.isBack = opt.isBack
        this.isSearch = opt.isSearch
        this.swiper = null
        this.newsId = this.swiperPagination.data('id')
        this.pathName = location.pathname
        this.isSlide = opt.isSlide // 是否滑动，详情页不支持滑动
        this.isHideTop = opt.isHideTop // 向上滑是否隐藏导航
        // 频道分类数组
        this.navData = [
            {
                title: '最新',
                channelId: '0'
            }, {
                title: '快讯',
                channelId: '100' // 假的channelId
            }, {
                title: '产业',
                channelId: '2'
            }, {
                title: '投资快报',
                channelId: '14'
            }, {
                title: '挖矿',
                channelId: '13'
            }, {
                title: '技术',
                channelId: '6'
            }, {
                title: '项目',
                channelId: '3'
            }, {
                title: '人物',
                channelId: '4'
            }, {
                title: '游戏',
                channelId: '7'
            }, {
                title: '八点',
                channelId: '8'
            }, {
                title: '王峰十问',
                channelId: '9'
            }
        ]
        this.currIndx = 0
    }

    init () {
        let self = this
        // let pathName = location.pathname
        if (parseInt(this.newsId) === 100) {
            this.currIndx = 1
        } else {
            this.currIndx = this.navData.findIndex((item, index) => {
                return parseInt(item.channelId) === parseInt(this.newsId)
            })
            if (this.currIndx === -1) {
                this.currIndx = 0
            }
        }
        this.renderDownNav()
        if (!this.isSlide) {
            // 不滑动页面
            this.initNoSlide()
            self.swiperPagination.removeClass('active')
            let p = self.swiperPagination.parent()
            let w = p.width()
            let currItem = self.swiperPagination.find('.swiper-pagination-bullet').eq(self.currIndx)
            let currItemWidth = currItem.width()
            let currItemOffLeft = currItem.offset().left
            let pOffLeft = p.scrollLeft()
            let deffLeft = (currItemOffLeft - pOffLeft - w / 2 + currItemWidth / 2)
            p.scrollLeft(deffLeft)
        } else {
            this.initSwiperNav()
            if (this.currIndx === 5) {
                self.swiperPagination.addClass('active')
            }
        }
        // 返回
        if (this.isBack) {
            let backStr = `<a href="javascript:;" class="back-prev-page"><img src="../../img/m-img/back-prev-page.png" alt=""></a>`
            if (!$('#huoxingTop').find('.back-prev-page').length) {
                $('#huoxingTop').append(backStr)
            }
            $('.back-prev-page').on('click', function (e) {
                e.preventDefault()
                e.stopPropagation()
                window.history.back()
            })
        }

        // 搜索
        if (this.isSearch) {
            let bStr = `<a class="search-btn" href="${getHost()}/search"><img src="../../img/m-img/search-img.png"></a>`
            if (!$('#huoxingTop').find('.search-btn').length) {
                $('#huoxingTop').append(bStr)
            }
        }

        $('.nav-down-contain ul').on('click', 'li', function () {
            let index = $('.nav-down-contain ul li').index(this)
            $('.nav-down .img-down').removeClass('up')
            $('.nav-down-warp').hide()
            if (!self.isSlide) {
                if (parseInt(index) === 0) {
                    location.href = `${getHost()}`
                } else if (index === 1) {
                    location.href = `${getHost()}/livenews`
                } else {
                    const type = self.navData[index].channelId
                    location.href = `${getHost()}/news/${type}`
                }
            } else {
                self.swiper.slideTo(index)
            }
        })
        $('.nav-down').on('click', '.img-down', function () {
            if ($(this).hasClass('up')) {
                $(this).removeClass('up')
                $('.nav-down-warp').removeClass('show')
            } else {
                $(this).addClass('up')
                $('.nav-down-warp').addClass('show')
            }
        })
        // 顶部滚动
        let lastScrollTop = 0
        $(window).scroll(function () {
            if ($('.nav-down-warp').hasClass('show')) {
                return
            }
            self.mTop.addClass('shadow')
            if (self.isHideTop) {
                let mTopHeight = self.mTop.height()
                let scrollTop = $(this).scrollTop()
                if (scrollTop - lastScrollTop > 0) {
                    if (scrollTop > mTopHeight) {
                        self.mTop.addClass('slideUp').removeClass('shadow')
                    }
                } else {
                    self.mTop.removeClass('slideUp').addClass('shadow')
                }
                lastScrollTop = scrollTop
            }
        })
    }

    initSwiperNav () {
        let navIndex = this.navData
        let self = this
        this.swiper = new Swiper(this.swiperContain, {
            initialSlide: self.currIndx,
            pagination: {
                el: this.swiperPagination,
                clickable: true,
                renderBullet: function (index, className) {
                    if (index === 1) {
                        return `<span class="${className} column-nav">${navIndex[index].title}<i class="${self.currIndx === index ? 'active' : ''}"></i></span>`
                    } else {
                        return `<span class="${className} column-nav" data-type="${navIndex[index].channelId}">${navIndex[index].title}<i class="${self.currIndx === index ? 'active' : ''}"></i></span>`
                    }
                }
            },
            on: {
                slideChangeTransitionStart: function () {
                    self.swiperPagination.find('.swiper-pagination-bullet').find('i').removeClass('active')
                    self.swiperPagination.find('.swiper-pagination-bullet').eq(this.activeIndex).find('i').addClass('active')
                    self.downNavUl.find('li').removeClass('active').eq(this.activeIndex).addClass('active')
                },
                slideChangeTransitionEnd: function () {
                    if (parseInt(this.activeIndex) === 0) {
                        location.href = `${getHost()}`
                    } else if (this.activeIndex === 1) {
                        if (self.pathName === '/livenews') {
                            return
                        }
                        location.href = `${getHost()}/livenews`
                    }
                    const type = $('span.column-nav').eq(this.activeIndex).data('type')
                    if (!type) {
                        return
                    }
                    location.href = `${getHost()}/news/${type}`
                }
            }
        })
        this.swiper.init()
    }

    renderDownNav () {
        // 下拉导航
        let navStr = ''
        this.navData.map((item, index) => {
            navStr += `<li data-type="${item.channelId}" class="${parseInt(index) === parseInt(this.currIndx) ? 'active' : ''}">${item.title}</li>`
        })
        this.downNavUl.html(navStr)
    }

    initNoSlide () {
        let classStr = 'swiper-pagination-bullet'
        let str = ''
        let self = this
        this.navData.map((item, index) => {
            let className = ''
            className = parseInt(index) === parseInt(self.currIndx) ? `${classStr} swiper-pagination-bullet-active` : classStr
            if (index === 1) {
                str += `<span class="${className} column-nav">${item.title}<i class="${self.currIndx === index ? 'active' : ''}"></i></span>`
            } else {
                str += `<span class="${className} column-nav" data-type="${item.channelId}">${item.title}<i class="${self.currIndx === index ? 'active' : ''}"></i></span>`
            }
        })
        this.swiperPagination.html(str)

        this.swiperPagination.on('click', '.column-nav', function () {
            let index = self.swiperPagination.find('.column-nav').index(this)
            self.swiperPagination.find('.column-nav').removeClass('swiper-pagination-bullet-active')
            self.swiperPagination.find('.column-nav').find('i').removeClass('active')
            $(this).addClass('swiper-pagination-bullet-active')
            $(this).find('i').addClass('active')
            if (parseInt(index) === 0) {
                location.href = `${getHost()}`
            } else if (index === 1) {
                location.href = `${getHost()}/livenews`
            } else {
                const type = $(this).data('type')
                location.href = `${getHost()}/news/${type}`
            }
        })
    }
}

export {
    TopNav
}
