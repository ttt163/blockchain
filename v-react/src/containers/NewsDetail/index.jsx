/**
 * Author：liushaozong
 * Time：2018/01/23
 * Description：newsDetail
 */
import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {browserHistory, Link} from 'react-router'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import Cookies from 'js-cookie'
import ReactPlayer from 'react-player'

import NewsRecommend from '../../components/public/NewsRecommend'
import MusicPlayer from '../../components/public/MusicPlayer'
import NewAuthorTitle from '../../components/newCoins/NewAuthor'
import BottomNewAuthorTitle from '../../components/newCoins/NewAuthor/bottm.author'
import MarketAside from '../../components/public/MarketAside'
import Ad from '../../components/public/Ad'
import Reply from './Reply'

import {getNewsDetails, getNewsCorrelation, collectNews} from '../../actions/news'
import {getAdInfo} from '../../actions/ad'
import {showLogin} from '../../actions/loginInfo'

import {getTime, format} from '../../public/index'
import '../../public/simditor.css'
import './index.scss'

import twitter from './img/twitter.png'
import facebook from './img/facebook.png'
import sina from './img/sina.png'
import wx from './img/wx.png'
import recommend from './img/recommend-img.png'
import adTop from './img/ad-top.jpg'
import adCenter from './img/ad-center.jpg'

