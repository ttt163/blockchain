/**
 * Author：zhoushuanglong
 * Time：2018-02-09 00:02
 * Description：exchage list
 */

import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Pagination from 'rc-pagination'

import './index.scss'
import 'rc-pagination/assets/index.css'

import BazaaryMarket from '../../components/projectMaterial/BazaaryMarket'
import ProjectCoinDetail from '../Project/ProjectCoinDetail'

import {getExchangeList} from '../../actions/project'
import {getRate} from '../../actions/market'

const mapStateToProps = (state) => {
    return {
        exchangeList: state.exchangeListReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getExchangeList, getRate}, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ExchangeList extends Component {
    state = {
        pageSize: 20
    }

    changePages = (page) => {
        this.props.actions.getExchangeList(this.props.location.query.coinid, page, this.state.pageSize)
    }

    componentDidMount() {
        $(window).scrollTop('0')

        this.props.actions.getRate({})
        this.props.actions.getExchangeList(this.props.location.query.coinid, 1, this.state.pageSize)
    }

    render() {
        const {coinid} = this.props.location.query
        const {exchangeList} = this.props
        return [
            <ProjectCoinDetail key="projectCoinDetail" coinid={coinid}/>,
            <div className="exchange-list-wrap block-style" key="exchangeListWrap">
                <BazaaryMarket exchangeList={exchangeList} hideMoreBtn={true}/>
                <div className="pagination">
                    <Pagination
                        total={exchangeList.recordCount || 0}
                        current={exchangeList.currentPage || 0}
                        pageSize={this.state.pageSize}
                        onChange={this.changePages}/>
                </div>
            </div>
        ]
    }
}
