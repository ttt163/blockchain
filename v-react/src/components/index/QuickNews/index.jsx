/**
 * Author：zhoushuanglong
 * Time：2018-01-20 21:34
 * Description：quick news
 */

import React, {Component} from 'react'
import {string} from 'prop-types'
import {FormattedMessage} from 'react-intl'

import './index.scss'

import TitleAside from '../../public/TitleAside'

import clock from './img/quick-news-icon-clock.png'
import earth from './img/quick-news-icon-earth.png'

@TitleAside
export default class QuickNews extends Component {
    state: {
        icon: earth,
        title: '实例标题'
    }

    render() {
        const {time, news} = this.props
        return <div className="quick-news">
            <h4 className="quick-news-time">
                <img className="aside-title-icon" src={clock} alt="Icon"/>
                {time}
            </h4>
            <p>
                <FormattedMessage id="news.digest"/>
                {news}
            </p>
        </div>
    }
}

QuickNews.defaultProps = {
    time: 'Loading',
    news: 'Loading'
}

QuickNews.propTypes = {
    time: string.isRequired,
    news: string.isRequired
}
