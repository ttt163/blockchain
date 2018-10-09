import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {FormattedMessage, injectIntl} from 'react-intl'
import {browserHistory} from 'react-router'
import Cookies from 'js-cookie'
import qs from 'qs'

import Pagination from 'rc-pagination'
import UserArticle from '../../../components/public/UserArticle'

import {getMyNewsList, getNewsListColumn, clearNews} from '../../../actions/news'

import attentionTitle from '../img/articleTitleImg.png'
import attentionCancel from '../img/attention-cancel.png'

import './index.scss'
import 'rc-pagination/assets/index.css'

const mapStateToProps = (state) => ({
    reducerMyNews: state.reducerMyNews,
    reducerColumnNews: state.reducerColumnNews
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({getMyNewsList, getNewsListColumn, clearNews}, dispatch)
})

let updated = false

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class Article extends Component {
    componentWillUpdate() {
        const {actions, location, articletype} = this.props
        if (sessionStorage.getItem(`${location.pathname}`) && qs.stringify(location.query) !== sessionStorage.getItem(`${location.pathname}`) && !updated) {
            updated = true
            let obj = {
                passportId: Cookies.get('hx_user_id'),
                token: Cookies.get('hx_user_token'),
                currentPage: 1,
                pageSize: 10,
                status: articletype === 'userMyArticle' ? 4 : 1,
                ...location.query
            }
            let fn = () => {
                updated = false
            }
            articletype === 'userMyArticle' ? actions.getMyNewsList(obj, fn) : actions.getNewsListColumn(obj, fn)
        }
    }

    componentDidMount() {
        const {actions, location, articletype} = this.props
        let page = location.query.currentPage || 1
        let obj = {
            passportId: Cookies.get('hx_user_id'),
            token: Cookies.get('hx_user_token'),
            currentPage: page,
            pageSize: 10,
            status: articletype === 'userMyArticle' ? 4 : 1
        }
        articletype === 'userMyArticle' ? actions.getMyNewsList(obj) : actions.getNewsListColumn(obj)
    }

    componentWillMount() {
        updated = false
    }

    changePage(current, pageSize) {
        const {actions, location, articletype} = this.props
        sessionStorage.setItem(`${location.pathname}`, qs.stringify(location.query))
        browserHistory.push({
            pathname: `${articletype}`,
            query: {
                currentPage: current
            }
        })
        let obj = {
            passportId: Cookies.get('hx_user_id'),
            token: Cookies.get('hx_user_token'),
            currentPage: current,
            pageSize: 10,
            status: articletype === 'userMyArticle' ? 4 : 1
        }
        articletype === 'userMyArticle' ? actions.getMyNewsList(obj) : actions.getNewsListColumn(obj)
    }

    render() {
        const {articletype, reducerMyNews, reducerColumnNews} = this.props
        let info = articletype === 'userMyArticle' ? reducerMyNews : reducerColumnNews
        const {recordCount, currentPage, pageSize, inforList} = info
        let realInfoList = inforList.filter((d, i) => d.status !== -1)
        return <div className="my-article">
            <div className="attention-head">
                <div className="project-title">
                    <img src={articletype === 'userMyArticle' ? attentionTitle : attentionCancel} alt=""/>
                    {
                        articletype === 'userMyArticle' ? <FormattedMessage id="attention.article"/> : <FormattedMessage id="attention.collection"/>
                    }
                    {/* <span className="num">(123 个) </span> */}
                </div>
                {/* <div className="search-content">
                    <input type="text" placeholder="输入作者名称"/>
                    <img src={searchImg} alt=""/>
                </div> */}
            </div>
            <div className="article-content">
                {
                    recordCount > 0 && realInfoList.length !== 0 && realInfoList.map((d, i) => {
                        return (
                            <UserArticle key={i} article={d} modalname={articletype}/>
                        )
                    })
                }
                {
                    realInfoList.length === 0 && <div className="noArticles">您还没有{articletype === 'userMyArticle' ? '发布' : '收藏'}文章</div>
                }
            </div>
            {
                recordCount > 0 && realInfoList.length !== 0 && <div className="pagination">
                    <Pagination
                        total={recordCount}
                        current={currentPage}
                        pageSize={pageSize}
                        hideOnSinglePage={true}
                        showQuickJumper={true}
                        show
                        onChange={(current, pageSize) => {
                            this.changePage(current, pageSize)
                        }}
                    />
                </div>
            }
        </div>
    }
}
