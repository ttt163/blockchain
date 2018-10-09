/**
 * Author：liushaozong
 * Time：2018/02/21
 * Description：news
 */
import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Link, browserHistory} from 'react-router'
import {FormattedMessage, injectIntl} from 'react-intl'
import Cookies from 'js-cookie'

import './index.scss'
import 'rc-pagination/assets/index.css'

import attentionPassword from '../img/password.png'
import {changePassword} from '../../../actions/user'
import back from '../../../public/img/back.svg'

const mapStateToProps = (state) => {
    return {
        loginInfo: state.loginInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({changePassword}, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
export default class ChangePassWord extends Component {
    state = {
        hasErr: false,
        errMsg: ''
    }

    componentDidMount() {
        $(window).scrollTop('0')
    }

    changePassword = () => {
        const This = this
        const orginal = $.trim(this.originalPassword.value)
        const newP = $.trim(this.newPassword.value)
        const newRe = $.trim(this.newRePassword.value)
        if (orginal === '') {
            this.setState({
                hasErr: false,
                errMsg: '请输入旧密码'
            })
        } else if (newP === '') {
            this.setState({
                hasErr: true,
                errMsg: '请输入新密码'
            })
        } else if (newRe === '') {
            this.setState({
                hasErr: true,
                errMsg: '请再次输入新密码'
            })
        } else if (newP !== newRe) {
            this.setState({
                hasErr: true,
                errMsg: '两次密码不一致，请重新输入'
            })
        } else {
            const passportid = Cookies.get('hx_user_id')
            const token = Cookies.get('hx_user_token')
            this.props.actions.changePassword({
                passportid: passportid,
                token: token,
                password: newP,
                oldpassword: orginal
            }, function (data) {
                if (data.code === 1) {
                    setTimeout(function () {
                        browserHistory.push('/user')
                    }, 1500)
                }
                This.setState({
                    hasErr: true,
                    errMsg: data.msg
                })
            })
        }
    }

    render() {
        return <div className="attention-password">
            <div className="attention-password-title">
                <img src={attentionPassword} alt=""/>
                <FormattedMessage id="user.info.password"/>
            </div>
            <div className="attention-password-list">
                <div className={`${this.state.hasErr ? 'error-msg show' : 'error-msg'}`}>{this.state.errMsg}</div>
                <div>
                    <FormattedMessage id="user.former.password"/>
                    <input ref={(ref) => {
                        this.originalPassword = ref
                    }} type="password" className="former-password" placeholder="字母与数字组合不超过16位"/>
                </div>
                <div>
                    <FormattedMessage id="user.news.password"/>
                    <input ref={(ref) => {
                        this.newPassword = ref
                    }} type="password" className="news-password" placeholder="字母与数字组合不超过16位"/>
                </div>
                <div>
                    <FormattedMessage id="user.repetition.password"/>
                    <input ref={(ref) => {
                        this.newRePassword = ref
                    }} type="password" className="repetition-password" placeholder="字母与数字组合不超过16位"/>
                </div>
            </div>
            <div
                onClick={this.changePassword}
                className="password-btn"><FormattedMessage id="user.password.btn"/></div>
            <Link to="/user" className="back-user-center"><img src={back}/></Link>
        </div>
    }
}
