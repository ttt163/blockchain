/**
 * Author：liushaozong
 * Time：2018/02/27
 * Description：search
 */
import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import Pagination from 'rc-pagination'
import NewsRecommend from '../../components/public/NewsRecommend'
import {getNewsListRecommend} from '../../actions/news'
import NewsList from '../../components/public/NewsList'
import {browserHistory} from 'react-router'
import {getNewsSearch} from '../../actions/newsSearch'

import './index.scss'
import 'rc-pagination/assets/index.css'
// import logo from './img/logo.png'

class Search extends Component {
    state = {
        searchVal: this.props.location.query.val,
        searchListState: true
    }
    changePages = (page) => {
        this.props.actions.getNewsSearch(page, 10, this.state.searchVal)
    }
    inputOnFocus = () => {
        this.setState({searchListState: true})
    }

    inputOnBlur = () => {
        this.setState({searchListState: false})
    }

    componentWillMount() {
        this.props.actions.getNewsSearch(1, 10, this.props.location.query.val)
    }

    componentDidMount() {
        $(window).scrollTop('0')
        this.props.actions.getNewsListRecommend(3, 50, 6)
        document.addEventListener('keydown', (event) => {
            if (this.state.searchListState && event.keyCode === 13) {
                browserHistory.push({
                    pathname: `/search`,
                    query: {
                        val: this.refs.listInput.value
                    }
                })
                this.props.actions.getNewsSearch(1, 10, this.refs.listInput.value)
            }
        })
    }

    render() {
        const {newsListRecommend, newsSearch} = this.props
        let listData = newsSearch.inforList
        const newTitle = this.props.intl.formatMessage({id: 'title.hotNews'})
        return <div className="search-content">
            <div className="search-content-left">
                <div className="search-import">
                    <input type="text" ref="listInput" className="search-input" defaultValue={this.props.location.query.val} placeholder="输入关键词搜索" onBlur={ ::this.inputOnBlur } onFocus={ ::this.inputOnFocus }/>
                    <div className="result-num">约找到<span>{newsSearch.totalCount}</span>个结果</div>
                </div>
                <div className="search-result-list">
                    <NewsList search={true} tags={true} boxWidth="570px" newsList={listData} keyword = {this.props.location.query.val} />
                    <div style={{clear: 'both'}}></div>
                </div>
                <div className="pagination">
                    <Pagination
                        total={newsSearch.totalCount || 0} current={newsSearch.currentIndex || 0}
                        pageSize={10}
                        onChange={this.changePages}/>
                </div>
            </div>
            <div className="search-content-right">
                <NewsRecommend boxWidth="300px" title={newTitle} newsList={newsListRecommend.inforList}/>
            </div>
        </div>
    }
}
const mapStateToProps = (state) => {
    return {
        newsListRecommend: state.reducerNewListRecommend,
        indexNewsList: state.reducerNewList,
        newsSearch: state.newsSearch
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getNewsListRecommend, getNewsSearch}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Search))
