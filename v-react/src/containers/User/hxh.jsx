import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {FormattedMessage, injectIntl} from 'react-intl'
import {Link, browserHistory} from 'react-router'
import Cookie from 'js-cookie'
// import {cutString, format} from '../../public'
// import AttentionProject from './AttentionProject/index'
import {getAuthorInfo} from '../../actions/user'

import './hxh.scss'
import portrait from './img/portrait.png'

const mapStateToProps = (state) => {
    return {
        userInfo: state.loginInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getAuthorInfo}, dispatch)
    }
}

@injectIntl
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
        // $(window).scrollTop('0')
        this.props.actions.getAuthorInfo({
            passportId: Cookie.get('hx_user_id')
        })
    }

    render() {
        const {intl, location, userInfo} = this.props
        const {iconUrl, nickName, introduce} = userInfo
        const userNav = intl.formatMessage({id: 'user.nav'}).split(',')
        const {pathname} = location
        let liRouter = [
            {name: userNav[0], path: '/userMyInfo'},
            {name: userNav[1], path: '/userChangePassword'},
            {name: userNav[2], path: '/userCertification'},
            {name: userNav[3], path: '/userMyArticle'},
            {name: userNav[4], path: '/userMyAttention'},
            {name: userNav[5], path: '/userMyCollection'}
        ]
        liRouter = parseInt(userInfo.realAuth) !== 1 ? liRouter.filter((item, index) => index !== 3) : liRouter
        return <div className="user-content clearfix">
            <div className="user-list-nav">
                <img className='user-avatar' src={ iconUrl || Cookie.get('hx_user_url') || portrait} alt=""/>
                <p className="user-name">{nickName || Cookie.get('hx_user_nickname')}</p>
                <p className="user-desc"><font>{introduce || Cookie.get('hx_user_desc') || '暂无简介'}</font></p>
                <div className='user-info'>
                    <div className="fans-num"><FormattedMessage id="user.fans"/><p>{userInfo.followCount || 0}</p></div>
                    <div className="art-num"><FormattedMessage id="user.article"/><p>{userInfo.newsCount || 0}</p></div>
                </div>
                {parseInt(userInfo.realAuth) !== 1 ? '' : <div className="publish" onClick={() => { browserHistory.push('/edit') }}>发布新闻</div>}
                <ul className="user-nav">
                    {liRouter.map((item, index) => {
                        return <li onClick={() => { this.handleClick(index) }} key={index} className={`${pathname.indexOf(item.path) > -1 || (pathname === '/user' && index === 0) ? 'active' : ''}`}>
                            <Link to={item.path}>{item.name}</Link>
                            <div></div>
                        </li>
                    })}
                </ul>
            </div>
            <div className="user-panel">
                {this.props.children}
            </div>
        </div>
    }
}

export default User
