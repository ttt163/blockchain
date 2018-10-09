/**
 * Author：liushaozong
 * Time：2018-01-21 21:34
 * Description：news sort
 */

import React, {Component} from 'react'
import {array} from 'prop-types'
// import {Link} from 'react-router'
import {injectIntl} from 'react-intl'

import './index.scss'

import TitleAside from '../../public/TitleAside'
import icon from './img/news-srot-icon.jpg'

@injectIntl
@TitleAside
class NewsSort extends Component {
    state = {
        icon: this.props.icon || icon,
        title: this.props.intl.formatMessage({id: 'title.newsSort'}),
        iconStyle: {
            marginTop: '4px',
            height: '24px'
        }
    }

    render() {
        const {recommendData} = this.props
        return <div className="news-sort clearfix" style={{width: '300px'}}>
            <div className="news-sort-box">
                {
                    recommendData.map(function (item, index) {
                        return (
                            <div className="list-box clearfix" key={index}>
                                <span>{index + 1}</span>
                                <a target="_blank" className="right-text" href={`/newsdetail?id=${item.id}`}>
                                    {item.title}
                                </a>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    }
}

NewsSort.defaultProps = {
    recommendData: [
        {
            id: 'Loading',
            channelId: 'Loading',
            coverPic: '{"pc": "Loading", "wap_big": "Loading", "wap_small": "Loading"}',
            title: 'Loading'
        }
    ]
}

NewsSort.propTypes = {
    recommendData: array.isRequired
}
export default NewsSort
