/**
 * Author：liushaozong
 * Time：2018/02/21
 * Description：news
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {browserHistory} from 'react-router'
import {changePassword} from '../../../actions/user'
import {FormattedMessage, injectIntl} from 'react-intl'
import Cookies from 'js-cookie'

import './hxh.scss'
import 'rc-pagination/assets/index.css'

import attentionPassword from '../img/password.png'
// import back from '../../../public/img/back.svg'
// import attentionCancel from '../img/attention-cancel.png'

const mapStateToProps = (state) => ({
    loginInfo: state.loginInfo
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({changePassword}, dispatch)
})

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class ChangePassWord extends Component {
    state = {
        hasErr1: false,
        hasErr2: false,
        hasErr3: false,
        errMsg: ''
    }

    componentDidMount() {
        // $(window).scrollTop('0')
    }

    changePassword = () => {
        const This = this
        const err = '密码为8至16位的字母、数字组合'
        const reg = /^[a-zA-Z0-9]{8,16}$/
        let orginal = $.trim(this.refs[0].value)
        let newP = $.trim(this.refs[1].value)
        let newRe = $.trim(this.refs[2].value)
        if (orginal === '') {
            this.setState({
                hasErr1: true,
                hasErr2: false,
                hasErr3: false,
                errMsg: '请输入旧密码'
            })
        } else if (!orginal.match(reg)) {
            this.setState({
                hasErr1: true,
                hasErr2: false,
                hasErr3: false,
                errMsg: err
            })
        } else if (newP === '') {
            this.setState({
                hasErr1: false,
                hasErr2: true,
                hasErr3: false,
                errMsg: '请输入新密码'
            })
        } else if (!newP.match(newP)) {
            this.setState({
                hasErr1: false,
                hasErr2: true,
                hasErr3: false,
                errMsg: err
            })
        } else if (newRe === '') {
            this.setState({
                hasErr1: false,
                hasErr2: false,
                hasErr3: true,
                errMsg: '请再次输入新密码'
            })
        } else if (newP !== newRe) {
            this.setState({
                hasErr1: false,
                hasErr2: false,
                hasErr3: true,
                errMsg: '两次密码不一致，请重新输入'
            })
        } else {
            this.setState({
                hasErr1: false,
                hasErr2: false,
                hasErr3: false,
                errMsg: ''
            })
            const passportid = Cookies.get('hx_user_id')
            const token = Cookies.get('hx_user_token')
            this.props.actions.changePassword({
                passportid: passportid,
                token: token,
                password: newP,
                oldpassword: orginal
            }, function (data) {
                if (data.code !== 1) {
                    This.setState({
                        hasErr1: true,
                        hasErr2: false,
                        hasErr3: false,
                        errMsg: data.msg
                    })
                } else {
                    browserHistory.push('/user')
                }
            })
        }
    }

    render() {
        const {errMsg, hasErr1, hasErr2, hasErr3} = this.state
        let arr = [{
            src: require('../img/old-pass-icon.png'),
            placeholder: '请输入原密码',
            ref: 'old',
            hasErr: hasErr1
        }, {
            src: require('../img/new-pass-icon.png'),
            placeholder: '请输入新密码',
            ref: 'new',
            hasErr: hasErr2
        }, {
            src: require('../img/renew-pass-icon.png'),
            placeholder: '请再次输入新密码',
            ref: 'renew',
            hasErr: hasErr3
        }]
        return <div className="attention-password">
            <div className="attention-password-title">
                <img src={attentionPassword} alt=""/>
                <FormattedMessage id="user.info.password"/>
            </div>
            <div className="attention-password-list">
                {
                    arr.map((d, i) => {
                        return <div key={i}>
                            <img src={d.src}/>
                            <input
                                type="password"
                                className="former-password"
                                placeholder={d.placeholder}
                                ref={i}
                            />
                            {
                                d.hasErr && <span className="error">
                                    <img src={require('../img/error.png')} alt=""/>
                                    <i>{errMsg}</i>
                                </span>
                            }
                        </div>
                    })
                }
            </div>
            <div className='password-btn-wrapper' onClick={this.changePassword}>
                <div className="password-btn"><FormattedMessage id="user.password.btn"/></div>
            </div>
        </div>
    }
}
