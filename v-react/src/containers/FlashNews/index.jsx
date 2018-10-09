/**
 * Author：zhoushuanglong
 * Time：2018-01-20 21:34
 * Description：Header nav
 */

import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {injectIntl, FormattedMessage, FormattedPlural} from 'react-intl'
import '../../../node_modules/layui-layer/dist/layer.js'

import HotNews from '../../components/public/NewsRecommend'
import NewsSort from '../../components/flashNews/NewsSort'
import FlashNewsList from '../../components/flashNews/FlashNewsList'
import CheckMore from '../../components/public/CheckMore'

import './index.scss'
import hotIcon from './img/hot-icon.png'
import rankIcon from './img/rank-icon.png'

import {getQuickNewsList} from '../../actions/quicknews'
import {getHotNews, getRecommendNews} from '../../actions/news'
import {sevenDays} from '../../public/index'

const mapStateToProps = (state) => {
    return {
        quickNews: state.quickNews,
        reducerHotNews: state.reducerHotNews,
        reducerRecommendNews: state.reducerRecommendNews
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getQuickNewsList, getHotNews, getRecommendNews}, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
export default class FlashNewsCon extends Component {
    state = {
        updateNum: 1,
        channelId: null,
        currentPage: 1,
        queryTime: Date.parse(new Date(sevenDays()[0])).toString(),
        passportid: ''
    }

    componentDidMount() {
        this.getlist(0, Date.parse(new Date()), Cookies.get('hx_user_id'))
        this.props.actions.getHotNews()
        this.props.actions.getRecommendNews()
    }

    getlist = (channelId, queryTime, passportid) => {
        this.props.actions.getQuickNewsList({
            pageSize: 30,
            channelId: channelId,
            queryTime: queryTime,
            passportid: passportid
        })
    }

    dataClick = (e) => {
        const queryTime = e.target.getAttribute('data-date')
        this.getlist(this.state.channelId, queryTime, Cookies.get('hx_user_id'))
        this.setState({
            queryTime: queryTime,
            currentPage: 1,
            updateNum: 1
        })
    }

    channelclick = (e) => {
        const channelId = e.target.getAttribute('data-channelid')
        this.getlist(channelId, this.state.queryTime, Cookies.get('hx_user_id'))
        this.setState({
            channelId: channelId,
            currentPage: 1,
            updateNum: 1
        })
    }

    handlePageClick = () => {
        this.setState({
            updateNum: this.state.updateNum + 1,
            currentPage: this.state.currentPage + 1,
            passportid: Cookies.get('hx_user_id')
        }, () => {
            if (this.state.updateNum - 1 >= this.props.quickNews.pageCount) {
                layer.msg('暂无更多新闻 !')
                return false
            } else {
                this.props.actions.getQuickNewsList({
                    pageSize: 30,
                    channelId: this.state.channelId,
                    queryTime: this.state.queryTime,
                    currentPage: this.state.currentPage,
                    passportid: this.state.passportid,
                    type: 'more'
                })
            }
        })
    }

    render() {
        const This = this
        const {quickNews, intl, reducerHotNews, reducerRecommendNews} = this.props
        const {updateNum, channelId} = this.state
        const hotNewTitle = intl.formatMessage({id: 'title.hotNews'})
        return <div className="flash-news-content">
            <div className="flash-news-list">
                <div className="news-head">
                    <em data-channelid={null}
                        onClick={this.channelclick}
                        className={channelId === null ? 'active' : ''}>{intl.formatMessage({id: 'fn.flashNewsTitleZero'})}</em>
                    <em data-channelid="1"
                        onClick={this.channelclick}
                        className={channelId === '1' ? 'active' : ''}>{intl.formatMessage({id: 'fn.flashNewsTitleOne'})}</em>
                    <em data-channelid="2"
                        onClick={this.channelclick}
                        className={channelId === '2' ? 'active' : ''}>{intl.formatMessage({id: 'fn.flashNewsTitleTwo'})}</em>
                    <em data-channelid="3"
                        onClick={this.channelclick}
                        className={channelId === '3' ? 'active' : ''}>{intl.formatMessage({id: 'fn.flashNewsTitleThree'})}</em>
                    <em data-channelid="4"
                        onClick={this.channelclick}
                        className={channelId === '4' ? 'active' : ''}>{intl.formatMessage({id: 'fn.flashNewsTitleFour'})}</em>
                </div>
                <ul className="news-date">
                    {sevenDays().map((item, index) => {
                        const itemDate = Date.parse(new Date(item)).toString()
                        const dataClass = This.state.queryTime.substr(0, 8) === itemDate.substr(0, 8) ? 'active' : ''
                        return <li
                            className={`date-item ` + dataClass}
                            key={index}
                            data-date={itemDate}
                            onClick={this.dataClick}>
                            {intl.formatMessage({id: 'index.date'}, {date: item.split('-')[2]})}
                        </li>
                    })}
                    <p className="update-num" style={{display: 'none'}}>
                        <FormattedMessage id="fn.update"/>
                        <span className="num"> {updateNum} </span>
                        <FormattedPlural
                            value={updateNum}
                            one={<FormattedMessage id="fn.piece"/>}
                            other={<FormattedMessage id="fn.pieces"/>}/>
                    </p>
                </ul>
                {quickNews.inforList.length !== 0 ? <FlashNewsList quickNewsList={quickNews.inforList}/> : <div className="loading">暂无相关快讯</div>}
                <CheckMore onClick={this.handlePageClick}/>
            </div>
            <div className="hot-news-wrap">
                <HotNews newsList={reducerHotNews.inforList} icon={hotIcon} title={hotNewTitle} boxWidth="300px"/>
                <NewsSort icon={rankIcon} recommendData={reducerRecommendNews.inforList}/>
            </div>
        </div>
    }
}
