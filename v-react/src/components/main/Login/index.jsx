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
import refresh from './img/refresh.png'

import {isPoneAvailable, axiosAjax, getQueryString} from '../../../public/index'
import {setLoginInfo, hideLogin, showLogin} from '../../../actions/loginInfo'
import {APIPASSPORT} from '../../../constants/index'

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
        codeImg: 0
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
                        console.log(data)
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
                            console.log(data.msg)
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

    getImgBtn = () => {
        axiosAjax('POST', APIPASSPORT + '/account/getGraphCode', {}, function (data) {
            $('#codeImg').attr('src', APIPASSPORT + '/account/getGraphCode')
        })
    }

    getAuthCode = () => {
        // const This = this
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
                msg: '',
                codeImg: 2
            })
            this.getImgBtn()
        }
    }

    refreshBtn = () => {
        this.getImgBtn()
    }

    codeBtn = () => {
        const This = this
        this.setState({codeImg: 1})
        const phoneNumber = $.trim(this.phoneNumber.value)
        let codeType = this.props.loginShow.type === 'signin' ? 1 : 2
        let codeVal = $('.code-text').val()
        const param = `countrycode=86&&phonenum=${phoneNumber.toString()}&&verifcategory=${codeType}&&graphcode=${codeVal}`
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
            } else {
                This.setState({
                    hasError: true,
                    msg: data.msg
                })
            }
        })
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

                if (getQueryString('bbs').toLowerCase()) {
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

    closeImg = () => {
        this.setState({codeImg: 0})
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
                    console.log(getQueryString('forum'))
            }
        }
    }

    render() {
        const {loginShow, actions} = this.props
        return <div>
            <div className={`code-shade ${this.state.codeImg === 2 ? 'show' : ''}`}></div>
            {/* 图片验证 */}
            <div className={`verification-img ${this.state.codeImg === 2 ? 'show' : ''}`} id="verificationImg">
                <div className="close-img" onClick={this.closeImg}><img src={close} alt=""/></div>
                <h5>验证</h5>
                <input type="text" className="code-text"/>
                <p><img id="codeImg" src="" alt=""/></p>
                <div className="refresh" onClick={this.refreshBtn}><img src={refresh} alt=""/></div>
                <button id="codeBtn" onClick={this.codeBtn}>确定</button>
            </div>
            <div className="login-mask" style={{display: loginShow.show ? 'block' : 'none'}}>
                <div className="login-con">
                    <iframe src={this.state.iframeSrc} style={{display: 'none'}}/>
                    {/* 注册 */}
                    <div
                        className="login-con-main"
                        style={{display: (loginShow.type === 'signin' || loginShow.type === 'retrievePassword') ? 'block' : 'none'}}>
                        <h1>{this.currentTitle()}</h1>
                        <p className={`error-msg ${this.state.hasError ? 'show' : ''}`}>{this.state.msg}</p>
                        <div className="login-item">
                            <span><img src={phoneNumber}/></span>
                            <input onKeyDown={this.signinSubmit} ref={(ref) => {
                                this.phoneNumber = ref
                            }} placeholder="请输入手机号码"/>
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
                        <div className="login-item">
                            <span><img src={phoneNumber}/></span>
                            <input onKeyDown={this.loginSubmit} ref={(ref) => {
                                this.loginPhoneNumber = ref
                            }} placeholder="请输入手机号码"/>
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
        </div>
    }
}
