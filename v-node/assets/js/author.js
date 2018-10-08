/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */

import {pageLoadingHide, axiosAjax, proxyUrl, fomartQuery, showLogin, getHost} from './public/public'
import Pagination from './public/Pagination'
import Cookies from 'js-cookie'
import layer from 'layui-layer'

$(function () {
    pageLoadingHide()
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
        let sendData = {
            currentPage: p
        }
        getData(sendData)
    }

    // 最新、推荐，最热
    $('#filterTap').on('click', 'a', function () {
        let type = $(this).data('type')
        $('#filterTap a').removeClass('active')
        $(this).addClass('active')
        let sendData = {
            type: type,
            currentPage: 1
        }
        getData(sendData, (res) => {
            initPage({total: res.obj.recordCount})
        })
    })

    // 关注作者
    $('.author-list-box').on('click', '.btn', function () {
        // let $this = $(this)
        if (!Cookies.get('hx_user_id')) {
            showLogin('login', '账号密码登录', '登录')
            return
        }
        let state = parseInt($(this).data('state'))
        let type = state === 1 ? 'delete' : 'add'
        let userId = $(this).data('userid')
        let obj = {
            authorId: userId
        }
        let followCount = parseInt($(this).closest('.list-item').find('.followCount').html())
        let bthStr = $(this).html()
        attention(type, obj, (res) => {
            if (res.code === 1) {
                if (type === 'delete') {
                    layer.msg('关注已取消')
                    followCount = followCount - 1
                    bthStr = '关注'
                    state = 0
                } else {
                    followCount = followCount + 1
                    layer.msg('关注成功')
                    bthStr = '已关注'
                    state = 1
                }
            } else if (res.code === 0) {
                followCount = followCount + 1
                bthStr = '已关注'
                state = 1
                layer.msg(res.msg)
            } else {
                layer.msg(res.msg)
            }
            $(this).closest('.list-item').find('.followCount').html(followCount)
            $(this).html(bthStr).data('state', state)
        })
    })
    function attention (type, obj, fun) {
        let sendData = {
            'passportid': !Cookies.get('hx_user_id') ? '' : Cookies.get('hx_user_id'),
            'token': !Cookies.get('hx_user_token') ? '' : Cookies.get('hx_user_token'),
            'authorId': '',
            ...obj
        }
        let url = `${proxyUrl}/info/follow/author/${type}?${fomartQuery(sendData)}`
        axiosAjax({
            type: 'post',
            url: url,
            formData: false,
            params: {},
            fn: function (resData) {
                if (fun) {
                    fun(resData)
                }
            }
        })
    }

    // 获取数据
    function getData (obj, fn) {
        let sendData = {
            type: $('#filterTap').find('.active').data('type'),
            currentPage: 1,
            pageSize: !$('#pagination').data('size') ? 12 : $('#pagination').data('size'),
            myPassportId: !Cookies.get('hx_user_id') ? '' : Cookies.get('hx_user_id')
        }
        if (obj) {
            sendData = {
                ...sendData,
                ...obj
            }
        }
        axiosAjax({
            type: 'get',
            url: `${proxyUrl}/info/author/list?${fomartQuery(sendData)}`,
            formData: false,
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    renderData(res.obj.inforList)
                    if (fn) {
                        fn(res)
                    }
                }
            }
        })
    }

    // 渲染html
    function renderData (arr) {
        let str = ''
        arr.map((item) => {
            str += `<div class="author-list-item">
            <a title="${item.nickName}" class="author-icon" href="${getHost()}/newsauthor/${item.passportId}"><img alt="${item.nickName}" src="${item.iconUrl}" /></a>
            <a title="${item.nickName}" class="author-name" href="${getHost()}/newsauthor/${item.passportId}">${item.nickName}</a>
            <p class="author-desc">${!item.introduce ? '' : item.introduce}</p>
            <p class="author-count">粉丝：<span class="followCount">${!item.followCount ? 0 : item.followCount}</span>&nbsp;&nbsp;|&nbsp;&nbsp;文章：${!item.newsCount ? 0 : item.newsCount}</p>
            <a data-userid="${item.passportId}" data-state="${item.ifCollect}" class="btn" href="javascript:void(0)">${parseInt(item.ifCollect) === 1 ? '已关注' : '关注'}</a>
        </div>`
        })
        $('.author-list-box').html(str)
    }

    // 获取入住专家数量
    axiosAjax({
        type: 'get',
        url: `${proxyUrl}/info/author/getauthorCount`,
        formData: false,
        params: {},
        fn: function (res) {
            if (res.code === 1) {
                $('#allCount').html(res.obj)
            }
        }
    })
})