const mapStateToProps = (state) => {
    return {
        newsDetails: state.reducerNewsDetails,
        adInfo: state.adInfo,
        loginInfo: state.loginInfo,
        newsCorrelation: state.reducerNewCorrelation
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getAdInfo, getNewsDetails, getNewsCorrelation, collectNews, showLogin}, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
export default class NewsDetail extends Component {
    state = {
        songInfo: ''
    }

    componentWillMount() {
        this.props.actions.getNewsDetails(this.props.location.query.id)
        this.props.actions.getAdInfo({adPlace: '5,6,7'})
    }

    componentDidMount() {
        $(window).scrollTop('0')
    }

    delSong = (i, id) => {
        this.state.songInfo.splice(i, 1)
    }

    handleClickSkip(index) {
        $(window).scrollTop('0')
        let {newsDetails} = this.props
        if (index === 1) {
            browserHistory.push({
                pathname: `/newsdetail?id=${newsDetails.obj.next.id}`
            })
            this.props.actions.getNewsDetails(newsDetails.obj.next.id, newsDetails.obj.next.channelId)
            this.props.actions.getNewsCorrelation(newsDetails.obj.next.tags, newsDetails.obj.next.id, 6)
        } else {
            browserHistory.push({
                pathname: `/newsdetail?id=${newsDetails.obj.prev.id}`
            })
            this.props.actions.getNewsDetails(newsDetails.obj.prev.id, newsDetails.obj.prev.channelId)
            this.props.actions.getNewsCorrelation(newsDetails.obj.prev.tags, newsDetails.obj.prev.id, 6)
        }
    }

    // 判断是否已经登陆
    ifLogin = () => {
        const {loginInfo} = this.props
        const token = Cookies.get('hx_user_token')
        if (loginInfo.passportId === '') {
            if (token === undefined || token === 'undefined' || token === '') {
                return false
            } else {
                return true
            }
        } else {
            return true
        }
    }

    // 收藏点击
    handleCollect = () => {
        let info = this.props.newsDetails.obj.current
        if (this.ifLogin()) {
            this.props.actions.collectNews({
                newsId: info.id,
                passportId: Cookies.get('hx_user_id'),
                token: Cookies.get('hx_user_token'),
                status: this.props.newsDetails.obj.ifCollect === 1 ? -1 : 1
            })
        } else {
            this.props.actions.showLogin('login')
        }
    }

    render() {
        // const {newsRecommend, intl, newsDetails, newsCorrelation, adInfo} = this.props
        const {intl, newsRecommend, newsDetails, adInfo, newsCorrelation} = this.props
        let imgArr = adInfo.all ? adInfo.all : []
        const correlation = intl.formatMessage({id: 'title.correlation'})
        const justNow = intl.formatMessage({id: 'time.justNow'})
        const minuteAgo = intl.formatMessage({id: 'time.minuteAgo'})
        const hourAgo = intl.formatMessage({id: 'time.hourAgo'})
        const {publishTime, currentTime} = newsDetails.obj.current
        document.title = newsDetails.obj.current.title && newsDetails.obj.current.title + '-火星财经'
        let time = getTime(parseInt(publishTime), currentTime, justNow, minuteAgo, hourAgo)
        let songInfoArr = []
        let videoArr = []
        const audio = newsDetails.obj.current.audio
        const video = newsDetails.obj.current.video
        if (audio && audio !== '' && audio.indexOf('[') > -1) {
            if (JSON.parse(audio).length !== 0) {
                JSON.parse(audio).map(function (item, index) {
                    songInfoArr.push({
                        src: item.fileUrl,
                        artist: '',
                        name: $.trim(item.fileName.split('.')[0]),
                        img: '',
                        id: item.uid
                    })
                })
            }
        }
        if (video && video !== '' && audio.indexOf('[') > -1) {
            if (JSON.parse(video).length !== 0) {
                JSON.parse(video).map(function (item, index) {
                    videoArr.push({
                        src: item.fileUrl,
                        artist: '',
                        name: $.trim(item.fileName.split('.')[0]),
                        img: '',
                        id: item.uid
                    })
                })
            }
        }
        return <div className="news-detail clearfix">
            {imgArr[5] && imgArr[5].length === 0 ? '' : <Ad imgArr={imgArr[5] || []}/>}
            <div className="news-detail-con simditor">
                <div className="news-detail-wrap clearfix">
                    <div className="text-header">
                        <h6 style={{textAlign: `${newsDetails.obj.current.title.length > 28 ? 'left' : 'center'}`}}>{newsDetails.obj.current.title}</h6>
                        <div className="issue-box">
                            <p className="author"><span>{newsDetails.obj.current.author}</span></p>
                            <p className="time">发布时间：<span>{time}</span></p>
                            <p className="keyword">关键字：<span>{newsDetails.obj.current.tags}</span></p>
                            {newsDetails.obj.ifCollect === 1 ? <p className="collect" onClick={this.handleCollect}>
                                <i className="iconfont hasCollect">&#xe605;</i>
                                <span> 已收藏</span>
                            </p> : <p className="collect" onClick={this.handleCollect}>
                                <i className="iconfont">&#xe651;</i>
                                <span> 收藏</span>
                            </p>
                            }
                            <p className="read-numbner"><span>{newsDetails.obj.current.hotCounts}</span></p>
                        </div>
                    </div>
                    <div className="details-synopsis active" id="detailsSynopsis">
                        <p>
                            {newsDetails.obj.current.synopsis}
                        </p>
                    </div>

                    {songInfoArr.length !== 0 ? <MusicPlayer info={songInfoArr} onDel={this.delSong}/> : null}

                    {videoArr.length !== 0 ? <div>
                        <ReactPlayer className="detail-video-wraper" url={videoArr[0].src} playing controls/>
                    </div> : ''}
                    <div
                        className='detail-text-cont simditor-body'
                        dangerouslySetInnerHTML={{__html: newsDetails.obj.current.content}}>
                    </div>
                    <div className="source">
                        <div className="source-text">
                            <p>本文来源： <span>{newsDetails.obj.current.source} </span></p>
                            <p><span>{newsDetails.obj.current.author} </span></p>
                        </div>
                        <div className="share" style={{display: 'none'}}>
                            <span>分享：</span>
                            <a className="twitter" style={{display: 'none'}}><img src={twitter} alt=""/></a>
                            <a className="facebook" style={{display: 'none'}}><img src={facebook} alt=""/></a>
                            <a className="sian"><img src={sina} alt=""/></a>
                            <a className="wx"><img src={wx} alt=""/></a>
                        </div>
                    </div>
                    {imgArr[6] && imgArr[6].length === 0 ? '' : <Ad imgArr={imgArr[6] || []}/>}
                    {/* 上一篇、下一篇 */}
                    {/* <div className="page">
                        {(() => {
                            if (newsDetails.obj.prev) {
                                return (
                                    <p className='prev' onClick={() => {
                                        this.handleClickSkip(0)
                                    }}>
                                        <font>上一篇：</font>{newsDetails.obj.prev.title}</p>
                                )
                            }
                        })()}
                        {(() => {
                            if (newsDetails.obj.next) {
                                return (
                                    <p className='next' onClick={() => {
                                        this.handleClickSkip(1)
                                    }}>
                                        <font>下一篇：</font>{newsDetails.obj.next.title}</p>
                                )
                            }
                        })()}
                    </div> */}
                    {/* 相关新闻 */}
                    <div className="bottom-recommend-news">
                        <div className="recommend-title">相关新闻</div>
                        <div className="news-list-contain">
                            {
                                !newsCorrelation.inforList ? '' : newsCorrelation.inforList.map((item, index) => (
                                    <Link target="_blank" key={index} className="clearfix news-item" to={`/newsdetail?id=${item.id}`}>
                                        <span className="dot"></span>
                                        <div>
                                            <div className="news-title">{item.title}</div>
                                            <p>{item.author}丨{format(item.createTime, '.')}</p>
                                        </div>
                                    </Link>
                                ))
                            }
                            {/* <a className="clearfix news-item" href="#">
                                <span className="dot"></span>
                                <div>
                                    <div className="news-title" href="#">现阶段注重M0替代 实现“可控匿名”</div>
                                    <p>作者：火星财经丨2018.03.22</p>
                                </div>
                            </a> */}
                        </div>
                    </div>
                    {/* 底部关注作者 */}
                    {newsDetails.obj.current.createdBy ? <div className="authorinfo-bottom">
                        <BottomNewAuthorTitle passportid={newsDetails.obj.current.createdBy}/>
                    </div> : ''}
                    <Reply articleId={this.props.location.query.id}/>
                </div>
            </div>
            {newsDetails.obj.current.createdBy ? <div className="authorinfo">
                <NewAuthorTitle passportid={newsDetails.obj.current.createdBy}/>
            </div> : ''}
            {/* 涨跌福榜 */}
            <div className="market">
                <MarketAside />
            </div>
            <div className="ad-recomend">
                <NewsRecommend
                    icon={recommend}
                    boxWidth={newsRecommend}
                    title={correlation}
                    newsList={newsCorrelation.inforList}/>
            </div>
            <div className="ad-show">
                {imgArr[7] && imgArr[7].length === 0 ? '' : <Ad imgArr={imgArr[7] || []}/>}
            </div>
        </div>
    }
}

NewsDetail.defaultProps = {
    newImgSize: {
        width: 330,
        height: 160
    },
    newsRecommend: 288,
    adData: [
        {
            img: adTop,
            href: 'http://www.huoxing24.com/2018/index.html'
        }, {
            img: adCenter,
            href: 'http://www.huoxing24.com/#/newsdetail/2018030315021408693'
        }
    ]
}
