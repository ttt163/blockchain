/**
 * Author：zhoushuanglong
 * Time：2018-01-20 21:34
 * Description：Header nav
 */

import React, {Component} from 'react'
// import {Link} from 'react-router'
import {array} from 'prop-types'
import {injectIntl, FormattedMessage} from 'react-intl'

import partnerIcon from './img/partner-icon.png'
import historyIcon from './img/history-icon.png'
import headImg from './img/head-img.png'
import './index.scss'

class ProjectInfo extends Component {
    componentDidMount() {
        $('.history-list').width(($('.history-item').width() * $('.history-list .history-item').length))
    }

    render() {
        const {partnerList, historyList} = this.props
        return <div className="project-info-content">
            <div className="partner-content">
                <div className="partner-header">
                    <img src={partnerIcon} alt="" className="icon"/>
                    <span className="title">
                        <FormattedMessage id="project.partner"/>
                    </span>
                </div>
                <ul className="partner-list clearfix">
                    {partnerList.map((item, index) => {
                        return <li className="partner-item" key={index}>
                            <p className="partner-head-img">
                                <img src={item.headImg} alt="" className="head-img"/>
                            </p>
                            <div className="partner-intr">
                                <p className="partner-identify">
                                    <span className="name">{item.name}</span>
                                    <span className="position">{item.position}</span>
                                </p>
                                <p className="partner-desc">{item.desc}</p>
                            </div>
                        </li>
                    })}
                </ul>
            </div>
            <div className="history-events">
                <div className="history-header">
                    <img src={historyIcon} alt="" className="icon"/>
                    <span className="title">
                        <FormattedMessage id="history.title"/>
                    </span>
                </div>
                <div className="event-content">
                    <ul className="history-list">
                        {historyList.map((item, index) => {
                            return <li className="history-item" key={index}>
                                <div className={`event-node ${index % 2 === 0 ? 'even' : 'odd'}`}>
                                    <span className="date">{item.date}</span>
                                    <p className="desc">
                                        <span className="count">{item.count}</span>
                                        <span className="content">{item.content}</span>
                                    </p>
                                </div>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
        </div>
    }
}

ProjectInfo.defaultProps = {
    partnerList: [
        {
            headImg: headImg,
            name: 'Loading',
            position: 'Loading',
            desc: 'Loading'
        }
    ],
    historyList: [
        {
            count: 0,
            date: 'Loading',
            content: 'Loading'
        }
    ]
}

ProjectInfo.propTypes = {
    partnerList: array.isRequired,
    historyList: array.isRequired
}

export default injectIntl(ProjectInfo)
