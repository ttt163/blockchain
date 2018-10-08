/**
 * Author：tantingting
 * Time：2018/4/27
 * Description：Description
 */
import {pageLoadingHide, axiosAjax, proxyUrl, fomartQuery, showLogin} from './public/public'
import Cookies from 'js-cookie'
import layer from 'layui-layer'
import {AsideMarked} from './newsDetail/index'

$(function () {
    pageLoadingHide()

    // 行情
    let marked = new AsideMarked($('.market'))
    marked.init()

    // 利好/利空
    bindJudgeProfit()

    function bindJudgeProfit () {
        $('.judge-profit').on('click', 'p', function () {
            let $this = $(this)
            let status = $this.data('status')
            let id = $this.data('id')
            let sendData = {
                passportid: !Cookies.get('hx_user_id') ? '' : Cookies.get('hx_user_id'),
                token: !Cookies.get('hx_user_token') ? '' : Cookies.get('hx_user_token'),
                status: status,
                id: id
            }
            if (!Cookies.get('hx_user_id')) {
                showLogin('login', '账号密码登录', '登录')
            } else {
                axiosAjax({
                    type: 'get',
                    url: proxyUrl + `/info/lives/upordown?${fomartQuery(sendData)}`,
                    formData: false,
                    params: {},
                    fn: function (res) {
                        if (res.code === 1) {
                            let num = parseInt($this.find('.num').html())
                            if ($this.hasClass('active')) {
                                $this.find('.num').html(num - 1)
                                $this.removeClass('active')
                            } else {
                                $this.find('.num').html(num + 1)
                                $this.addClass('active')
                                let $other = $this.siblings('p')
                                if ($other.hasClass('active')) {
                                    let otnerNum = $other.find('.num').html()
                                    $other.find('.num').html(otnerNum - 1)
                                    $other.removeClass('active')
                                }
                            }
                        } else {
                            layer.msg(res.msg)
                        }
                    }
                })
            }
        })
    }
})
