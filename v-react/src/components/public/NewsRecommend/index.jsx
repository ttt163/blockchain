/**
 * Author：liushaozong
 * Time：2018-01-21 21:34
 * Description：news - recommend
 */

import React, {Component} from 'react'
import {array} from 'prop-types'
// import {browserHistory} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {getNewsDetails, getNewsCorrelation} from '../../../actions/news'
import {isJsonString} from '../../../public'

import './index.scss'
import TitleAside from '../TitleAside'
import titleIcon from './img/recommend-title-img.png'

@TitleAside
class NewsRecommend extends Component {
    constructor(props) {
        super(props)
        this.state = {
            icon: this.props.icon ? this.props.icon : titleIcon,
            title: this.props.title,
            iconStyle: {
                marginTop: '4px',
                height: '24px'
            }
        }
    }

    componentDidMount() {
        $(window).scrollTop('0')
    }

    handleClick(item) {
        let url = `/newsdetail?id=${item.id}`
        window.open(url, '_blank')
        this.props.dispatch(getNewsDetails(item.id, item.channelId))
        this.props.dispatch(getNewsCorrelation(item.tags, item.id, 6))
    }

    render() {
        const {boxWidth, newsList} = this.props
        return <div className="news-recommend clearfix" style={{width: boxWidth}}>
            <div className="new-list-box">
                {
                    newsList && newsList.length > 0 ? newsList.map((item, index) => {
                        return (
                            <div className="list-box" key={index} style={{paddingTop: index === 0 ? 0 : '16px', borderTop: index === 0 ? 0 : '1px solid #ebebeb'}}>
                                <div onClick={() => {
                                    this.handleClick(item)
                                }}>
                                    <div className="left-img">
                                        {isJsonString(item.coverPic) ? <img src={item.coverPic && JSON.parse(item.coverPic).pc} alt=""/> : <img
                                            src='http://static.huoxing24.com/images/2018/03/05/1520243882098653.svg'
                                            alt=""/>}
                                    </div>
                                    <span className="right-text">{item.title}</span>
                                </div>
                            </div>
                        )
                    }) : <div className="loading">暂无相关新闻</div>
                }
            </div>
        </div>
    }
}

NewsRecommend.defaultProps = {
    newsList: [
        {
            id: 'Loading',
            channelId: 'Loading',
            coverPic: '{"pc": "Loading", "wap_big": "Loading", "wap_small": "Loading"}',
            title: 'Loading'
        }
    ]
}

NewsRecommend.propTypes = {
    newsList: array.isRequired
}
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getNewsDetails, getNewsCorrelation}, dispatch)
    }
}
export default connect(mapDispatchToProps)(NewsRecommend)
