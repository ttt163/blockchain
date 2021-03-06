/**
 * Author：liushaozong
 * Time：2018/02/21
 * Description：news
 */
import React, {Component} from 'react'
import {FormattedMessage, injectIntl} from 'react-intl'

import './index.scss'
import 'rc-pagination/assets/index.css'
import attentionPhoneEml from '../img/phone.png'
// import attentionCancel from '../img/attention-cancel.png'

@injectIntl
class BindingPhone extends Component {
    componentDidMount() {
        $(window).scrollTop('0')
    }

    render() {
        return <div className="attention-change-phone">
            <div className="attention-change-title"><img src={attentionPhoneEml} alt=""/><FormattedMessage id="user.change.phone"/></div>
            <div className="attention-change-list">
                <div><FormattedMessage id="user.former.eml"/><input type="text" className="changePhone" placeholder="单行输入"/></div>
                <div><FormattedMessage id="user.verification.code"/><input type="text" className="changeCode" placeholder="单行输入"/><button className="get-code">获取验证码</button></div>
                <div><FormattedMessage id="user.news.eml"/><input type="text" className="changePhone" placeholder="单行输入"/></div>
                <div><FormattedMessage id="user.verification.code"/><input type="text" className="changeCode" placeholder="单行输入"/><button className="get-code">获取验证码</button></div>
            </div>
            <div className="password-btn"><FormattedMessage id="user.password.btn"/></div>
        </div>
    }
}

export default (BindingPhone)
