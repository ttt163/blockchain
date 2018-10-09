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
import {getIndexNewsList, getNewsListRecommend} from '../../actions/news'
import {getAuthorMessage} from '../../actions/user'

import './index.scss'
import CheckMore from '../../components/public/CheckMore'
import NewsList from '../../components/public/NewsList'
import NewAuthorTitle from '../../components/newCoins/NewAuthor'
import NewsRecommend from '../../components/public/NewsRecommend'
import '../../../node_modules/layui-layer/dist/layer.js'

const mapStateToProps = (state) => {
    return {
        newsListRecommend: state.reducerNewListRecommend,
        indexNewsList: state.reducerNewList,
        authorMessage: state.reducerUser
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            getIndexNewsList,
            getNewsListRecommend,
            getAuthorMessage
        }, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
export default class NewsAuthor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pageNum: 1
        }
    }

    handlePageClick() {
        let userId = this.props.location.query.userId
        this.setState({pageNum: this.state.pageNum + 1}, () => {
            if (this.state.pageNum - 1 >= this.props.indexNewsList.pageCount) {
                layer.msg('暂无更多新闻 !')
            } else {
                this.props.actions.getIndexNewsList(this.state.pageNum, 10, this.state.tabState, 2, '', userId)
            }
        })
    }

    componentDidMount() {
        let userId = this.props.location.query.userId
        this.props.actions.getIndexNewsList(1, 10, '', 1, '', userId)
        this.props.actions.getNewsListRecommend(3, 50, 6)
    }

    render() {
        let userId = this.props.location.query.userId
        const {newsListWidth, indexNewsList, newsListRecommend} = this.props
        let listData = indexNewsList.inforList
        console.log(newsListRecommend)
        const newTitle = this.props.intl.formatMessage({id: 'title.hotNews'})
        return <div className="news">
            <div className="news-con news-box-con clearfix">
                <div className="news-list-wrap block-style clearfix">
                    <NewsList tags={true} boxWidth={newsListWidth} newsList={listData} noHead/>
                    <CheckMore onClick={() => {
                        this.handlePageClick()
                    }}/>
                </div>
                <div className="new-right">
                    <div className={`news-author`}>
                        <NewAuthorTitle passportid={userId}/>
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

NewsAuthor.defaultProps = {
    newsListWidth: 535,
    newImgSize: {
        width: 330,
        height: 160
    }
}
NewsAuthor.propTypes = {
    newsListWidth: number.isRequired,
    newImgSize: object.isRequired
}
