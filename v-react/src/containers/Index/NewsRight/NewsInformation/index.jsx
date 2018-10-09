/**
 * Author：liushaozong
 * Time：2018-01-21 21:34
 * Description：index news right - information
 */

import React, {Component} from 'react'
import {array} from 'prop-types'
import {Link} from 'react-router'
import {injectIntl} from 'react-intl'

import './index.scss'

import {getHourMinute} from '../../../../public/index'
import CheckMore from '../../../../components/public/CheckMore'
import TitleAside from '../../../../components/public/TitleAside'
import quickNewsIconEarth from './img/quick-news-icon-earth.png'

@injectIntl
@TitleAside
class NewsInformation extends Component {
    state = {
        icon: quickNewsIconEarth,
        title: this.props.intl.formatMessage({id: 'title.information'}),
        optionTitle: 0
    }

    render() {
        const {quickNewsList} = this.props
        return <div className="news-information">
            {
                quickNewsList.length !== 0 ? <div className="box-information">
                    {quickNewsList.map((d, i) => {
                        if (i < 6) {
                            return <div key={i} className="list-information">
                                <span className="time">{getHourMinute(d.createdTime)}</span>
                                <p className="details">
                                    {d.content}
                                    {d.url && d.url !== '' && <a style={{color: '#1482f0'}} href={d.url} target="_blank"> 「查看原文」</a>}
                                </p>
                            </div>
                        }
                    })}
                </div> : <div className="live-news-loading">暂无相关快讯</div>
            }
            <Link to="/livenews">
                <CheckMore style={{borderTop: '1px solid #eee'}}/>
            </Link>
        </div>
    }
}

NewsInformation.defaultProps = {
    quickNewsList: [
        {
            id: 'Loading',
            content: 'Loading',
            upCounts: 0,
            downCounts: 0,
            images: 'Loading',
            urlName: 'Loading',
            url: 'Loading',
            status: 1,
            createdTime: new Date()
        }
    ]
}

NewsInformation.propTypes = {
    quickNewsList: array.isRequired
}
export default NewsInformation
