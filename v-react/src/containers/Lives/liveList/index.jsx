/**
 * Author：liushaozong
 * Time：2018/02/27
 * Description：search
 */
import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Link, browserHistory} from 'react-router'
import {injectIntl} from 'react-intl'
import Cookies from 'js-cookie'
// import liveImg from '../img/live-img.jpg'
import newsLive from '../img/news-live-title.png'
import {getLivesList} from '../../../actions/live'
import liveState01 from '../img/live-start.png'
import liveState02 from '../img/live-in.png'
import liveState03 from '../img/live-over.png'
import Pagination from 'rc-pagination'
import './index.scss'
import 'rc-pagination/assets/index.css'
class LiveList extends Component {
    state = {
        searchVal: this.props.location.query.val,
        searchListState: true,
        page: 1
    }

    componentWillMount() {
        this.props.actions.getLivesList({
            status: '-3',
            pageSize: 9,
            currentPage: 1
        })
    }

    componentDidMount() {
        Cookies.set('castId', this.props.location.query.castId)
        Cookies.set('status', this.props.location.query.status)
    }

    liveListState(state) {
        if (state === 0) {
            return <span><img src={liveState01} alt=""/></span>
        } else if (state === 1) {
            return <span><img src={liveState02} alt=""/></span>
        } else if (state === 2) {
            return <span><img src={liveState03} alt=""/></span>
        }
    }

    liveHref(castId, status) {
        browserHistory.push({
            pathname: '/live/liveDetails',
            query: {
                castId: castId,
                status: status
            }
        })
        Cookies.set('castId', castId)
        Cookies.set('status', status)
    }

    changePages = (page) => {
        this.setState({
            current: page
        })
        this.props.actions.getLivesList({
            status: '-3',
            pageSize: 9,
            currentPage: page
        })
    }

    render() {
        const {livesList} = this.props
        let totalCount = livesList.recordCount
        let currentPage = livesList.currentPage
        return (<div className="live-cont-box clearfix">
            <div className="live-title"><img src={newsLive} alt=""/></div>
            <div className="live-tab clearfix">
                {
                    livesList.inforList.map((item, index) => {
                        return (
                            <div className="live-list" key={index}>
                                <Link onClick={() => {
                                    this.liveHref(item.webcast.castId, item.webcast.status)
                                }}>
                                    <div className="list-state">{this.liveListState(item.webcast.status)}</div>
                                    <div className="list-img"><img src={item.webcast.coverPic} alt=""/></div>
                                    <div className="list-cont">
                                        <p className="title">{item.webcast.title}</p>
                                        <p className="describe">{item.webcast.desc}</p>
                                    </div>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
            <div className="pagination">
                <Pagination total={totalCount || 0} current={currentPage || 0} pageSize={9} onChange={this.changePages}/>
            </div>
        </div>)
    }
}
const mapStateToProps = (state) => {
    return {
        livesList: state.livesList
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getLivesList}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(LiveList))
