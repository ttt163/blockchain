/**
 * Author：liushaozong
 * Time：2018-01-21 21:34
 * Description：index news list
 */
import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import CheckMore from '../../../components/public/CheckMore'
import NewsList from '../../../components/public/NewsList'
import {getIndexNewsList, getNewsDetails} from '../../../actions/news'
import {titleArr} from '../../../public'
import '../../../../node_modules/layui-layer/dist/layer.js'

import './index.scss'

class NewsLeft extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabState: '0',
            pageNum: 1,
            clickCount: 0
        }
    }

    handleTabClick(index) {
        this.setState({tabState: index})
        this.props.actions.getIndexNewsList('', 25, index, 1)
        this.setState({pageNum: 1})
    }

    handlePageClick = () => {
        const clickCount = this.state.clickCount
        if (clickCount < 2) {
            this.setState({
                pageNum: this.state.pageNum + 1,
                clickCount: clickCount + 1
            }, () => {
                if (this.state.pageNum - 1 >= this.props.indexNewsList.pageCount) {
                    layer.msg('暂无更多新闻 !')
                    return false
                } else {
                    this.props.actions.getIndexNewsList(this.state.pageNum, 25, this.state.tabState, 2)
                }
            })
        } else {
            browserHistory.push('/news')
        }
    }

    componentDidMount() {
        this.props.actions.getIndexNewsList('', 25, 0, 1)
    }

    render() {
        let This = this
        const {indexNewsList} = this.props
        let listData = indexNewsList.inforList

        return <div className="index-news-left">
            <ul>
                {titleArr.map((item, index) => {
                    let active = item.value === this.state.tabState ? 'active' : ''
                    return <li onClick={() => {
                        this.handleTabClick(item.value)
                    }} data={index} key={index} className={active}>
                        {item.label}
                        {/* <font className={active}></font> */}
                    </li>
                })}
            </ul>
            <div className="block-style">
                <NewsList boxWidth="350px" main={true} author={true} newsList={listData}/>
                <CheckMore
                    style={{display: `${listData.length === 0 ? 'none' : 'block'}`}}
                    onClick={This.handlePageClick}/>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        indexNewsList: state.reducerNewList
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getIndexNewsList, getNewsDetails}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsLeft)
