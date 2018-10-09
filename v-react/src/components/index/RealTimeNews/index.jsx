/**
 * Author：zhoushuanglong
 * Time：2018-01-20 21:34
 * Description：real time news
 */

import React, {Component} from 'react'
import {array} from 'prop-types'
// import {injectIntl, FormattedMessage} from 'react-intl'
import {injectIntl} from 'react-intl'
import {Link} from 'react-router'
import './index.scss'
import {getHourMinute} from '../../../public/index'

import icon from './img/icon-real-time.png'

class RealTimeNews extends Component {
    state = {
        posTop: 0,
        smooth: true
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return true
        }
    }

    componentDidMount() {
        const This = this
        let num = 0

        setInterval(function () {
            const listLength = This.props.quickNewsList.length

            num++
            if (num === listLength) {
                num = 0
                This.setState({
                    smooth: false
                })
            } else {
                This.setState({
                    smooth: true
                })
            }

            This.setState({
                posTop: num * 45
            })
        }, 5000)
    }

    render() {
        const {quickNewsList} = this.props
        // const {intl, quickNewsList} = this.props
        /* const intlMon = intl.formatMessage({id: 'index.mouth'}).split(',')
        const intlWeek = intl.formatMessage({id: 'index.week'}).split(',')

        // 获取本机日期时间
        const curTime = new Date()
        const curDate = curTime.getDate()
        const curMon = curTime.getMonth()
        const curWeek = curTime.getDay()

        // 显示月份
        let curMonLast
        intlMon.forEach((d, i) => {
            if (curMon === i) {
                curMonLast = d
            }
        })

        // 显示日期
        let curWeekLast
        intlWeek.forEach((d, i) => {
            if (curWeek === i + 1) {
                curWeekLast = d
            }
        }) */
        return <div className="real-time-news">
            <div className="real-time-top clearfix">
                <div className="real-left">
                    <img src={icon}/>
                    7x24小时快讯
                </div>
                <Link className="real-right" target="_blank" to={`/livenews`}>
                    MORE&nbsp;&nbsp;>
                </Link>
            </div>
            {/* <div className="news-fixed news-con">
                <img src={icon} alt="NEWS"/>
                <div className="news-title">
                    <FormattedMessage id="index.realTimeNews"/>
                </div>
            </div> */}
            <div className="real-time-bottom">
                {quickNewsList.length !== 0 ? <div
                    onClick={() => {
                        window.open('/livenews', '_blank')
                    }}
                    className={`news-con-wrap ${this.state.smooth === true ? 'active' : ''}`}
                    style={{top: `-${this.state.posTop}px`}}>
                    {quickNewsList.map((d, i) => {
                        return <div key={i} className="news-con clearfix">
                            <p> <span>{getHourMinute(d.createdTime)}</span>&nbsp;&nbsp;|&nbsp;&nbsp;{d.content}</p>
                        </div>
                    })}
                </div> : <div className="nodata">暂无实时讯息</div>
                }
            </div>
            {/* <div className="current-time">
                <div className="date">
                    {curMonLast}
                    <FormattedMessage
                        id='index.date'
                        values={{date: curDate}}/>
                </div>
                <div className="week">
                    {curWeekLast}
                </div>
            </div> */}
        </div>
    }
}

RealTimeNews.defaultProps = {
    quickNewsList: [
        {
            createdTime: Date.parse(new Date()),
            content: 'Loading'
        }
    ]
}

RealTimeNews.propTypes = {
    quickNewsList: array.isRequired
}

export default injectIntl(RealTimeNews)
