/**
 * Author：zhoushuanglong
 * Time：2018-01-20 21:34
 * Description：Header nav
 */

import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import Cookies from 'js-cookie'

import NewsList from '../../../components/public/NewsList'
import CheckMore from '../../../components/public/CheckMore'
import {getExchangeList, getCurrencyNews, getCurrencyParticulars} from '../../../actions/project'
import {getRate} from '../../../actions/market'
import '../../../../node_modules/layui-layer/dist/layer.js'

import './index.scss'
import huobiLogo from '../img/huobi-logo.jpg'

const mapStateToProps = (state) => {
    return {
        indexNewsList: state.reducerNewList,
        newsCorrelation: state.reducerNewCorrelation,
        currencyParticulars: state.currencyParticularsReducer,
        exchangeList: state.exchangeListReducer,
        marketList: state.marketList,
        currencyNews: state.currencyNewsReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getExchangeList, getRate, getCurrencyNews, getCurrencyParticulars}, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
export default class RelateNews extends Component {
    state = {
        pageNews: 1
    }

    componentWillMount() {
        let passportId = Cookies.get('hx_user_token') !== undefined ? Cookies.get('hx_user_id') : ''
        this.props.actions.getCurrencyParticulars(this.props.location.query.coinid, passportId, (data) => {
            this.props.actions.getCurrencyNews(data.data.cn_name, 1, 10)
        })
        this.props.actions.getRate({})
        this.props.actions.getExchangeList(this.props.location.query.coinid, 1, 10)
    }

    goMore = () => {
        /* browserHistory.push({
            pathname: `/exchangelist`,
            query: {
                coinid: this.props.location.query.coinid
            }
        }) */

        window.open(`/exchangelist?coinid=${this.props.location.query.coinid}`, '_blank')
    }

    componentDidUpdate() {
        if (this.state.pageNews >= this.props.currencyNews.pageCount) {
            $('.correlation-news-more').hide()
        } else {
            $('.correlation-news-more').show()
        }
    }

    handlePageClick = () => {
        if (this.state.pageNews >= this.props.currencyNews.pageCount) {
            layer.msg('暂无更多! ')
            return false
        }
        let tag = this.props.currencyParticulars.data.cn_name
        this.setState({pageNews: this.state.pageNews + 1}, function () {
            this.props.actions.getCurrencyNews(tag, this.state.pageNews, 10, 'more')
        })
    }

    render() {
        const {exchangeList, marketList, currencyNews} = this.props
        const marketTitle = this.props.intl.formatMessage({id: 'market.correlation.title'}).split(',')
        return <div className="market-correlation-news clearfix">
            <div className="news-let">
                <NewsList tags={true} boxWidth="440px" newsList={currencyNews.inforList}/>
                <CheckMore onClick={this.handlePageClick}/>
            </div>
            <div className="news-right">
                <ul className="correlation-news-title">
                    {
                        marketTitle.map((item, index) => {
                            return (
                                <li key={index}>{item}</li>
                            )
                        })
                    }
                </ul>
                <div className="market-correlation-list">
                    <table>
                        <tbody>{exchangeList.inforList.map(function (item, index) {
                            if (index <= 10) {
                                return <tr key={index}>
                                    <td>
                                        <span className="huobi-logo" style={{display: 'none'}}>
                                            <img src={huobiLogo} alt=""/>
                                        </span>
                                        {item.exchange_name}
                                    </td>
                                    <td>{item.pair}</td>
                                    <td>¥{parseInt(item.price * marketList.rate.CNY)}</td>
                                    <td>{item.volume_rate_24h}%</td>
                                </tr>
                            }
                        })}
                        </tbody>
                    </table>
                    <CheckMore style={{borderTop: '1px solid #eee', marginRight: '10px'}} onClick={this.goMore}/>
                </div>
            </div>
        </div>
    }
}
