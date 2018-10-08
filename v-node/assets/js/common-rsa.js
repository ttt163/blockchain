/**
 * Author：tantingting
 * Time：2018/4/9
 * Description：Description
 */
import {
    axiosAjax,
    proxyUrl,
    isPoneAvailable,
    getQueryString,
    fomartQuery,
    showLogin,
    // NavTitle,
    getHost,
    encrypt,
    passwordReg
    // lang,
    // outputdollars
    // footerHotData,
    // footerAboutData
} from './public/public'
import Cookies from 'js-cookie'
import {Reply} from './newsDetail/index'
import {NewsAuthor} from './modules/index'
// import '../../node_modules/layui-layer/dist/layer.js'
import layer from 'layui-layer'

$(function () {
    function renderFooterNav (type) {
        let ftPartnerLink = $('.ft-partner-link-in')
        let friendshipLink = $('.footer-host-tag')
        axiosAjax({
            type: 'complexpost',
            url: `${proxyUrl}/info/news/getfooterinfo`,
            params: {
                type: type
            },
            fn: function (res) {
                if (res.code === 1) {
                    let partnerRes = ''
                    let friendship = ''
                    res.obj.inforList.map((item) => {
                        if (item.type === 1) {
                            partnerRes += `<a title="${item.name}" target="_blank" href="${item.url}" class="linekong" rel="nofollow">${item.name}<span></span></a>`
                        } else if (item.type === 3) {
                            friendship += `<a title="${item.name}" target="_blank" href="${item.url}" class="linekong" rel="nofollow"><img src="${item.image}" alt=""></a>`
                        }
                    })
                    if (type === 1) {
                        ftPartnerLink.html(partnerRes)
                        controlSpan()
                    } else if (type === 3) {
                        friendshipLink.html(friendship)
                    }
                } else {
                    console.log(res.msg)
                }
            }
        })
    }

    function controlSpan () {
        let oSpan = $('.linekong')
        let width = $('.ft-partner-link-in').width()
        let curW = null
        let toArray = function (s) {
            try {
                return Array.prototype.slice.call(s)
            } catch (e) {
                let arr = []
                for (let i = 0, len = s.length; i < len; i++) {
                    arr[i] = s[i]
                }
                return arr
            }
        }

        toArray(oSpan).forEach((item, index) => {
            let TW = width
            let temp = $(item).outerWidth()
            curW += temp
            if (curW > TW) {
                curW = temp
                oSpan.eq(index - 1).find('span').remove()
            } else if (curW === TW) {
                curW = 0
                oSpan.eq(index).find('span').remove()
            }
        })
    }

    renderFooterNav(3)
    renderFooterNav(1)
    // 是否登录
    let hasLogin = Cookies.get('hx_user_id') || ''
    let hxNickName = Cookies.get('hx_user_nickname') || ''
    if (!hasLogin) {
        isLogin(false)
    } else {
        isLogin(true, hxNickName)
    }

    //
    let pathname = location.href
    if (pathname.indexOf('/user') > -1) {
        $('#navLoginContent a.login').addClass('login-active')
    }

    /* function getImgBtn () {
        axiosAjax({
            type: 'POST',
            url: `${proxyUrl}/passport/account/getGraphCode`,
            params: {},
            fn: function (resData) {
                $('#codeImg').attr('src', '/passport/account/getGraphCode')
            }
        })
    } */

    function isLogin (flag, nickName) {
        let navLoginContent = $('#navLoginContent')
        if (!flag) {
            // 没有登录
            navLoginContent.find('span.login').css({'display': 'inline-block'})
            navLoginContent.find('a.login').html('').css({'display': 'none'}).attr('title', '')
            navLoginContent.find('#loginOut').css({'display': 'none'})
            navLoginContent.find('.register').css({'display': 'inline-block'})
            $('.login-succeed').removeClass('active')
            $('.app-box').css('right', '175px')
        } else {
            // 登录
            navLoginContent.find('span.login').css({'display': 'none'})
            // navLoginContent.find('a.login').html(cutString(nickName, 8)).css({'display': 'inline-block'}).attr('title', nickName)
            navLoginContent.find('#loginOut').css({'display': 'inline-block'})
            navLoginContent.find('.register').css({'display': 'none'})
            navLoginContent.find('a.login').html(`<img class="user-img" src=${Cookies.get('hx_user_url')}>`).css({'display': 'inline-block'}).attr('title', nickName)
            $('.app-box').css('right', '80px')
            $('#userName').html(nickName)

            let loginSucceed = $('.login-succeed').get(0)
            let loginImg = $('.loginImg').get(0)
            let timer = 0
            loginImg.onmouseover = function () {
                clearTimeout(timer)
                loginSucceed.style.display = 'block'
            }
            loginImg.onmouseout = function () {
                clearTimeout(timer)
                timer = setTimeout(function () {
                    loginSucceed.style.display = 'none'
                }, 500)
            }
            loginSucceed.onmouseover = function () {
                clearTimeout(timer)
            }
            loginSucceed.onmouseout = function () {
                clearTimeout(timer)
                timer = setTimeout(function () {
                    loginSucceed.style.display = 'none'
                }, 500)
            }
        }
    }

    // 搜索
    $('.seek-btn').on('click', function () {
        isShowsearch()
        $('#searchShade').show()
        $('body').css('overflow', 'hidden')
        $('#searchInput').focus()
    })
    $('.search-content-div .close, #searchShade').on('click', function () {
        isShowsearch('close')
        $('#searchShade').hide()
        $('body').css('overflow', 'auto')
    })

    function isShowsearch (type) {
        let per = $('.search-content-div')
        if (type === 'close') {
            per.find('.search-content input').val('')
            per.removeClass('fadeIn')
            per.find('.search-content').removeClass('active')
        } else {
            per.addClass('fadeIn')
            per.find('.search-content').addClass('active')
        }
    }

    // 回车搜索
    document.addEventListener('keydown', (event) => {
        if ($('.search-content').hasClass('active') && event.keyCode === 13) {
            let val = $('#searchInput').val()
            if (location.href.indexOf('/search') === -1) {
                window.open(`${getHost()}/search/${val}`, '_blank')
                $('#searchShade').hide()
                $('body').css('overflow', 'auto')
            } else {
                location.href = `${getHost()}/search/${val}`
            }
        }
    })

    class Login {
        constructor () {
            this.loginWarp = $('#loginWarp')
            this.formItem = this.loginWarp.find('.form-item')
            this.resType = 1 // 1注册，绑定手机号码， 2找回密码, 3短信登录
            this.type = 'login'
            this.reg = passwordReg
            this.formData = null
            this.timer = 0 // clear id
            this.isSend = false // 是否发送过手机验证码，60s之内不能发送
            this.$codeBtn = this.loginWarp.find('.code-btn')
            this.$codeText = this.$codeBtn.html()
            this.weChartInfo = null
            this.hasAccount = null // 账号是否注册过
        }

        init () {
            let self = this
            // 微信登录跳转
            if (window.location.href.indexOf('?huoxing24_not') !== -1) {
                this.getWeChatInfo(getQueryString('huoxing24_not'), 'bind')
            } else if (window.location.href.indexOf('?huoxing24') !== -1) {
                this.getWeChatInfo(getQueryString('huoxing24'))
            }
            // 登录
            $('.show-login').on('click', function () {
                showLogin('login', '账号密码登录', '登录')
                self.clearForm()
                self.type = 'login'
            })

            // 注册
            $('.show-register').on('click', function () {
                self.getImgCode(self.loginWarp.find('.img-code-box img'))
                showLogin('register', '注册火星财经', '注册')
                self.type = 'register'
                self.clearForm()
                self.resType = 1
            })
            // 清除错误提示
            this.loginWarp.find('.error').empty()
            // 微信登录
            this.loginWarp.find('.other-ways .wechart').on('click', function () {
                let weUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=wxd2560ca609e45df6&redirect_uri=http%3A%2F%2Fwww%2Ehuoxing24%2Ecom%2Fpassport%2Faccount%2Fweixinweblogin%3FappType%3Dpc%26platform%3Dpc%26requestSource%3Dhuoxing24_pc&response_type=code&scope=snsapi_login&state=123`
                // let weUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=wxd2560ca609e45df6&redirect_uri=http%3A%2F%2Fwww%2Ehuoxing24%2Ecom%2Fpassport%2Faccount%2Fweixinweblogin%3FappType%3Dpc%26platform%3Dpc%26requestSource%3Dhuoxing24_pc_test&response_type=code&scope=snsapi_login&state=123`
                $('#weChatBox').attr('src', weUrl)
                showLogin('weChat', '微信登录')
                self.type = 'weChat'
            })
            // 短信登录
            this.loginWarp.find('.other-ways .message').on('click', function () {
                self.getImgCode(self.loginWarp.find('.img-code-box img'))
                showLogin('message', '短信登录', '确定')
                self.type = 'message'
                self.resType = 3
                self.clearForm()
            })
            // 账号登录
            this.loginWarp.find('.other-ways .account').on('click', function () {
                showLogin('login', '账号密码登录', '登录')
                self.type = 'login'
                self.clearForm()
            })
            // 关闭
            this.loginWarp.find('.close').on('click', function () {
                self.close()
            })

            // 忘记密码
            this.loginWarp.find('.to-forget').on('click', function () {
                self.getImgCode(self.loginWarp.find('.img-code-box img'))
                showLogin('forget', '找回密码', '确定')
                self.type = 'forget'
                self.clearForm()
                self.resType = 2
            })

            // 注册
            this.loginWarp.find('.to-res').on('click', function () {
                self.getImgCode(self.loginWarp.find('.img-code-box img'))
                showLogin('register', '注册火星财经', '注册')
                self.type = 'register'
                self.clearForm()
                self.resType = 1
            })

            // 账号登录
            this.loginWarp.find('.res-tip').on('click', function () {
                showLogin('login', '账号密码登录', '登录')
                self.clearForm()
                self.type = 'login'
            })

            // 清除
            this.formItem.find('input').on('keyup', function (e) {
                let $clear = $(this).siblings('.iconfont-close')
                let val = e.target.value
                if (!val) {
                    $clear.css({'display': 'none'})
                } else {
                    $clear.css({'display': 'block'})
                }
            })

            this.formItem.find('.form-item-cont .iconfont-close').on('click', function () {
                $(this).siblings('input').val('')
                $(this).css({'display': 'none'})
                $(this).closest('.form-item').find('.error').empty()
                let currName = $(this).siblings('input').attr('name')
                self.formData = {
                    ...self.formData,
                    [currName]: ''
                }
            })

            // input change校验
            this.formItem.find('input').on('change', function () {
                let currName = $(this).data('name')
                let val = $(this).val()
                let $error = $(this).closest('.form-item').find('.error')
                self.formData = {
                    ...self.formData,
                    [currName]: val
                }
                if (currName === 'phone') {
                    if (!isPoneAvailable(val)) {
                        $error.html('请输入有效的手机号')
                    } else {
                        $error.empty()
                    }
                } else if (currName === 'pwd') {
                    if (self.type === 'login') {
                        if (!val) {
                            $error.html('请输入密码')
                        } else {
                            $error.empty()
                        }
                    } else {
                        if (!val.match(self.reg)) {
                            $error.html('密码长度6~16位，且同时包含字母和数字')
                        } else {
                            $error.empty()
                        }
                    }
                } else if (currName === 'imgCode') {
                    if (!val) {
                        $error.html('请输入图形验证码')
                    } else {
                        $error.empty()
                    }
                } else if (currName === 'textCode') {
                    if (!val) {
                        $error.html('请输入手机验证码')
                    } else {
                        $error.empty()
                    }
                }
            })

            // 刷新验证码
            this.loginWarp.find('.img-code-box').on('click', function () {
                self.getImgCode($(this).find('img'))
            })

            // 发送验证码
            this.loginWarp.find('.code-btn').on('click', function () {
                if (self.isSend) {
                    return
                }
                self.setPhoneCode()
            })

            // 提交
            this.loginWarp.find('.form-submit').on('click', function () {
                self.submitForm()
            })
        }

        close () {
            this.loginWarp.css({'display': 'none'})
            this.clearForm()
        }

        // 获取验证码
        getImgCode ($img) {
            $img.attr('src', `/passport/account/getGraphCode?rnd=${Math.random()}`)
            // axiosAjax({
            //     type: 'POST',
            //     url: `${proxyUrl}/passport/account/getGraphCode`,
            //     params: {},
            //     fn: function () {
            //         $img.attr('src', `/passport/account/getGraphCode?rnd=${Math.random()}`)
            //     }
            // })
        }

        // 发送验证码
        setPhoneCode () {
            let self = this
            if (!this.formData) {
                layer.msg('请先输入手机号码和图形验证码')
                this.loginWarp.find('.form-item.phone .error').html('请输入手机号码')
                this.loginWarp.find('.form-item.img-code .error').html('请输入图形验证码')
                return
            }
            let phoneNumber = !this.formData.phone ? '' : this.formData.phone
            let codeVal = !this.formData.imgCode ? '' : this.formData.imgCode
            if (!isPoneAvailable(phoneNumber) || !codeVal) {
                if (!isPoneAvailable(phoneNumber)) {
                    layer.msg('请先输入有效的手机号码')
                    this.loginWarp.find('.form-item.phone .error').html('请输入有效的手机号')
                }

                if (!codeVal) {
                    layer.msg('请先输入图形验证码')
                    this.loginWarp.find('.form-item.img-code .error').html('请输入图形验证码')
                }
                return
            }
            // let codeType = verifcategory
            // 判断号码是否注册过
            if (this.type === 'bind') {
                this.isRegister(phoneNumber, (res) => {
                    if (res.code === 1) {
                        // 已注册
                        this.resType = 3
                    } else if (res.code === -1) {
                        // 未注册
                        this.resType = 1
                    }
                    self.isSend = true
                    self.loginWarp.find('.code-btn').addClass('disabled')
                    let param = {
                        'phonenum': phoneNumber,
                        'countrycode': '86',
                        'verifcategory': this.resType,
                        'graphcode': codeVal
                    }
                    let paramStr = fomartQuery(param)
                    axiosAjax({
                        type: 'post',
                        url: `${proxyUrl}/passport/account/getverifcode?${paramStr}`,
                        formData: false,
                        params: {},
                        fn: function (res) {
                            if (res.code === 1) {
                                let times = 60
                                self.timer = setInterval(function () {
                                    if (times > 0) {
                                        times--
                                        self.$codeBtn.html(`${times}S`)
                                    } else {
                                        self.isSend = false
                                        self.loginWarp.find('.code-btn').removeClass('disabled')
                                        clearInterval(self.timer)
                                        self.$codeBtn.html(self.$codeText)
                                    }
                                }, 1000)
                            } else {
                                layer.msg(res.msg)
                                self.isSend = false
                                self.loginWarp.find('.code-btn').removeClass('disabled')
                            }
                        }
                    })
                })
            } else {
                self.isSend = true
                self.loginWarp.find('.code-btn').addClass('disabled')
                let param = {
                    'phonenum': phoneNumber,
                    'countrycode': '86',
                    'verifcategory': this.resType,
                    'graphcode': codeVal
                }
                let paramStr = fomartQuery(param)
                axiosAjax({
                    type: 'post',
                    url: `${proxyUrl}/passport/account/getverifcode?${paramStr}`,
                    formData: false,
                    params: {},
                    fn: function (res) {
                        if (res.code === 1) {
                            let times = 60
                            self.timer = setInterval(function () {
                                if (times > 0) {
                                    times--
                                    self.$codeBtn.html(`${times}S`)
                                } else {
                                    self.isSend = false
                                    self.loginWarp.find('.code-btn').removeClass('disabled')
                                    clearInterval(self.timer)
                                    self.$codeBtn.html(self.$codeText)
                                }
                            }, 1000)
                        } else {
                            layer.msg(res.msg)
                            self.isSend = false
                            self.loginWarp.find('.code-btn').removeClass('disabled')
                        }
                    }
                })
            }
        }

        // 清除input值和相关验证
        clearForm () {
            let self = this
            this.isSend = false
            clearInterval(this.timer)
            self.loginWarp.find('.code-btn').removeClass('disabled')
            this.$codeBtn.html(this.$codeText)
            this.formItem.each(function () {
                // let currName = $(this).find('input').attr('name')
                $(this).find('input').val('')
                $(this).find('.iconfont-close').css({'display': 'none'})
                $(this).find('.error').empty()
                self.formData = null
            })
        }

        // 获取微信用户信息
        getWeChatInfo (key, type) {
            let self = this
            let sendData = {
                accountKey: key
            }
            axiosAjax({
                type: 'post',
                url: `${proxyUrl}/passport/account/getaccountinfo?${fomartQuery(sendData)}`,
                params: {},
                fn: (res) => {
                    if (res.code === 1) {
                        let resObj = JSON.parse(res.obj)
                        self.weChartInfo = {
                            nickName: resObj.nickName,
                            weixinName: resObj.weixinName,
                            iconUrl: resObj.iconUrl,
                            unionid: resObj.unionid
                        }
                        resObj = {...resObj}
                        if (type === 'bind') {
                            // 绑定手机号码
                            showLogin('bind', '关联手机号')
                            self.resType = 1
                            self.clearForm()
                            self.type = 'bind'
                        } else {
                            self.loginSub({...res, obj: resObj})
                            window.location.href = '/'
                        }
                    }
                }
            })
        }

        // 确定登录
        submitForm () {
            let lastUrl = '/v2/login'
            let callBack = null
            // let self = this
            let hasError = false
            // let $phone = this.formItem.find('input[name=phone]')
            // let $pwd = this.formItem.find('input[name=pwd]')
            // let $imgCode = this.formItem.find('input[name=imgCode]')
            // let $textCode = this.formItem.find('input[name=textCode]')
            let $phone = this.formItem.filter('.phone').find('input')
            let $pwd = this.formItem.filter('.password').find('input')
            let $imgCode = this.formItem.filter('.img-code').find('input')
            let $textCode = this.formItem.filter('.phone-code').find('input')
            let sendData = {platForm: 'pc'}
            if (!isPoneAvailable($phone.val())) {
                $phone.closest('.form-item').find('.error').html('请输入有效的手机号')
            } else {
                $phone.closest('.form-item').find('.error').empty()
                sendData = {
                    ...sendData,
                    phonenum: $phone.val()
                }

                callBack = (res) => {
                    let resObj = res.obj
                    resObj = {...resObj, phoneNumber: $phone.val()}
                    this.loginSub({...res, obj: resObj})
                }
            }
            if (this.type === 'login') {
                // 登录
                lastUrl = '/v2/login'
                if (!$pwd.val()) {
                    $pwd.closest('.form-item').find('.error').html('请输入密码')
                } else {
                    $pwd.closest('.form-item').find('.error').empty()
                    sendData = {
                        ...sendData,
                        password: encrypt($pwd.val())
                    }
                }
                if (!isPoneAvailable($phone.val()) || !$pwd.val()) {
                    hasError = true
                } else {
                    hasError = false
                }
            } else {
                if (!$imgCode.val()) {
                    $imgCode.closest('.form-item').find('.error').html('请输入图形验证码')
                } else {
                    $imgCode.closest('.form-item').find('.error').empty()
                }
                if (!$textCode.val()) {
                    $textCode.closest('.form-item').find('.error').html('请输入手机验证码')
                } else {
                    $textCode.closest('.form-item').find('.error').empty()
                }

                if (!isPoneAvailable($phone.val()) || !$imgCode.val() || !$textCode.val()) {
                    hasError = true
                } else {
                    hasError = false
                }

                if (this.type === 'bind') {
                    // 绑定账号
                    callBack = (res) => {
                        if (res.code === 1) {
                            let resObj = res.obj
                            resObj = {...resObj, phoneNumber: $phone.val()}
                            this.loginSub({...res, obj: resObj})
                            location.href = '/'
                        } else {
                            layer.msg(res.msg)
                        }
                    }
                    if (isPoneAvailable($phone.val())) {
                        if (!this.hasAccount) {
                            layer.msg('请输入验证码')
                        } else {
                            if (!this.hasAccount.isRegister) {
                                // 未注册过
                                lastUrl = '/weixinbindnew'
                                sendData = {
                                    ...sendData,
                                    verifcategory: this.resType,
                                    verifcode: $textCode.val(),
                                    unionid: this.weChartInfo.unionid,
                                    iconUrl: this.weChartInfo.iconUrl,
                                    nickName: this.weChartInfo.nickName
                                }
                            } else {
                                // 注册过
                                lastUrl = '/weixinbindold'
                                sendData = {
                                    ...sendData,
                                    verifycategory: this.resType,
                                    verifycode: $textCode.val(),
                                    unionid: this.weChartInfo.unionid,
                                    weixinName: this.weChartInfo.weixinName
                                }
                            }
                        }
                    }
                } else if (this.type === 'message') {
                    // 短信登录
                    lastUrl = '/login'
                    sendData = {
                        ...sendData,
                        verifycode: $textCode.val(),
                        verifycategory: this.resType
                    }
                } else {
                    // 注册和找回密码
                    sendData = {
                        ...sendData,
                        verifcode: $textCode.val()
                    }
                    if (!$pwd.val().match(this.reg)) {
                        $pwd.closest('.form-item').find('.error').html('密码最小长度8位， 必须是字母数字特殊符合!@#$%^&*三种组合')
                    } else {
                        $pwd.closest('.form-item').find('.error').empty()
                        sendData = {
                            ...sendData,
                            password: encrypt($pwd.val())
                        }
                    }

                    if (!isPoneAvailable($phone.val()) || !$imgCode.val() || !$textCode.val() || !$pwd.val().match(this.reg)) {
                        hasError = true
                    } else {
                        hasError = false
                    }
                    sendData = {
                        ...sendData,
                        verifcategory: this.resType
                    }
                    callBack = () => {
                        this.sendLogin('/v2/login', {
                            'phonenum': sendData.phonenum,
                            'password': sendData.password
                        }, (res) => {
                            if (res.code === 1) {
                                let resObj = res.obj
                                resObj = {...resObj, phoneNumber: sendData.phonenum}
                                this.loginSub({...res, obj: resObj})
                            } else {
                                layer.msg(res.msg)
                            }
                        })
                    }
                    if (this.type === 'register') {
                        // 注册
                        lastUrl = '/v2/register'
                    } else {
                        // 找回密码
                        lastUrl = '/v2/getbackuserpw'
                    }
                }
            }
            if (!hasError) {
                // 校验通过
                if (this.type === 'bind') {
                    if (this.hasAccount.phone !== $phone.val()) {
                        layer.msg('验证码错误')
                        this.isSend = false
                        this.loginWarp.find('.code-btn').removeClass('disabled')
                        clearInterval(this.timer)
                        this.$codeBtn.html(this.$codeText)
                        return
                    }
                }
                this.sendLogin(lastUrl, sendData, (res) => {
                    if (res.code === 1) {
                        callBack(res)
                    } else {
                        layer.msg(res.msg)
                    }
                })
            }
        }

        sendLogin (urlLastStr, sendData, fun) {
            // urlLastStr = '/register' // 注册
            // urlLastStr = '/getbackuserpw' // 找回密码
            // urlLastStr  = '/login' // 登录
            // urlLastStr  = '/weixinbindnew' // 绑定号码
            let url = `${proxyUrl}/passport/account${urlLastStr}`
            axiosAjax({
                type: 'post',
                url: url,
                params: sendData,
                formData: true,
                contentType: 'application/x-www-form-urlencoded',
                fn: function (resData) {
                    console.log(resData)
                    if (fun) {
                        fun(resData)
                    }
                }
            })
        }

        // 登录后cookie
        loginSub (res) {
            let self = this
            $('iframe').attr('src', res.obj.bbsLogin)
            Cookies.set('hx_user_realAuth', res.obj.realAuth, {expires: 7})
            Cookies.set('hx_user_intro', !res.obj.introduce ? '' : res.obj.introduce, {expires: 7})
            Cookies.set('hx_user_token', res.obj.token, {expires: 7})
            Cookies.set('hx_user_id', res.obj.passportId, {expires: 7})
            Cookies.set('hx_user_nickname', res.obj.nickName, {expires: 7})
            Cookies.set('hx_user_url', res.obj.iconUrl, {expires: 7})
            Cookies.set('hx_user_phone', res.obj.phoneNumber === undefined ? res.obj.phoneNum : res.obj.phoneNumber, {expires: 7})
            Cookies.set('hx_user_createtime', res.obj.createTime, {expires: 7})
            isLogin(true, res.obj.nickName)
            // 关闭弹窗
            self.close()

            if (getQueryString('bbs')) {
                // window.location.href = getQueryString('bbs')
                window.open(getQueryString('bbs'), '_blank')
            }
            if (window.location.href.indexOf('/newsdetail') !== -1) {
                // 评论
                // let newsId = getNewsId()
                let newsId = $('.news-detail').data('info').id
                let reply = new Reply($('#replyBox'), newsId)
                reply.init()
            }

            if (window.location.href.indexOf('/newsdetail') !== -1 || window.location.href.indexOf('/newsauthor') !== -1) {
                // 作者信息
                let passportId = ''
                if (window.location.href.indexOf('/newsdetail') !== -1) {
                    let newsDataInfo = $('.news-detail').data('info')
                    passportId = newsDataInfo.createdBy
                } else {
                    // passportId = getQueryString('userId')
                    passportId = $('#newsListContent').data('id')
                }
                axiosAjax({
                    type: 'get',
                    url: `${proxyUrl}/info/news/getauthorinfo?${fomartQuery({
                        passportId: passportId,
                        myPassportId: res.obj.passportId
                    })}`,
                    formData: false,
                    params: {},
                    fn: function (res) {
                        if (res.code === 1) {
                            let author = new NewsAuthor(res.obj)
                            if (window.location.href.indexOf('/newsdetail') !== -1) {
                                author.init($('.authorinfo'), 'right')
                                author.init($('.authorinfo-bottom'), 'bottom')
                            } else {
                                author.init($('.news-author'), 'right')
                            }
                        }
                    }
                })
            }

            // 直播
            if (window.location.href.indexOf('/liveDetail') !== -1) {
                if ($('.live-state').hasClass('state2')) {
                    return
                }
                $('.prompt-not-login').css({'display': 'none'})
                $('.prompt-has-login').css({'display': 'block'})
                $('.prompt-has-login').children('img').attr('src', Cookies.get('hx_user_url'))
            }
        }

        // 手机号码是否注册过
        isRegister (phone, fun) {
            let self = this
            let paramStr = fomartQuery({phonenum: phone})
            let url = `${proxyUrl}/passport/account/ifregister?${paramStr}`
            axiosAjax({
                type: 'post',
                url: url,
                formData: false,
                params: {},
                fn: function (res) {
                    if (res.code === 1) {
                        // 已注册
                        self.hasAccount = {
                            phone: phone,
                            isRegister: true
                        }
                    } else if (res.code === -1) {
                        // 未注册
                        self.hasAccount = {
                            phone: phone,
                            isRegister: false
                        }
                    }
                    if (fun) {
                        fun(res)
                    }
                }
            })
        }
    }

    new Login().init()

    // let verifcategory = '1' // 1注册， 2找回密码

    /* $('.show-register').on('click', function () {
        verifcategory = '1'
        showLogin('register', '注册')
    })

    $('.forget-password').on('click', function () {
        verifcategory = '2'
        showLogin('retrievePassword', '找回密码')
    }) */
    // 注销
    $('#loginOut').on('click', function () {
        loginOut()
        $('#loginSucceed').hide()
    })

    function loginOut () {
        axiosAjax({
            type: 'get',
            url: `${proxyUrl}/passport/account/logout`,
            formData: false,
            params: {passportid: Cookies.get('hx_user_id')},
            fn: function (res) {
                if (res.code === 1) {
                    Cookies.remove('hx_user_token')
                    Cookies.remove('hx_user_id')
                    Cookies.remove('hx_user_nickname')
                    Cookies.remove('hx_user_url')
                    Cookies.remove('hx_user_phone')
                    Cookies.remove('hx_user_realAuth')
                    Cookies.remove('hx_user_createTime')
                    isLogin(false)
                    $('iframe').attr('src', res.obj)
                    if (getQueryString('bbs')) {
                        window.open(getQueryString('bbs'), '_blank')
                        // window.location.href = getQueryString('bbs')
                    }
                    if (window.location.href.indexOf('/newsdetail') !== -1) {
                        // 评论
                        let newsId = $('.news-detail').data('info').id
                        let reply = new Reply($('#replyBox'), newsId)
                        reply.init()
                    }

                    if (window.location.href.indexOf('/newsdetail') !== -1 || window.location.href.indexOf('/newsauthor') !== -1) {
                        // 作者信息
                        let passportId = ''
                        if (window.location.href.indexOf('/newsdetail') !== -1) {
                            let newsDataInfo = $('.news-detail').data('info')
                            passportId = newsDataInfo.createdBy
                        } else {
                            // passportId = getQueryString('userId')
                            passportId = $('#newsListContent').data('id')
                        }
                        axiosAjax({
                            type: 'get',
                            url: `${proxyUrl}/info/news/getauthorinfo?${fomartQuery({
                                passportId: passportId
                            })}`,
                            formData: false,
                            params: {},
                            fn: function (res) {
                                if (res.code === 1) {
                                    let author = new NewsAuthor(res.obj)
                                    if (window.location.href.indexOf('/newsdetail') !== -1) {
                                        author.init($('.authorinfo'), 'right')
                                        author.init($('.authorinfo-bottom'), 'bottom')
                                    } else {
                                        author.init($('.news-author'), 'right')
                                    }
                                    // let bottom = new newsAuthor($('.authorinfo-bottom'), res.obj, 'bottom')
                                    // bottom.init()
                                }
                            }
                        })
                    }

                    // 直播
                    if (window.location.href.indexOf('/liveDetail') !== -1) {
                        if ($('.live-state').hasClass('state2')) {
                            return
                        }
                        $('.prompt-not-login').css({'display': 'block'})
                        $('.prompt-has-login').css({'display': 'none'})
                    }
                }
            }
        })
    }

    // $('#loginBlock .login-close').on('click', function () {
    //     showLogin('close')
    // })

    // 获取微信二维码
    /* let weChatEWM = 'https://open.weixin.qq.com/connect/qrconnect?appid=wxd2560ca609e45df6&redirect_uri=http%3a%2f%2fwww.huoxing24.com%2fpassport%2faccount%2fweixinweblogin%3fappType=pc%26platform=pc%26requestSource=huoxing24_pc&response_type=code&scope=snsapi_login&state=123'
    $('.weChat-login').on('click', function () {
        $('.weChat-iframe').show()
        $('#weChatPc').attr('src', weChatEWM)
        $('#loginBlock').show()
        $('.login-con-main, .login-con').hide()
    })
    $('.weChat-iframe .login-close').on('click', function () {
        $('.weChat-iframe, #loginBlock').hide()
        $('.login-con-main, .login-con').show()
    }) */
    // 获取微信信息
    // let WechatUnionid = ''
    // let WechatIconUrl = ''
    /* let getWeChatCode = (key) => {
        let sendData = {
            accountKey: key
        }
        axiosAjax({
            type: 'post',
            url: `${proxyUrl}/passport/account/getaccountinfo?${fomartQuery(sendData)}`,
            params: {},
            fn: (res) => {
                if (res.code === 1) {
                    let resObj = JSON.parse(res.obj)
                    resObj = {...resObj}
                    if (resObj.phoneNum === undefined) {
                        $('#weChat-img').show()
                        $('#weChat-img img').attr('src', resObj.iconUrl)
                        $('.weChat-name').val(resObj.nickName)
                        $('.login-tips a.show-login').html('立即绑定')
                        WechatUnionid = resObj.unionid
                        WechatIconUrl = resObj.iconUrl
                        return false
                    } else {
                        loginSub({...res, obj: resObj})
                    }
                } else if (res.code === -1) {
                    window.location.reload()
                    window.location.href = '/'
                }
            }
        })
    } */
    // if (window.location.href.indexOf('huoxing24_not') !== -1) {
    //     $('#registerModal h1').hide()
    //     $('#loginBlock, #registerModal, .weChat-list').show()
    //     getWeChatCode(getQueryString('huoxing24_not'))
    // } else if (window.location.href.indexOf('?huoxing24') !== -1) {
    //     getWeChatCode(getQueryString('huoxing24'))
    // }

    /* function showLogin (type, title) {
     if (type === 'close') {
     $('#loginBlock').css({'display': 'none'})
     } else {
     $('#loginBlock').css({'display': 'block'})
     if (type === 'login') {
     $('#loginModal h1').html(title)
     $('#registerModal').css({'display': 'none'})
     $('#loginModal').css({'display': 'block'})
     } else {
     $('#registerModal h1').html(title)
     $('#registerModal').css({'display': 'block'})
     $('#loginModal').css({'display': 'none'})
     $('#registerModal button').html('注册')
     if (type === 'retrievePassword') {
     $('#registerModal button').html('找回密码')
     }
     }
     }
     } */
    // 获取验证吗
    /* $('#getCodeBtn').on('click', function () {
        etAuthCode()
        // $(this).css({'display': 'none'})
        // $('#waitTime').css({'display': 'block'})
    }) */

    /* $('#codeBtn').on('click', function () {
        setPhoneCode()
    })

    $('.refresh').on('click', function () {
        getImgBtn()
    })

    $('#verificationImg .close-img').on('click', function () {
        isShowImgModal(false)
    }) */

    /* function isShowImgModal (isShow) {
        if (!isShow) {
            $('.code-shade').removeClass('show')
            $('.verification-img').removeClass('show')
        } else {
            $('.code-shade').addClass('show')
            $('.verification-img').addClass('show')
        }
    } */

    /* function etAuthCode () {
        let thisModal = $('#registerModal')
        const phoneNumber = $.trim(thisModal.find('input[name="phone"]').val())
        let hasError = false
        let hasErrorEl = thisModal.find('.error-msg')
        let errorMsg = ''
        if (phoneNumber === '') {
            hasError = true
            errorMsg = '手机号不能为空'
        } else if (!isPoneAvailable(phoneNumber)) {
            hasError = true
            errorMsg = '请输入正确的手机号'
        } else {
            hasError = false
            errorMsg = ''
        }
        // param = `countrycode=86&&phonenum=${phoneNumber.toString()}&&verifcategory=${codeType}`
        if (hasError) {
            showErrorMsg(hasError, errorMsg, hasErrorEl)
            return
        }
        isShowImgModal(true)
        getImgBtn()
    }

    function setPhoneCode () {
        isShowImgModal(false)
        let thisModal = $('#registerModal')
        const phoneNumber = $.trim(thisModal.find('input[name="phone"]').val())
        let hasError = false
        let hasErrorEl = thisModal.find('.error-msg')
        let errorMsg = ''
        let param = null
        let codeType = verifcategory
        let codeVal = $('input.code-text').val()
        param = {
            'phonenum': phoneNumber,
            'countrycode': '86',
            'verifcategory': codeType,
            'graphcode': codeVal
        }
        let paramStr = fomartQuery(param)
        axiosAjax({
            type: 'post',
            url: `${proxyUrl}/passport/account/getverifcode?${paramStr}`,
            formData: false,
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    let times = 60
                    let waitTime = $('#waitTime')
                    $('#getCodeBtn').css({'display': 'none'})
                    waitTime.css({'display': 'block'})
                    let timer = setInterval(function () {
                        if (times > 0) {
                            times--
                            waitTime.html(`${times}S`)
                        } else {
                            $('#getCodeBtn').css({'display': 'block'})
                            waitTime.css({'display': 'none'})
                            clearInterval(timer)
                            waitTime.html(`${times}S`)
                        }
                    }, 1000)
                } else {
                    hasError = true
                    errorMsg = res.msg
                    showErrorMsg(hasError, errorMsg, hasErrorEl)
                }
            }
        })
    } */

    /* // 登录提交
    $('#loginModal button').on('click', function (e) {
        signinSubmit(e, 'login')
    })

    // 注册提交
    $('#registerModal button').on('click', function (e) {
        let type = 'register'
        if (verifcategory === '2') {
            type = 'retrievePassword'
        }
        signinSubmit(e, type)
    })

    function showErrorMsg (hasError, msg, el) {
        el.html(msg)
        if (!hasError) {
            el.removeClass('show')
        } else {
            el.addClass('show')
        }
    }

    function loginSub (res) {
        $('iframe').attr('src', res.obj.bbsLogin)
        Cookies.set('hx_user_realAuth', res.obj.realAuth, {expires: 7})
        Cookies.set('hx_user_intro', !res.obj.introduce ? '' : res.obj.introduce, {expires: 7})
        Cookies.set('hx_user_token', res.obj.token, {expires: 7})
        Cookies.set('hx_user_id', res.obj.passportId, {expires: 7})
        Cookies.set('hx_user_nickname', res.obj.nickName, {expires: 7})
        Cookies.set('hx_user_url', res.obj.iconUrl, {expires: 7})
        Cookies.set('hx_user_phone', res.obj.phoneNumber === undefined ? res.obj.phoneNum : res.obj.phoneNumber, {expires: 7})
        Cookies.set('hx_user_createtime', res.obj.createTime, {expires: 7})
        isLogin(true, res.obj.nickName)
        showLogin('close')
        if (getQueryString('bbs')) {
            // window.location.href = getQueryString('bbs')
            window.open(getQueryString('bbs'), '_blank')
        }
        if (window.location.href.indexOf('/newsdetail') !== -1) {
            // 评论
            // let newsId = getNewsId()
            let newsId = $('.news-detail').data('info').id
            let reply = new Reply($('#replyBox'), newsId)
            reply.init()
        }

        if (window.location.href.indexOf('/newsdetail') !== -1 || window.location.href.indexOf('/newsauthor') !== -1) {
            // 作者信息
            let passportId = ''
            if (window.location.href.indexOf('/newsdetail') !== -1) {
                let newsDataInfo = $('.news-detail').data('info')
                passportId = newsDataInfo.createdBy
            } else {
                // passportId = getQueryString('userId')
                passportId = $('#newsListContent').data('id')
            }
            axiosAjax({
                type: 'get',
                url: `${proxyUrl}/info/news/getauthorinfo?${fomartQuery({
                    passportId: passportId,
                    myPassportId: res.obj.passportId
                })}`,
                formData: false,
                params: {},
                fn: function (res) {
                    if (res.code === 1) {
                        let author = new NewsAuthor(res.obj)
                        if (window.location.href.indexOf('/newsdetail') !== -1) {
                            author.init($('.authorinfo'), 'right')
                            author.init($('.authorinfo-bottom'), 'bottom')
                        } else {
                            author.init($('.news-author'), 'right')
                        }
                    }
                }
            })
        }

        // 直播
        if (window.location.href.indexOf('/liveDetail') !== -1) {
            if ($('.live-state').hasClass('state2')) {
                return
            }
            $('.prompt-not-login').css({'display': 'none'})
            $('.prompt-has-login').css({'display': 'block'})
        }
    }

    function signinSubmit (event, type) {
        const eType = event.type.toLowerCase()
        const eCode = parseInt(event.keyCode)
        if ((eType === 'keydown' && eCode === 13) || eType === 'click') {
            let thisModal = $('#loginModal')
            // phone code pwd repwd
            const phoneNumber = $.trim(thisModal.find('input[name="phone"]').val())
            const password = $.trim(thisModal.find('input[name="pwd"]').val())
            let hasError = false
            let hasErrorEl = thisModal.find('.login-error-msg')
            let errorMsg = ''
            let urlLastStr = ''
            let sendData = null
            let fun = null
            let weData = null
            // let loginSub = null
            if (type === 'login') {
                if (phoneNumber === '') {
                    hasError = true
                    errorMsg = '手机号不能为空'
                } else if (!isPoneAvailable(phoneNumber)) {
                    hasError = true
                    errorMsg = '请输入正确的手机号'
                } else if (password === '') {
                    hasError = true
                    errorMsg = '密码不能为空'
                } else {
                    if (window.location.href.indexOf('huoxing24_not') !== -1) {
                        let boundData = {
                            unionid: WechatUnionid,
                            phonenum: phoneNumber,
                            password: password,
                            platForm: 'pc'
                        }
                        boundWeChat(boundData, (res) => {
                            if (res.code !== 1) {
                                if (res.code === -1) {
                                    window.location.reload()
                                    window.location.href = '/'
                                    return false
                                }
                                layer.msg(res.msg)
                            } else {
                                let resObj = res.obj
                                $('#loginBlock, #loginModal').hide()
                                loginSub({...res, obj: resObj})
                            }
                        })
                    } else {
                        hasError = false
                        errorMsg = ''
                        urlLastStr = '/login'
                        sendData = {'phonenum': phoneNumber, 'password': password, 'platform': 'pc'}
                        fun = (res) => {
                            let resObj = res.obj
                            resObj = {...resObj, phoneNumber: phoneNumber}
                            loginSub({...res, obj: resObj})
                        }
                    }
                }
            } else {
                // 注册
                thisModal = $('#registerModal')
                hasErrorEl = thisModal.find('.error-msg')
                const phoneNumber = $.trim(thisModal.find('input[name="phone"]').val())
                const password = $.trim(thisModal.find('input[name="pwd"]').val())
                const authCode = $.trim(thisModal.find('input[name="code"]').val())
                const rePassword = $.trim(thisModal.find('input[name="repwd"]').val())
                const weChatName = $.trim($('.weChat-name').val())
                const err = '密码必须为6至16位的字母、数字组合'
                const reg = /^[a-zA-Z0-9]{6,16}$/
                if (phoneNumber === '') {
                    hasError = true
                    errorMsg = '手机号不能为空'
                } else if (!isPoneAvailable(phoneNumber)) {
                    hasError = true
                    errorMsg = '请输入正确的手机号'
                } else if (authCode === '') {
                    hasError = true
                    errorMsg = '验证码不能为空'
                } else if (password === '') {
                    hasError = true
                    errorMsg = '密码不能为空'
                } else if (!reg.test(password)) {
                    hasError = true
                    errorMsg = err
                } else if (rePassword === '') {
                    hasError = true
                    errorMsg = '请确认密码'
                } else if (password !== rePassword) {
                    hasError = true
                    errorMsg = '密码输入不一致，请重新输入'
                } else {
                    hasError = false
                    errorMsg = ''
                    urlLastStr = '/register' // 注册
                    sendData = {
                        'phonenum': phoneNumber,
                        'password': password,
                        'verifcode': authCode,
                        'verifcategory': '1'
                    }
                    weData = {
                        'unionid': WechatUnionid,
                        'phonenum': phoneNumber,
                        'password': password,
                        'iconUrl': WechatIconUrl,
                        'verifcode': authCode,
                        'nickName': weChatName,
                        'platform': 'pc'
                    }
                    if (type === 'retrievePassword') {
                        urlLastStr = '/getbackuserpw' // 找回密码
                        sendData = {
                            ...sendData,
                            'verifcategory': '2'
                        }
                    }

                    fun = () => {
                        if (window.location.href.indexOf('huoxing24_not') !== -1) {
                            return false
                        } else {
                            loginFunc('/login', {'phonenum': phoneNumber, 'password': password}, (res) => {
                                if (res.code === 1) {
                                    hasError = false
                                    errorMsg = ''
                                    // loginSub(res)
                                    let resObj = res.obj
                                    resObj = {...resObj, phoneNumber: phoneNumber}
                                    loginSub({...res, obj: resObj})
                                } else {
                                    hasError = true
                                    errorMsg = res.msg
                                }
                                showErrorMsg(hasError, errorMsg, hasErrorEl)
                            })
                        }
                    }
                }
            }

            if (!hasError) {
                if (window.location.href.indexOf('huoxing24_not') !== -1) {
                    if (weData.nickName === '') {
                        layer.msg('昵称不能为空!')
                        return false
                    }
                    loginWeChat(weData, (res) => {
                        if (res.code !== 1) {
                            if (res.code === -1) {
                                window.location.reload()
                                window.location.href = '/'
                                return false
                            }
                            layer.msg(res.msg)
                        } else {
                            let resObj = res.obj
                            $('#loginBlock, #registerModal').hide()
                            loginSub({...res, obj: resObj})
                        }
                    })
                } else {
                    loginFunc(urlLastStr, sendData, (res) => {
                        if (res.code === 1) {
                            hasError = false
                            errorMsg = ''
                            fun(res)
                        } else {
                            hasError = true
                            errorMsg = res.msg
                        }
                        showErrorMsg(hasError, errorMsg, hasErrorEl)
                    })
                }
            } else {
                showErrorMsg(hasError, errorMsg, hasErrorEl)
            }
        }
    }

    function loginFunc (urlLastStr, sendData, fun) {
        // '/passport/account/login', '/passport/account/register', '/passport/account/retrievePassword'
        let paramStr = fomartQuery(sendData)
        let url = `${proxyUrl}/passport/account${urlLastStr}?${paramStr}`
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

    // 微信注册登录
    function loginWeChat (weChatData, fun) {
        let url = `${proxyUrl}/passport/account/weixinbindnew?${fomartQuery(weChatData)}`
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

    // 已有账号绑定
    function boundWeChat (boundData, fun) {
        let url = `${proxyUrl}/passport/account/weixinbindold?${fomartQuery(boundData)}`
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
    } */

    // 投稿
    let getContribute = () => {
        axiosAjax({
            type: 'get',
            url: `${proxyUrl}/passport/account/contribute`,
            formData: false,
            params: {
                passportId: Cookies.get('hx_user_id'),
                token: Cookies.get('hx_user_token')
            },
            fn: function (resData) {
                if (resData.code === -1) {
                    showLogin('login', '账号密码登录', '登录')
                } else if (resData.code === -4) {
                    layer.msg('身份认证已过期，请重新登陆再试')
                } else if (resData.code === -5) {
                    layer.msg('用户还没有进行实名认证，请先实名认证')
                    setTimeout(function () {
                        window.location.href = '/userCertification'
                    }, 500)
                } else if (resData.code === 1) {
                    window.location.href = '/edit'
                }
            }
        })
    }
    $('.contribute').on('click', function () {
        getContribute()
    })
})
