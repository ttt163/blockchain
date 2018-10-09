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
import {getIndexNewsList, getNewsListRecommend, getUserNewsList} from '../../actions/news'
import {getAuthorMessage} from '../../actions/user'

import './index.scss'
import CheckMore from '../../components/public/CheckMore'
import NewsList from '../../components/public/NewsList'
import NewsRecommend from '../../components/public/NewsRecommend'
import {titleArr} from '../../public'
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
            getAuthorMessage,
            getUserNewsList
        }, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
export default class News extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabState: '0',
            pageNum: 1
        }
    }

    handleTabClick(index) {
        this.setState({tabState: index})
        this.props.actions.getIndexNewsList('', 10, index, 1)
        this.setState({pageNum: 1})
    }

    handlePageClick() {
        this.setState({pageNum: this.state.pageNum + 1}, () => {
            if (this.state.pageNum - 1 >= this.props.indexNewsList.pageCount) {
                layer.msg('暂无更多新闻 !')
            } else {
                this.props.actions.getIndexNewsList(this.state.pageNum, 10, this.state.tabState, 2)
            }
        })
    }

    componentDidMount() {
        const {query} = this.props.location
        if (query.id) {
            const id = query.id
            console.log(id)
            this.setState({tabState: id})
            this.props.actions.getIndexNewsList('', 10, id, 1)
        } else {
            this.props.actions.getIndexNewsList('', 10, 0, 1)
        }
        this.props.actions.getNewsListRecommend(3, 50, 6)
    }

    render() {
        const {newsListWidth, indexNewsList, newsListRecommend} = this.props
        let listData = indexNewsList.inforList
        const newTitle = this.props.intl.formatMessage({id: 'title.hotNews'})
        return <div className="news">
            <div className={`news-nav`}>
                <div className="nav-box">
                    {titleArr.map((item, index) => {
                        let active = item.value === this.state.tabState.toString() ? 'active' : ''
                        return <a onClick={() => {
                            this.handleTabClick(item.value)
                        }} data={index} key={index} className={active}>
                            {item.label}
                            <font className={active}/></a>
                    })}
                </div>
            </div>
            <div className="news-con news-box-con clearfix">
                <div className="news-list-wrap block-style clearfix">
                    <NewsList tags={true} boxWidth={newsListWidth} newsList={listData}/>
                    <CheckMore onClick={() => {
                        this.handlePageClick()
                    }}/>
                </div>
                <div className="new-right">
                    <div className="ad-recomend">
                        <NewsRecommend boxWidth="288px" title={newTitle} newsList={newsListRecommend.inforList}/>
                    </div>
                </div>
            </div>
        </div>
    }
}

News.defaultProps = {
    newsListWidth: 535,
    newImgSize: {
        width: 330,
        height: 160
    }
}
News.propTypes = {
    newsListWidth: number.isRequired,
    newImgSize: object.isRequired
}
