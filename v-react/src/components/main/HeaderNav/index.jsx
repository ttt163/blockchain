/**
 * Author：zhoushuanglong
 * Time：2018-01-20 21:34
 * Description：Header nav
 */

import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {array, func} from 'prop-types'
import {browserHistory, Link} from 'react-router'
import {injectIntl} from 'react-intl'
import Cookies from 'js-cookie'

import './index.scss'
import logoImg from './img/logo-last-new.svg'
import swImgEwm from './img/sw-ewm.png'
import hxImgEwm from './img/hx-ewm.png'
import newIcon from './img/new-icon.png'
import ebta from './img/ebta.png'

import Login from '../Login'
import {setLoginInfo, showLogin} from '../../../actions/loginInfo'
import {getNewsSearch} from '../../../actions/newsSearch'
import {cutString, urlPath, axiosAjax, getQueryString} from '../../../public/index'
import {APIPASSPORT} from '../../../constants/index'

const mapStateToProps = (state) => {
    return {
        loginInfo: state.loginInfo,
        newsSearch: state.newsSearch
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({setLoginInfo, getNewsSearch, showLogin}, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
export default class HeaderNav extends Component {
    state = {
        iframeSrc: '',
        hasToken: true,
        searchState: false
    }

    linkClick = (e) => {
        const curLink = e.target.getAttribute('data-url')
        Cookies.set('currentLink', curLink)
        if (this.props.location.pathname.indexOf('user') > -1) {
            browserHistory.push(curLink)
        } else {
            if (curLink === '/forum') {
                window.open(`http://bbs.huoxing24.com`, '_blank')
            } else if (curLink === '/baike') {
                window.open(`http://baike.huoxing24.com`, '_blank')
            } else {
                window.open(curLink, '_blank')
            }
        }
    }

    loginOut = () => {
        const This = this
        Cookies.remove('hx_user_token')
        Cookies.remove('hx_user_id')
        Cookies.remove('hx_user_nickname')
        Cookies.remove('hx_user_url')
        Cookies.remove('hx_user_phone')
        Cookies.remove('hx_user_realAuth')
        Cookies.remove('hx_user_createTime')

        this.props.actions.setLoginInfo({
            nickName: '',
            passportid: '',
            token: '',
            url: ''
        })
        this.setState({
            hasToken: false
        })

        axiosAjax('GET', APIPASSPORT + '/account/logout', {
            passportid: Cookies.get('hx_user_id')
        }, function (data) {
            This.setState({
                iframeSrc: data.obj
            })

            if (getQueryString('bbs').toLowerCase()) {
                window.location.href = getQueryString('bbs')
            }
        })
        // browserHistory.push('/')
    }

    searchBtn = () => {
        this.setState({
            searchState: true
        })
    }

    searchClose = () => {
        this.setState({
            searchState: false
        })
        this.refs.myInput.value = ''
    }

    inputOnFocus = () => {
        this.setState({searchState: true})
    }

    inputOnBlur = () => {
        this.setState({searchState: false})
    }

    componentDidMount() {
        if (getQueryString('forum')) {
            if (getQueryString('forum').toLowerCase() === 'logout') {
                this.loginOut()
            }
        }

        document.addEventListener('keydown', (event) => {
            if (this.state.searchState && event.keyCode === 13) {
                this.props.actions.getNewsSearch(1, 10, this.refs.myInput.value)
                this.setState({
                    searchState: false
                })
                browserHistory.push({
                    pathname: `/search`,
                    query: {
                        val: this.refs.myInput.value
                    }
                })
            }
        })
    }

    render() {
        let hasLogin = Cookies.get('hx_user_token') || ''
        let hxNickName = Cookies.get('hx_user_nickname') || ''
        const {intl, navZh, actions, location} = this.props
        // console.log(this.props)
        const {pathname} = location
        return [
            <div className="header-nav" key="headerNav">
                <iframe src={this.state.iframeSrc} style={{display: 'none'}}/>
                <Link to="/" className='logo-img'>
                    <img src={logoImg} alt="" className="logo"/>
                    <span>区块链先锋门户</span>
                </Link>
                <ul className="nav-content">
                    {navZh.map((item, index) => {
                        let curItem = ''
                        const path = urlPath()

                        const navProject = ((path.indexOf('/project') > -1 || path.indexOf('/exchangelist') > -1)) && item.path.indexOf('/market') > -1
                        if (pathname.indexOf('user') > -1) {
                            curItem = ''
                        }
                        if ((path.indexOf(item.path) > -1 || navProject) && index !== 1 && index !== 3) {
                            curItem = 'active'
                        }
                        if ((index === 0 && path === '/')) {
                            curItem = 'active'
                        }
                        if (index === 1 && path.indexOf('id') === -1 && path === item.path) {
                            curItem = 'active'
                        }
                        if (index === 3 && path.indexOf('id') > -1 && path === item.path) {
                            curItem = 'active'
                        }
                        return <li
                            className={`nav-item ${curItem}`}
                            key={index}>
                            <a
                                data-url={item.path}
                                onClick={this.linkClick}>{intl.formatMessage({id: `nav.${item.id}`})}</a>
                            {
                                item.id === 'baike' ? <img className="new-icon" src={newIcon}/> : ''
                            }
                            {
                                item.id === 'bta' ? <img className="new-icon" src={ebta}/> : ''
                            }
                        </li>
                    })}
                </ul>
                <div className="search-content-div">
                    <div className="search-box-btn" onClick={this.searchBtn}>
                        <p className={this.state.searchState ? 'search-content active' : 'search-content'}>
                            <input
                                ref="myInput"
                                onBlur={::this.inputOnBlur}
                                onFocus={::this.inputOnFocus}
                                type="text"
                                className="search-input"
                                placeholder="输入关键词"
                                maxLength={20}/>
                        </p>
                    </div>
                    <span
                        className={this.state.searchState ? 'close active' : 'close'}
                        onClick={this.searchClose}/>
                    {/* <Link to="/search" onClick={this.searchBtn} className="search-content"></Link> */}
                </div>

                {/* 登录注册按钮 */}
                <p className="login-content">
                    {hasLogin === '' ? <span className="login" onClick={() => {
                        actions.showLogin('login')
                    }}>{intl.formatMessage({id: `nav.login`})}
                    </span> : <Link
                        to="/user"
                        className={`login ${pathname.indexOf('user') > -1 ? 'login-active' : ''}`}
                        title={hxNickName}>{cutString(hxNickName, 8)}</Link>}

                    <span className="separation"> </span>
                    {hasLogin === '' ? <span className="register" onClick={() => {
                        actions.showLogin('signin')
                    }}>
                        {intl.formatMessage({id: `nav.register`})}
                    </span> : <span onClick={this.loginOut}>注销</span>}
                </p>
                {/* 写文章 */}
                <div className="wx-ewm">
                    <div className="wx-ewm-img">
                        <img src={swImgEwm} alt=""/>
                        <img src={hxImgEwm} alt=""/>
                    </div>
                </div>
            </div>,
            <Login key="login"/>
        ]
    }
}

HeaderNav.defaultProps = {
    navZh: [
        {name: '首页', index: 0, path: '/index', id: 'index'},
        {name: '新闻', index: 1, path: '/news', id: 'news'},
        // {name: '火星社区', index: 5, path: '/forum', id: 'bta'},
        {name: '火星社区', index: 5, path: 'http://bbs.huoxing24.com', id: 'bta'},
        // {name: '百科', index: 7, path: '/baike', id: 'baike'},
        {name: '百科', index: 7, path: 'http://baike.huoxing24.com/', id: 'baike'},
        {name: '快讯', index: 2, path: '/livenews', id: 'flashNews'},
        {name: '游戏', index: 8, path: '/news?id=7', id: 'game'},
        // {name: '技术', index: 3, path: '/news?id=6', id: 'skill'},
        {name: '行情', index: 4, path: '/markets', id: 'market'},
        {name: 'APP', index: 6, path: '/app', id: 'app'}
        // {name: '项目动态', index: 8, path: '/newcoins', id: 'newCoins'}
        // {name: '新手入门', index: 8, path: '/primer', id: 'primer'}
    ]
}

HeaderNav.propTypes = {
    navZh: array.isRequired,
    navClick: func
}
