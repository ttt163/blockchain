/**
 * Author：zhoushuanglong
 * Time：2018-01-20 21:34
 * Description：Header nav
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import Cookie from 'js-cookie'

import {getAuthorInfo, attentionAuthor, cancelAttention} from '../../../actions/authorinfo'
import {showLogin} from '../../../actions/loginInfo'
import './index.scss'
// import authorImg from './img/author-img.jpg'

const mapStateToProps = (state) => {
    return {
        authorInfo: state.authorInfo,
        loginInfo: state.loginInfo
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({getAuthorInfo, attentionAuthor, cancelAttention, showLogin}, dispatch)
})

@connect(mapStateToProps, mapDispatchToProps)
export default class NewAuthorTitle extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        let {passportid, actions} = this.props
        actions.getAuthorInfo({
            passportId: passportid,
            myPassportId: Cookie.get('hx_user_id')
        })
    }

    attention = () => {
        if (Cookie.get('hx_user_token') !== undefined) {
            this.props.actions.attentionAuthor({
                passportid: Cookie.get('hx_user_id'),
                token: Cookie.get('hx_user_token'),
                authorId: this.props.passportid
            })
        } else {
            this.props.actions.showLogin('login')
        }
    }

    cancel = () => {
        this.props.actions.cancelAttention({
            passportid: Cookie.get('hx_user_id'),
            token: Cookie.get('hx_user_token'),
            authorId: this.props.authorInfo.passportId
        })
    }

    render() {
        const {iconUrl, nickName, newsCount, followCount, ifCollect, passportId, introduce} = this.props.authorInfo
        return <div className="new-author-title">
            <div className="author-title-img">
                <Link target="_blank" to={`/newsauthor?userId=${passportId}`}>
                    <img src={iconUrl || 'http://static.huoxing24.com/images/2018/03/20/1521545214057149.png'} alt=""/>
                </Link>
            </div>
            <h6 className="title-author">{nickName || '— —'}</h6>
            <p className="introduce-author">{introduce}</p>
            <div className="author-detl clearfix">
                <div className="author-name">
                    <h6>粉丝</h6>
                    <p><span>{followCount || 0}</span></p>
                </div>
                <Link className="author-article" target="_blank" to={`/newsauthor?userId=${passportId}`}>
                    <h6>文章数量</h6>
                    <p><span>{newsCount || 0}</span> 篇</p>
                </Link>
            </div>
            {(() => {
                if (parseInt(ifCollect) === 0) {
                    return <div className='attention' onClick={this.attention}>关注</div>
                } else if (parseInt(ifCollect) === 1) {
                    return <div className='attention active' onClick={this.cancel}>取消关注</div>
                } else {
                    return ''
                }
            })()}
        </div>
    }
}
