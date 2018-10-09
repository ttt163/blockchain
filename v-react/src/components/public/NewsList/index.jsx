/**
 * Author：liushaozong
 * Time：2018-01-21 21:34
 * Description：index news list
 */

import React, {Component} from 'react'
import {Link} from 'react-router'
import {array} from 'prop-types'
import {injectIntl} from 'react-intl'
import LazyLoad from 'react-lazyload'

import './index.scss'

import {getTime, keyLight, isJsonString} from '../../../public/index'

@injectIntl
export default class NewsList extends Component {
    componentDidMount() {
        $(window).scrollTop('0')
        // let keyword = this.props.keyword
        // const param = urlPath()
        // this.props.actions.getHotLabel(1, 20, param, 1)
    }

    createMarkup = (html) => {
        return {__html: html}
    }

    render() {
        // const {newsList, boxWidth, intl, tags, main, search} = this.props
        const {newsList, boxWidth, intl, search, noHead} = this.props
        const justNow = intl.formatMessage({id: 'time.justNow'})
        const minuteAgo = intl.formatMessage({id: 'time.minuteAgo'})
        const hourAgo = intl.formatMessage({id: 'time.hourAgo'})
        // let authorList = window.location.href.indexOf('userId') !== -1
        return newsList.length !== 0 ? newsList.map((d, i) => {
            let time = getTime(d.publishTime, d.currentTime, justNow, minuteAgo, hourAgo)
            let url = `/newsdetail?id=${d.id}`
            return (
                <div className="index-news-list" id='newsList' key={i}>
                    <div className="list-left">
                        <LazyLoad height='auto' offset={-10} once>
                            <a target="_blank" href={url}>
                                {isJsonString(d.coverPic) ? <img
                                    src={d.coverPic && JSON.parse(d.coverPic).pc}
                                    alt=""/> : <img
                                    src='http://static.huoxing24.com/images/2018/03/05/1520243882098653.svg'
                                    alt=""/>
                                }
                            </a>
                        </LazyLoad>
                    </div>
                    <div className="list-right" style={{width: boxWidth}}>
                        {/* <Link to={{pathname: '/newsdetail', query: {id: d.id, channelId: d.channelId, updateTime: d.updateTime}}} data-id={d.id}> */}
                        {search ? <a target="_blank" href={url}>
                            <h6
                                className="headline"
                                dangerouslySetInnerHTML={this.createMarkup(keyLight(d.title, this.props.keyword))}/>
                            <div
                                className="details"
                                dangerouslySetInnerHTML={this.createMarkup(keyLight(d.synopsis, this.props.keyword))}/>
                        </a> : <a target="_blank" href={url}>
                            <h6 className="headline">{d.title}</h6>
                            <div className="details">{d.synopsis}</div>
                        </a>}
                        <div className="list-bottom index-mian clearfix">
                            {!noHead && <p className="portrait">
                                <Link target="_blank" to={`/newsauthor?userId=${d.passportId}`}>
                                    <img src={d.iconUrl} alt=""/>
                                </Link>
                            </p>}
                            <p className="name">
                                {d.author}
                            </p>
                            <p className="lock-time">{time}</p>
                            <p className="read-num main-read-num">
                                <span className="count-eye"> </span>
                                <span className="read-count">{d.hotCounts}</span>
                            </p>
                        </div>
                        {/* {!main ? <div className="list-bottom">
                            {authorList ? '' : <p className="portrait">
                                <Link
                                    target="_blank"
                                    to={`/newsauthor?userId=${d.passportId}`}>
                                    <img src={d.iconUrl} alt=""/>
                                </Link>
                            </p>}
                            <p className="name">
                                {d.author}
                            </p>
                            <p className="time">{time}</p>
                            <p className={`read-num ${search ? 'search-hot' : ''}`}>
                                <span className="count-eye"/>
                                <span className="read-count"> {d.hotCounts}</span>
                            </p>
                        </div> : <div className="list-bottom index-mian clearfix">
                            <p className="portrait">
                                <Link target="_blank" to={`/newsauthor?userId=${d.passportId}`}>
                                    <img src={d.iconUrl} alt=""/>
                                </Link>
                            </p>
                            <p className="name">
                                {d.author}
                            </p>
                            <p className="lock-time">{time}</p>
                            <p className="read-num main-read-num">
                                <span className="count-eye"> </span>
                                <span className="read-count">{d.hotCounts}</span>
                            </p>
                        </div>} */}
                    </div>
                </div>
            )
        }) : <div className="loading">暂无相关新闻</div>
    }
}

NewsList.defaultProps = {
    newsList: [
        {
            author: 'Loading',
            cateId: 'Loading',
            channelId: 'Loading',
            content: 'Loading',
            coverPic: '{"pc": "Loading", "wap_big": "Loading", "wap_small": "Loading"}',
            createTime: 'Loading',
            currentTime: 'Loading',
            id: 'Loading',
            readCounts: 'Loading',
            recommend: 'Loading',
            source: 'Loading',
            status: 'Loading',
            synopsis: 'Loading',
            tags: 'Loading',
            title: 'Loading',
            updateTime: 'Loading'
        }
    ]
}

NewsList.propTypes = {
    newsList: array.isRequired
}
