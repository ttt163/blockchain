/**
 * Author：zhoushuanglong
 * Time：2018-02-23 15:19
 * Description：login
 */

import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
// import {browserHistory} from 'react-router'
import Cookies from 'js-cookie'

import './index.scss'

import phoneNumber from './img/login-phone-number.png'
import authCode from './img/login-auth-code.png'
import password from './img/login-password.png'
import rePassword from './img/login-re-password.png'
import close from './img/login-close.png'
import down from './img/down.png'

import {isPoneAvailable, axiosAjax, getQueryString} from '../../../public/index'
import {setLoginInfo, hideLogin, showLogin} from '../../../actions/loginInfo'
import {APIPASSPORT} from '../../../constants/index'
import PhoneCode from './phone.code'

const mapStateToProps = (state) => {
    return {
        loginInfo: state.loginInfo,
        loginShow: state.loginShow
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({setLoginInfo, hideLogin, showLogin}, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Login extends Component {
    state = {
        times: 60,
        authCode: 'button', // 'times',
        msg: '',
        loginErrorMsg: '',
        hasError: false,
        loginHasError: false,
        iframeSrc: '',
        showRcode: false,
        showLcode: false,
        lCode: '86',
        rCode: '86'
    }

    loginSubmit = (event) => {
        const eType = event.type.toLowerCase()
        const eCode = parseInt(event.keyCode)
        if ((eType === 'keydown' && eCode === 13) || eType === 'click') {
            const loginPhoneNumber = $.trim(this.loginPhoneNumber.value)
            const loginPassword = $.trim(this.loginPassword.value)

            if (loginPhoneNumber === '') {
                this.setState({
                    loginHasError: true,
                    loginErrorMsg: '手机号不能为空'
                })
            } else if (isPoneAvailable(loginPhoneNumber) === false) {
                this.setState({
                    loginHasError: true,
                    loginErrorMsg: '请输入正确的手机号'
                })
            } else if (loginPassword === '') {
                this.setState({
                    loginHasError: true,
                    loginErrorMsg: '密码不能为空'
                })
            } else {
                this.setState({
                    loginHasError: false,
                    loginErrorMsg: ''
                })
                this.loginFunc(loginPhoneNumber, loginPassword)
            }
        }
    }

    signinSubmit = (event) => {
        const eType = event.type.toLowerCase()
        const eCode = parseInt(event.keyCode)
        if ((eType === 'keydown' && eCode === 13) || eType === 'click') {
            const phoneNumber = $.trim(this.phoneNumber.value)
            const authCode = $.trim(this.authCode.value)
            const password = $.trim(this.password.value)
            const rePassword = $.trim(this.rePassword.value)

            if (phoneNumber === '') {
                this.setState({
                    hasError: true,
                    msg: '手机号不能为空'
                })
            } else if (isPoneAvailable(phoneNumber) === false) {
                this.setState({
                    hasError: true,
                    msg: '请输入正确的手机号'
                })
            } else if (authCode === '') {
                this.setState({
                    hasError: true,
                    msg: '验证码不能为空'
                })
            } else if (password === '') {
                this.setState({
                    hasError: true,
                    msg: '密码不能为空'
                })
            } else if (password.length < 6 || password.length > 16) {

            } else if (rePassword === '') {
                this.setState({
                    hasError: true,
                    msg: '请确认密码'
                })
            } else if (password !== rePassword) {
                this.setState({
                    hasError: true,
                    msg: '密码输入不一致，请重新输入'
                })
            } else {
                this.setState({
                    hasError: false,
                    msg: ''
                })
                if (this.props.loginShow.type === 'signin') {
                    const param = `phonenum=${phoneNumber}&&password=${password}&&verifcode=${authCode}&&verifcategory=1`
                    axiosAjax('POST', APIPASSPORT + '/account/register?' + param, {}, (data) => {
                        if (data.code === 1) {
                            this.setState({
                                hasError: false,
                                msg: ''
                            })
                            this.loginFunc(phoneNumber, password)
                        } else {
                            this.setState({
                                hasError: true,
                                msg: data.msg
                            })
                        }
                    })
                } else if (this.props.loginShow.type === 'retrievePassword') {
                    const param = `phonenum=${phoneNumber}&&password=${password}&&verifcode=${authCode}&&verifcategory=2`
                    axiosAjax('POST', APIPASSPORT + '/account/getbackuserpw?' + param, {}, (data) => {
                        if (data.code === 1) {
                            this.setState({
                                hasError: false,
                                msg: ''
                            })
                            this.loginFunc(phoneNumber, password)
                        } else {
                            this.setState({
                                hasError: true,
                                msg: data.msg
                            })
                        }
                    })
                }
            }
        }
    }

    getAuthCode = () => {
        const This = this
        const phoneNumber = $.trim(this.phoneNumber.value)
        if (phoneNumber === '') {
            this.setState({
                hasError: true,
                msg: '手机号不能为空'
            })
        } else if (isPoneAvailable(phoneNumber) === false) {
            this.setState({
                hasError: true,
                msg: '请输入正确的手机号'
            })
        } else {
            this.setState({
                hasError: false,
                msg: ''
            })
            let codeType = this.props.loginShow.type === 'signin' ? 1 : 2
            const param = `countrycode=86&&phonenum=${phoneNumber.toString()}&&verifcategory=${codeType}`
            axiosAjax('POST', APIPASSPORT + '/account/getverifcode?' + param, {}, function (data) {
                if (data.code === 1) {
                    let times = 60
                    This.setState({
                        authCode: 'times'
                    })
                    const timer = setInterval(function () {
                        if (times > 0) {
                            times--
                        } else {
                            This.setState({
                                authCode: 'button'
                            })
                            clearInterval(timer)
                            times = 60
                        }
                        This.setState({
                            times: times
                        })
                    }, 1000)
                }
            })
        }
    }

    loginFunc = (phoneNumber, password) => {
        const This = this
        const param = `phonenum=${phoneNumber.toString()}&&password=${password}`
        axiosAjax('POST', APIPASSPORT + '/account/login?' + param, {}, function (data) {
            if (data.code === 1) {
                This.setState({
                    loginHasError: false,
                    loginErrorMsg: ''
                })

                This.setState({
                    iframeSrc: data.obj.bbsLogin
                })

                Cookies.set('hx_user_realAuth', data.obj.realAuth, {expires: 7})
                Cookies.set('hx_user_intro', data.obj.introduce || '', {expires: 7})
                Cookies.set('hx_user_token', data.obj.token, {expires: 7})
                Cookies.set('hx_user_id', data.obj.passportId, {expires: 7})
                Cookies.set('hx_user_nickname', data.obj.nickName, {expires: 7})
                Cookies.set('hx_user_url', data.obj.iconUrl, {expires: 7})
                Cookies.set('hx_user_phone', phoneNumber, {expires: 7})
                Cookies.set('hx_user_createtime', data.obj.createTime, {expires: 7})

                This.props.actions.setLoginInfo(data.obj)
                This.props.actions.hideLogin()

                if (getQueryString('bbs')) {
                    window.location.href = getQueryString('bbs')
                }
                // browserHistory.push('/user')
            } else {
                This.setState({
                    loginHasError: true,
                    loginErrorMsg: data.msg
                })
            }
        })
    }

    currentTitle = () => {
        const {loginShow} = this.props
        switch (loginShow.type) {
            case 'signin':
                return '注册'
            case 'retrievePassword':
                return '找回密码'
            default:
                return '注册'
        }
    }

    componentDidMount() {
        if (getQueryString('forum')) {
            switch (getQueryString('forum').toLowerCase()) {
                case 'login':
                    this.props.actions.showLogin('login')
                    break
                case 'signin':
                    this.props.actions.showLogin('signin')
                    break
                default:
                    this.props.actions.showLogin('login')
            }
        }
    }

    // 选择国家代码
    selectPhoneCode = (type, code) => {
        console.log(code)
        if (type === 'login') {
            this.setState({showLcode: true, lCode: code})
        } else {
            this.setState({showRcode: false, rCode: code})
        }
    }

    closeCode = () => {
        const {showLcode, showRcode} = this.state
        if (showLcode) {
            this.setState({showLcode: false})
        }
        if (showRcode) {
            this.setState({showRcode: false})
        }
    }

    render() {
        const {loginShow, actions} = this.props
        return <div className="login-mask" style={{display: loginShow.show ? 'block' : 'none'}}>
            <div className="login-con" onClick={() => this.closeCode()}>
                <iframe src={this.state.iframeSrc} style={{display: 'none'}}/>
                {/* 注册 */}
                <div
                    className="login-con-main"
                    style={{display: (loginShow.type === 'signin' || loginShow.type === 'retrievePassword') ? 'block' : 'none'}}>
                    <h1>{this.currentTitle()}</h1>
                    <p className={`error-msg ${this.state.hasError ? 'show' : ''}`}>{this.state.msg}</p>
                    <div className="login-item phone-item">
                        <span><img src={phoneNumber}/></span>
                        <div className="phone-code" onClick={() => this.setState({showRcode: !this.state.showRcode})}>
                            <span>+{this.state.rCode}</span>
                            <img src={down}/>
                        </div>
                        <input onKeyDown={this.signinSubmit} ref={(ref) => {
                            this.phoneNumber = ref
                        }} placeholder="请输入手机号码"/>
                        <PhoneCode isShow={this.state.showRcode} selectCode={(code) => this.selectPhoneCode('', code)} />
                    </div>
                    <div className="login-item auth-code-item">
                        <span><img src={authCode}/></span>
                        <a
                            style={{display: this.state.authCode === 'button' ? 'block' : 'none'}}
                            onClick={this.getAuthCode}>获取验证码</a>
                        <a
                            style={{display: this.state.authCode === 'times' ? 'block' : 'none'}}
                            className="auth-wait-time">{this.state.times}S</a>
                        <input onKeyDown={this.signinSubmit} ref={(ref) => {
                            this.authCode = ref
                        }} placeholder="请输入手机验证码"/>
                    </div>
                    <div className="login-item">
                        <span><img src={password}/></span>
                        <input onKeyDown={this.signinSubmit} type="password" ref={(ref) => {
                            this.password = ref
                        }} placeholder={this.props.loginShow.type === 'signin' ? '请输入密码' : '请输入新密码'}/>
                    </div>
                    <div className="login-item">
                        <span><img src={rePassword}/></span>
                        <input onKeyDown={this.signinSubmit} type="password" ref={(ref) => {
                            this.rePassword = ref
                        }} placeholder={this.props.loginShow.type === 'signin' ? '请再次输入密码' : '请再次输入新密码'}/>
                    </div>
                    <button onClick={this.signinSubmit}>{this.currentTitle()}</button>
                    <div className="login-tips">
                        <p>已有账号？<a onClick={() => {
                            actions.showLogin('login')
                        }}>立即登录</a></p>
                    </div>
                </div>

                {/* 登录 */}
                <div className="login-con-main" style={{display: loginShow.type === 'login' ? 'block' : 'none'}}>
                    <h1>登录</h1>
                    <p className={`login-error-msg ${this.state.loginHasError ? 'show' : ''}`}>{this.state.loginErrorMsg}</p>
                    <div className="login-item phone-item">
                        <span><img src={phoneNumber}/></span>
                        <div className="phone-code" onClick={() => this.setState({showLcode: !this.state.showLcode})}>
                            <span>+{this.state.lCode}</span>
                            <img src={down}/>
                        </div>
                        <input onKeyDown={this.loginSubmit} ref={(ref) => {
                            this.loginPhoneNumber = ref
                        }} placeholder="请输入手机号码"/>
                        <PhoneCode isShow={this.state.showLcode} selectCode={(code) => this.selectPhoneCode('login', code)} />
                    </div>
                    <div className="login-item">
                        <span><img src={password}/></span>
                        <input onKeyDown={this.loginSubmit} type="password" ref={(ref) => {
                            this.loginPassword = ref
                        }} placeholder="请输入密码"/>
                    </div>
                    <button onClick={this.loginSubmit}>登录</button>
                    <div className="login-tips clearfix">
                        <p>没有账号？<a onClick={() => {
                            actions.showLogin('signin')
                        }}>立即注册</a></p>
                        <a className="forget-password" onClick={() => {
                            actions.showLogin('retrievePassword')
                        }}>忘记密码</a>
                    </div>
                </div>
                <a className="login-close" onClick={actions.hideLogin}>
                    <img src={close}/>
                </a>
            </div>
        </div>
    }
}
