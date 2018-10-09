/**
 * Author：liushaozong
 * Time：2018/03/22
 * Description：showSpecial
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Link} from 'react-router'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import Footer from '../../../components/main/Footer'
import {cutString} from '../../../public/index'
import {getSpecialNewsList} from '../../../actions/special'
// import {hashHistory} from 'react-router'

import './../index.scss'
import slogan from './../img/special-slogan.png'
import hxLogo from './../img/special-huoxing.png'
import hotNew from './../img/fh-news.png'
// import newImg from './../img/fh-news.jpg'

class Special extends Component {
    state = {
        current: 1
    }

    componentWillMount() {
        this.props.actions.getSpecialNewsList(1, 15, 12)
    }

    changePages = (page) => {
        this.setState({
            current: page
        })
        this.props.actions.getSpecialNewsList(page, 15, 12)
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    render() {
        const {specialNewsList} = this.props
        let totalCount = specialNewsList.recordCount
        // let currentPage = specialNewsList.currentPage
        return <div className="show-special">
            <div className="special-top news-top">
                <div className="banner-box">
                    <div className="slogan"><img src={slogan} alt=""/></div>
                    <div className="hx-logo"><img src={hxLogo} alt=""/></div>
                </div>
            </div>
            <div className="box-swiper-bottom">
                <div className="fh-news-box news-list-bottom">
                    <div className="fh-news-title clearfix">
                        <h6><img src={hotNew} alt=""/></h6>
                        <Link to={`/showSpecial`}>返回首页</Link>
                    </div>
                    <div className="fh-news-list clearfix">
                        <ul>
                            {
                                specialNewsList.inforList.map((item, index) => {
                                    let img = JSON.parse(item.coverPic)
                                    return (
                                        <li key={index}>
                                            <Link to={`/newsdetail?id=${item.id}`} target="_blank">
                                                <img src={img.pc_subject} alt=""/>
                                                <h6>{item.title}</h6>
                                                <p>{cutString(item.synopsis, 90)}<span>查看详情></span></p>
                                            </Link>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <div className="pagination">
                        <Pagination total={totalCount || 0} current={this.state.current} pageSize={15} onChange={this.changePages}/>
                    </div>
                </div>
            </div>
            <Footer sColor={'#020d35'}/>
        </div>
    }
}
const mapStateToProps = (state) => {
    return {
        specialNewsList: state.reducerSpecialNews
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getSpecialNewsList}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Special)
