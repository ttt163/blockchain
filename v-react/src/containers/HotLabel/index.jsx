/**
 * Author：liushaozong
 * Time：2018/01/23
 * Description：news
 */
import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {number, object} from 'prop-types'
import {injectIntl} from 'react-intl'
import {timestampToTime, add0} from '../../public/index'
// import Cookies from 'js-cookie'
import {getIndexNewsList, getNewsListRecommend} from '../../actions/news'
import {getAuthorMessage} from '../../actions/user'

import './index.scss'
import CheckMore from '../../components/public/CheckMore'
import NewsList from '../../components/public/NewsList'
// import Ad from '../../components/public/Ad'
// import NewAuthorTitle from '../../components/newCoins/NewAuthor'
// import NewsImg from '../../components/public/NewsImg'
import NewsRecommend from '../../components/public/NewsRecommend'
import {getHotSubjectTopic} from '../../actions/hotSubject'
// import {titleArr} from '../../public'
import '../../../node_modules/layui-layer/dist/layer.js'
import hotTitle from './img/hot-title.png'

const mapStateToProps = (state) => {
    return {
        newsListRecommend: state.reducerNewListRecommend,
        indexNewsList: state.reducerNewList,
        authorMessage: state.reducerUser,
        hotSubjectTopic: state.hotSubjectTopic
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getIndexNewsList, getNewsListRecommend, getAuthorMessage, getHotSubjectTopic}, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
export default class NewsTags extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabState: '0',
            pageNum: 1,
            hotTopBg: ''
        }
    }

    handlePageClick = () => {
        this.setState({pageNum: this.state.pageNum + 1}, () => {
            if (this.state.pageNum - 1 >= this.props.indexNewsList.pageCount) {
                layer.msg('暂无更多新闻 !')
                return false
            } else {
                this.props.actions.getIndexNewsList(this.state.pageNum, 20, '', 2, this.props.location.query.tags)
            }
        })
    }

    componentWillMount() {
        this.props.actions.getHotSubjectTopic({
            id: this.props.location.query.id
        })
    }

    componentDidMount() {
        $(window).scrollTop('0')
        this.props.actions.getNewsListRecommend(3, 50, 6)
        this.props.actions.getIndexNewsList(this.state.pageNum, 20, '', 1, this.props.location.query.tags)
    }

    render() {
        // let authorId = this.props.location.query.id
        const {newsListWidth, newsListRecommend, indexNewsList, hotSubjectTopic} = this.props
        let authorId = this.props.location.query.passportid
        let listData = indexNewsList.inforList
        const newTitle = this.props.intl.formatMessage({id: 'title.hotNews'})
        let authorActive = authorId === undefined ? 'active' : '' // 判断是否有作者id
        let timeTopic = timestampToTime(hotSubjectTopic.createTime).split(' ')[0].split('-')
        return <div className="news-hot-label">
            <div className={`hot-top-bg ${window.location.href.indexOf('id') !== -1 ? 'show' : ''}`} style={{background: `url(${hotSubjectTopic.pcBackImage}) no-repeat center`}}>
                <h6>{hotSubjectTopic.topicName}</h6>
                <span>{timeTopic[1] + '月' + add0(timeTopic[2]) + '日'}</span>
                <div className="masking"></div>
            </div>
            <div className="news-con clearfix">
                <div className={`hot-label ${window.location.href.indexOf('id') !== -1 ? '' : 'show'}`}>
                    <div className="label-title"><span><img src={hotTitle} alt=""/></span><a
                        href="/" target="_blank">火星财经</a> > <p
                        id="hotLabel">{this.props.location.query.tags}</p></div>
                </div>
                <div className="news-list-wrap block-style clearfix">
                    <NewsList tags={true} boxWidth={newsListWidth} newsList={listData}/>
                    <CheckMore onClick={this.handlePageClick}/>
                </div>
                <div className={`new-right hot-label-right ${window.location.href.indexOf('id') !== -1 ? 'hot-top' : ''}`}>
                    <div className={`news-author ${authorActive}`}>
                        {/* <NewAuthorTitle passortid={authorId}/> */}
                    </div>
                    <div className="ad-recomend">
                        {/* <NewsImg imgSize={newImgSize}/> */}
                        <NewsRecommend boxWidth="288px" title={newTitle} newsList={newsListRecommend.inforList}/>
                        {/* <NewsImg imgSize={newImgSize}/> */}
                    </div>
                </div>
            </div>
        </div>
    }
}

NewsTags.defaultProps = {
    newsListWidth: 535,
    newImgSize: {
        width: 330,
        height: 160
    }
}
NewsTags.propTypes = {
    newsListWidth: number.isRequired,
    newImgSize: object.isRequired
}
