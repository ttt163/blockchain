/**
 * Author：zhoushuanglong
 * Time：2018-01-20 21:34
 * Description：Header nav
 */

import React, {Component} from 'react'
import {Link} from 'react-router'
import {array} from 'prop-types'
import {injectIntl} from 'react-intl'

import {cutString, isJsonString} from '../../../public/index'

import './index.scss'

@injectIntl
class CommentNews extends Component {
    state = {
        itemWidth: 232 + 10,
        swipeLeftValue: 0,
        containerWidth: (232 + 10) * 5,
        curPage: 0,
        speed: 6000,
        timer: null
    }

    nextClick = () => {
        const {commentNews} = this.props
        const page = this.state.curPage
        if (page < commentNews.length) {
            this.setState({
                curPage: page + 1
            }, function () {
                if ((page + 1) < commentNews.length / 5) {
                    this.setState({
                        swipeLeftValue: -this.state.containerWidth * this.state.curPage
                    })
                } else {
                    this.setState({
                        swipeLeftValue: 0,
                        curPage: 0
                    })
                }
            })
        }
    }

    prevClick = () => {
        const {commentNews} = this.props
        const page = this.state.curPage
        const swipeleft = this.state.swipeLeftValue
        if (page < commentNews.length) {
            this.setState({
                curPage: page - 1
            }, function () {
                if ((page - 1) > 0) {
                    this.setState({
                        swipeLeftValue: swipeleft + this.state.containerWidth
                    })
                } else {
                    this.setState({
                        swipeLeftValue: -(commentNews.length / 5 - 1) * this.state.containerWidth,
                        curPage: commentNews.length / 5
                    })
                }
            })
        }
    }

    commentMouseOut = () => {
        this.commentAddTimer()
    }

    commentMouseOver = () => {
        clearInterval(this.state.timer)
        this.setState({
            timer: null
        })
    }

    commentAddTimer = () => {
        const This = this
        this.setState({
            timer: setInterval(function () {
                This.nextClick()
            }, this.state.speed)
        })
    }

    componentDidMount() {
        this.commentAddTimer()
    }

    render() {
        const {commentNews} = this.props
        // const justNow = intl.formatMessage({id: 'time.justNow'})
        // const minuteAgo = intl.formatMessage({id: 'time.minuteAgo'})
        // const hourAgo = intl.formatMessage({id: 'time.hourAgo'})
        // let time = getTime(item.publishTime, item.currentTime, justNow, minuteAgo, hourAgo)
        return <div
            onMouseOut={this.commentMouseOut}
            onMouseOver={this.commentMouseOver}
            className="comment-news-content">
            <div className="swiper-container">
                <div className="swiper-button-next" onClick={this.nextClick}/>
                <div className="swiper-button-prev" onClick={this.prevClick}/>
                {commentNews.length > 1 ? <div
                    style={{
                        transform: `translateX(${this.state.swipeLeftValue}px)`,
                        width: commentNews.length * this.state.itemWidth + 'px'
                    }}
                    className="swiper-wrapper comment-news-div clearfix">
                    {commentNews.map((item, i) => {
                        return <div className="swiper-slide comment-news" key={i}>
                            <Link
                                target='_blank'
                                to={`/newsdetail?id=${item.id}`}
                                key={i}>
                                <div className="img-div">
                                    {isJsonString(item.coverPic) ? <img
                                        className="news-img"
                                        src={item.coverPic && (JSON.parse(item.coverPic).pc_recommend || JSON.parse(item.coverPic).pc)}
                                        alt=""/> : <img
                                        className="news-img"
                                        src='http://static.huoxing24.com/images/2018/03/05/1520243882098653.svg'
                                        alt=""/>
                                    }
                                </div>
                                <span className="mode"/>
                                <p className="title">{cutString(item.title, 75)}</p>
                                {/*
                                 <p className="time">
                                 {time}
                                 </p>
                                 */}
                            </Link>
                        </div>
                    })}
                </div> : <div className="comment-loading"/>}
            </div>
        </div>
    }
}

CommentNews.defaultProps = {
    commentNews: [
        {
            id: 'Loading',
            channelId: 'Loading',
            coverPic: 'Loading',
            title: 'Loading'
        }, {
            id: 'Loading',
            channelId: 'Loading',
            coverPic: 'Loading',
            title: 'Loading'
        }, {
            id: 'Loading',
            channelId: 'Loading',
            coverPic: 'Loading',
            title: 'Loading'
        }, {
            id: 'Loading',
            channelId: 'Loading',
            coverPic: 'Loading',
            title: 'Loading'
        }
    ]
}

CommentNews.propTypes = {
    commentNews: array.isRequired
}

export default CommentNews
