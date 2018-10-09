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

import './index.scss'
import NewsList from '../../components/public/NewsList'
import NewsRecommend from '../../components/public/NewsRecommend'
import '../../../node_modules/layui-layer/dist/layer.js'

class NewsPrimer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabState: 5,
            pageNum: 1
        }
    }

    handlePageClick = () => {
        this.setState({pageNum: this.state.pageNum + 1}, () => {
            if (this.state.pageNum - 1 >= this.props.indexNewsList.pageCount) {
                layer.msg('暂无更多新闻 !')
                return false
            } else {
                this.props.actions.getIndexNewsList(this.state.pageNum, 10, this.state.tabState, 2)
            }
        })
    }

    componentDidMount() {
        this.props.actions.getIndexNewsList('', 10, 5, 1)
        this.props.actions.getNewsListRecommend(3, 50, 6)
    }

    render() {
        const {newsListWidth, indexNewsList, newsListRecommend} = this.props
        let listData = indexNewsList.inforList
        const newTitle = this.props.intl.formatMessage({id: 'title.hotNews'})

        return <div className="news">
            <div className="no-tab"></div>
            <div className="news-con">
                <div className="news-list-wrap block-style clearfix">
                    <NewsList tags={true} boxWidth={newsListWidth} newsList={listData}/>
                    {
                        <a className="new-left-more" onClick={this.handlePageClick}>查看更多 +</a>
                    }
                </div>
                <div className="ad-recomend">
                    {/* <NewsImg imgSize={newImgSize}/> */}
                    <NewsRecommend boxWidth="288px" title={newTitle} newsList={newsListRecommend.inforList}/>
                    {/* <NewsImg imgSize={newImgSize}/> */}
                </div>
            </div>
        </div>
    }
}

NewsPrimer.defaultProps = {
    newsListWidth: 535,
    newImgSize: {
        width: 330,
        height: 160
    }
}
NewsPrimer.propTypes = {
    newsListWidth: number.isRequired,
    newImgSize: object.isRequired
}
const mapStateToProps = (state) => {
    return {
        newsListRecommend: state.reducerNewListRecommend,
        indexNewsList: state.reducerNewList
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getIndexNewsList, getNewsListRecommend}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(NewsPrimer))
