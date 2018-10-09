/**
 * Author：zhoushuanglong
 * Time：2018-01-27 16:10
 * Description：flash news list
 */

import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {array} from 'prop-types'
import {FormattedMessage} from 'react-intl'
import Cookies from 'js-cookie'

import './index.scss'
import {getHourMinute} from '../../../public/index'
import {getLike} from '../../../actions/quicknews'
import '../../../../node_modules/layui-layer/dist/layer.js'

class FlashNewsList extends Component {
    state = {
        goodProfitState: false,
        badProfitState: false,
        passportId: Cookies.get('hx_user_id'),
        token: Cookies.get('hx_user_token')
    }
    goodProfitClick = (e) => {
        let hxUserToken = Cookies.get('hx_user_token')
        if (hxUserToken !== '' && hxUserToken !== undefined) {
            const id = e.target.getAttribute('data-id')
            this.props.actions.getLike(this.state.passportId, this.state.token, 1, id, false, false)
        } else {
            layer.msg('请先登录')
        }
    }
    badProfitNumClick = (e) => {
        let hxUserToken = Cookies.get('hx_user_token')
        if (hxUserToken !== '' && hxUserToken !== undefined) {
            const id = e.target.getAttribute('data-id')
            this.props.actions.getLike(this.state.passportId, this.state.token, 0, id, false, false)
        } else {
            layer.msg('请先登录')
        }
    }
    componentDidMount() {
    }
    render() {
        const {quickNewsList} = this.props
        return <ul className="flash-news-list">
            {quickNewsList.map((item, i) => {
                const tag = () => {
                    if (item.tag === 1) {
                        return ''
                    } else if (item.tag === 2) {
                        return 'important-news'
                    }
                }
                return <li className="flash-news" key={i}>
                    <div className="news-item">
                        <span className={tag()}> </span>
                        <span className="new-time">{getHourMinute(item.createdTime)}</span>
                        <p className="news-detail" style={{color: `${item.tag === 2 && 'red'}`}}>
                            {item.content}
                            {(item && item.url && item.url !== '') ? <a href={item.url} style={{color: '#1482f0'}} target="_blank"> 「查看原文」</a> : ''}</p>
                        <div className="judge-profit">
                            <p className={`good-profit ${item.type === '1' ? 'active' : ''}`}>
                                <FormattedMessage id="fn.goodProfit"/>
                                <span> {item.upCounts} </span>
                                <span className="event-click" onClick={this.goodProfitClick} data-id={item.id} data-index={i} ></span>
                            </p>
                            <p className={`bad-profit ${item.type === '0' ? 'active' : ''}`}>
                                <FormattedMessage id="fn.badProfit"/>
                                <span> {item.downCounts} </span>
                                <span className="event-click" onClick={this.badProfitNumClick} data-id={item.id} data-index={i} ></span>
                            </p>
                        </div>
                    </div>
                </li>
            })}
        </ul>
    }
}

FlashNewsList.defaultProps = {
    quickNewsList: [
        {
            id: 'Loading',
            content: 'Loading',
            upCounts: 0,
            downCounts: 0,
            images: 'Loading',
            urlName: 'Loading',
            url: '',
            tag: 1,
            createdTime: new Date()
        }
    ]
}

FlashNewsList.propTypes = {
    quickNewsList: array.isRequired
}

const mapStateToProps = (state) => {
    return {
        live: state.quickNews
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getLike}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FlashNewsList)
