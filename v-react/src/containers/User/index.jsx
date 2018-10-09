/**
 * Author：liushaozong
 * Time：2018/02/21
 * Description：news
 */

import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
/* import {FormattedMessage, injectIntl} from 'react-intl'
import {injectIntl} from 'react-intl'
import {Link} from 'react-router'
import Cookies from 'js-cookie'
import {cutString, format} from '../../public'
import {FormattedMessage, injectIntl} from 'react-intl'
import {Link} from 'react-router'
import Cookie from 'js-cookie'
import AttentionProject from './AttentionProject/index' */

import './index.scss'
// import portrait from './img/portrait.png'

const mapStateToProps = (state) => {
    return {
        userInfo: state.loginInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({}, dispatch)
    }
}

// @injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class User extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: 0
        }
    }

    handleClick(index) {
        this.setState({
            index: index
        })
    }

    componentDidMount() {
        $(window).scrollTop('0')
    }

    render() {
        /* const {intl} = this.props
        const userNav = intl.formatMessage({id: 'user.nav'}).split(',')
        const liRouter = [
            {name: userNav[0], path: '/user/myAttention'},
            {name: userNav[1], path: '/user/authorAttention'},
            {name: userNav[2], path: '/user/myArticle'},
            {name: userNav[3], path: '/user/myInfo'},
            {name: userNav[4], path: '/user/change'}
        ] */
        return <div className="user-content clearfix">
            {/* <div className="user-list-nav">
                <div className="user-message">
                    <p className="user-portrait"><img src={portrait} alt=""/></p>
                    <p className="user-name">{Cookie.get('hx_user_nickname')}</p>
                    <p className="user-time"><font>{Cookie.get('hx_user_desc') || '暂无简介'}</font></p>
                </div>
                <div className="fans-box clearfix">
                    <div className="author-num"><FormattedMessage id="user.fans"/><p>{Cookie.get('hx_user_fans') || 0}</p></div>
                    <div className="fans-num"><FormattedMessage id="user.article"/><p>{Cookie.get('hx_user_article') || 0}</p></div>
                </div>
                <div className="user-nav">
                    <ul>
                        {liRouter.map((item, index) => {
                            return <li onClick={() => { this.handleClick(index) }} key={index}>
                                <Link className={`${index === this.state.index ? 'active' : ''}`} to={item.path}>{item.name}</Link>
                            </li>
                        })}
                    </ul>
                </div>
            </div> */}
            <div className="user-right-cont">
                {this.props.children}
            </div>
        </div>
    }
}

export default (User)
