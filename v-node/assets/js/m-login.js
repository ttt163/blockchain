/**
 * Author：yangbo
 * Time：2018-04-08 15:46
 * Description：Description
 */
import Cookies from 'js-cookie'
import {
    pageLoadingHide,
    isPoneAvailable,
    axiosAjax,
    proxyUrl,
    isWeixin,
    setCookies,
    getQueryString,
    fomartQuery,
    isAndroid,
    rem,
    isPc
    // encrypt,
    // decrypt,
    // cryptoKey,
    // privateKey,
    // passwordReg
} from './public/public'
if (isPc()) {
    window.location.href = 'http://www.huoxing24.com'
}
let castId = Cookies.get('room')
// 生成全局唯一标识符
const generateUUID = () => {
    let d = new Date().getTime()
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
}
$(function () {
    pageLoadingHide()
    // 微信登录
    $('#wechatLogin').on('click', () => {
        if (isWeixin()) {
            window.location.href = 'http://www.huoxing24.com/passport/account/weixinauth2'
        } else {
            showAlert('移动端暂不支持微信登录，请使用绑定的手机进行登录。')
        }
    })
    // 获取微信用户信息
    let WechatUnionid = ''
    let WechatIconUrl = ''
    let WechatNickName = ''
    let getWeChatCode = (key) => {
        let sendData = {
            accountKey: key
        }
        axiosAjax({
            type: 'post',
            url: `${proxyUrl}/passport/account/getaccountinfo?${fomartQuery(sendData)}`,
            params: {},
            fn: (data) => {
                console.log(data)
                if (data.code === 1) {
                    let weChatData = JSON.parse(data.obj)
                    WechatUnionid = weChatData.unionid
                    WechatIconUrl = weChatData.iconUrl
                    WechatNickName = weChatData.nickName
                    $('.weChat-img img').attr('src', WechatIconUrl)
                    $('#nickname').val(WechatNickName)
                } else if (data.code === -1) {
                    // window.location.href = '/'
                }
            }
        })
    }
    if (window.location.href.indexOf('huoxing24_not') !== -1) {
        $('.m-register').addClass('show')
        $('.m-login').removeClass('show')
        getWeChatCode(getQueryString('huoxing24_not'))
    } else if (window.location.href.indexOf('?huoxing24') !== -1) {
        getWeChatCode(getQueryString('?huoxing24'))
        window.location.href = `/liveDetail/${castId}`
    }

    // if (getQueryString('?huoxing24') !== -1) {
    //     window.location.href = `/liveDetail?castId=${Cookies.get('room')}`
    // }

    // 关联账号
    $('#alreadyAccount').on('click', function () {
        $('.m-register').removeClass('show')
        $('.relevance').addClass('show')
    })
    const WechatRelevance = () => {
        let $relevancePhone = $('#relevancePhone').val()
        let $relevancePassw = $('#relevancePassw').val()
        if ($relevancePhone.trim() === '') {
            showAlert('手机号码不能为空')
            return false
        }
        if (!isPoneAvailable($relevancePhone)) {
            showAlert('手机号码有误')
            return false
        }
        if ($relevancePassw.trim() === '') {
            showAlert('密码不能为空！')
            return false
        }
        let sendData = {
            unionid: WechatUnionid,
            phonenum: $relevancePhone,
            password: $relevancePassw,
            platform: 'h5'
        }
        axiosAjax({
            type: 'post',
            url: `${proxyUrl}/passport/account/weixinbindold?${fomartQuery(sendData)}`,
            params: {},
            fn: (data) => {
                if (data.code !== 1) {
                    showAlert(data.msg)
                } else {
                    showAlert(data.msg)
                    setCookies(data.obj)
                    $('#iframe').attr('src', data.obj.bbsLogin)
                    setTimeout(function () {
                        window.location.href = `/liveDetail/${castId}`
                    }, 500)
                }
            }
        })
    }
    $('#relevanceBtn').on('click', function () {
        WechatRelevance()
    })
    // 微信注册
    let codeState = 1
    const registerFunc = () => {
        let $phoneInput = $('#registerPhone').val()
        let $password = $('#registerPassw').val()
        let $codeInput = $('#registerCode').val()
        let $password2 = $('#registerPassw2').val()
        let $nickname = $('#nickname').val()
        if ($phoneInput.trim() === '') {
            showAlert('手机号码不能为空')
            return false
        }
        if (!isPoneAvailable($phoneInput)) {
            showAlert('手机号码有误')
            return false
        }
        if ($codeInput.trim() === '') {
            showAlert('验证码不能为空')
            return false
        }
        if ($password.trim().length < 6) {
            showAlert('密码不能少于6位！')
            return false
        }
        if ($password2.trim().length < 6) {
            showAlert('密码不能少于6位！')
            return false
        }
        if ($password2 !== $password) {
            showAlert('两次输入密码不一致！')
            return false
        }
        // 成功请求
        if (window.location.href.indexOf('huoxing24_not') !== -1) {
            if ($nickname === '') {
                showAlert('用户昵称不能为空!')
                return false
            }
            let sendData = {
                unionid: WechatUnionid,
                phonenum: $phoneInput,
                password: $password2,
                iconUrl: WechatIconUrl,
                verifcode: $codeInput,
                nickName: $nickname,
                platform: 'h5'
            }
            axiosAjax({
                type: 'post',
                url: `${proxyUrl}/passport/account/weixinbindnew?${fomartQuery(sendData)}`,
                params: {},
                fn: (data) => {
                    if (data.code !== 1) {
                        showAlert(data.msg)
                    } else {
                        showAlert(data.msg)
                        setCookies(data.obj)
                        $('#iframe').attr('src', data.obj.bbsLogin)
                        setTimeout(function () {
                            window.location.href = `/liveDetail/${castId}`
                        }, 500)
                    }
                }
            })
        } else {
            axiosAjax({
                type: 'complexpost',
                url: proxyUrl + '/passport/account/register',
                params: {
                    verifcode: $codeInput,
                    password: $password2,
                    verifcategory: 1, // 验证码类别 1 注册 2 找回密码
                    phonenum: $phoneInput
                },
                fn: (data) => {
                    if (data.code !== 1) {
                        showAlert(data.msg)
                    } else {
                        showAlert('注册成功！')
                        setTimeout(function () {
                            // window.location.reload()
                            window.location.href = '/mLogin'
                        }, 500)
                    }
                }
            })
        }
    }
    const getImgCode = () => {
        $('#codeImg').html('').html(`<img src="${proxyUrl}/passport/account/getGraphCode?v=${generateUUID()}"/>`)
    }
    $('#modificationCodeBtn').on('click', function () {
        if ($('#modificationPhone').val() === '') {
            showAlert('手机号码不能为空')
            return false
        }
        if (!isPoneAvailable($('#modificationPhone').val())) {
            showAlert('手机号码有误')
            return false
        }
        $('.code-img, .shade').show()
        getImgCode()
    })
    $('#registerCodeBtn').on('click', function () {
        if ($('#registerPhone').val() === '') {
            showAlert('手机号码不能为空')
            return false
        }
        if (!isPoneAvailable($('#registerPhone').val())) {
            showAlert('手机号码有误')
            return false
        }
        $('.code-img, .shade').show()
        getImgCode()
    })
    $('#refreshImg').on('click', function () {
        getImgCode()
    })
    // 倒计时
    let wait = 60

    function codeTime (obj) {
        if (wait === 0) {
            obj.removeAttribute('disabled')
            obj.innerHTML = '获取验证码'
            wait = 60
        } else {
            obj.setAttribute('disabled', true)
            obj.innerHTML = `${wait}s`
            wait--
            setTimeout(function () {
                codeTime(obj)
            }, 1000)
        }
    }

    $('#codeImgBtn').on('click', function () {
        if ($('#codeText').val() === '') {
            showAlert('验证码不能为空')
            return false
        }
        $('.code-img, .shade').hide()
        getCode()
    })
    // 获取验证码
    const getCode = () => {
        let $modificationPhone = $('#modificationPhone').val()
        let $registerPhone = $('#registerPhone').val()
        axiosAjax({
            type: 'complexpost',
            url: proxyUrl + '/passport/account/getverifcode',
            params: {
                countrycode: 86,
                verifcategory: codeState, // 验证码类别 1 注册 2 找回密码
                phonenum: codeState === 1 ? $registerPhone : $modificationPhone,
                graphcode: $('#codeText').val()
            },
            fn: (data) => {
                if (data.code !== 1) {
                    showAlert(data.msg)
                } else {
                    if (codeState === 1) {
                        codeTime(document.getElementById('registerCodeBtn'))
                    } else {
                        codeTime(document.getElementById('modificationCodeBtn'))
                    }
                    showAlert('验证码已发送，请注意查收！')
                }
            }
        })
    }
    $('#registerBtn').on('click', function () {
        registerFunc()
    })

    // 登录
    const loginFunc = () => {
        let $phoneInput = $('#loginPhone').val()
        let $password = $('#loginPassw').val()
        if ($phoneInput.trim() === '') {
            showAlert('手机号码不能为空')
            return false
        }
        if (!isPoneAvailable($phoneInput)) {
            showAlert('手机号码有误')
            return false
        }
        if ($password.trim() === '') {
            showAlert('密码不能为空！')
            return false
        }
        // 成功请求
        axiosAjax({
            type: 'complexpost',
            url: proxyUrl + '/passport/account/login',
            params: {
                phonenum: $phoneInput,
                password: $password,
                platform: 'h5'
            },
            fn: (data) => {
                console.log(data)
                if (data.code !== 1) {
                    showAlert(data.msg)
                } else {
                    showAlert('登录成功')
                    setCookies(data.obj)
                    $('#iframe').attr('src', data.obj.bbsLogin)
                    setTimeout(function () {
                        window.location.href = `/liveDetail/${castId}`
                    }, 500)
                }
            }
        })
    }
    $('#loginBtn').on('click', function () {
        loginFunc()
    })
    // 新注册账号切换
    $('.new-register').on('click', function () {
        codeState = 1
        $('.m-login').removeClass('show')
        $('.m-register').addClass('show')
        $('.m-register ul li').eq(0).hide()
        $('.weChat-img').hide()
        $('#alreadyAccount').hide()
    })
    // 忘记密码
    $('.forget-passw').on('click', function () {
        codeState = 2
        $('.m-login').removeClass('show')
        $('.relevance').removeClass('show')
        $('.m-modification').addClass('show')
    })
    $('#modificationBtn').on('click', function () {
        let $phoneInput = $('#modificationPhone').val()
        let $codeInput = $('#modificationCode').val()
        let $verifcode = $('#modificationCode').val()
        let $password1 = $('#modificationPassw1').val()
        let $password2 = $('#modificationPassw2').val()
        if ($phoneInput.trim() === '') {
            showAlert('手机号码不能为空')
            return false
        }
        if (!isPoneAvailable($phoneInput)) {
            showAlert('手机号码有误')
            return false
        }
        if ($codeInput.trim() === '') {
            showAlert('验证码不能为空！')
            return false
        }
        if ($password1.trim().length < 6) {
            showAlert('新密码不能少于6位！')
            return false
        }
        if ($password2.trim().length < 6) {
            showAlert('新密码不能少于6位！')
            return false
        }
        if ($password1 !== $password2) {
            showAlert('两次输入密码不一致！')
            return false
        }
        // 成功请求
        axiosAjax({
            type: 'complexpost',
            url: proxyUrl + '/passport/account/getbackuserpw',
            params: {
                phonenum: $phoneInput,
                verifcode: $verifcode,
                password: $password2,
                verifcategory: 2
            },
            fn: (data) => {
                if (data.code !== 1) {
                    showAlert(data.msg)
                } else {
                    showAlert('修改成功！')
                    setTimeout(function () {
                        window.location.href = '/mLogin'
                    }, 500)
                }
            }
        })
    })

    // 微信注册键盘收缩
    if (isAndroid()) {
        if (window.location.href.indexOf('huoxing24_not') !== -1) {
            $('.m-register').css({position: 'initial', marginTop: rem(100), marginLeft: rem(60)})
            $('input').focus(function () {
                setTimeout(function () {
                    document.body.scrollTop = document.body.scrollHeight
                }, 300)
            })
        }
    }
})
