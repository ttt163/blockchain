/**
 * Author：tantingting
 * Time：2018/3/30
 * Description：Description
 */
import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {getMarketList, getRate} from '../../../actions/market'
import {formatPrice} from '../../../public'

import {injectIntl} from 'react-intl'

import '../../../containers/Market/index.scss'
import './index.scss'

const mapStateToProps = (state) => {
    return {
        marketList: state.marketList.coinData.coin,
        rate: state.marketList.rate
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getMarketList, getRate}, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
class MarketAside extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currency: '1',
            tend: 'desc'
        }
    }

    componentWillMount() {
        // 稍后优化
        this.props.actions.getMarketList({currentPage: 1, pageSize: 8, myCollect: 0, sort: {column: 'percent_change_24h', order: 'desc'}})
        this.props.actions.getRate({})
    }

    handleSortChange = (order) => {
        this.setState({tend: order})
        this.props.actions.getMarketList({
            currentPage: 1,
            pageSize: 8,
            sort: {column: 'percent_change_24h', order: order},
            isMineable: null,
            myCollect: 0
        })
    }

    toProject(coinId) {
        window.open(`/project?coinid=${coinId}`, '_blank')
    }

    render() {
        const {marketList, rate} = this.props
        const {currency, tend} = this.state
        // const marketTitle = intl.formatMessage({id: 'market.title'}).split(',')
        const marketTitle = ['排名', '名称', '价格', '涨幅']
        let marketListLen8 = marketList.slice(0, 8)
        const symbol = currency === '0' ? '＄' : '￥'
        const price = (price) => {
            if (currency === '0') {
                return price
            } else if (currency === '1') {
                return price * parseFloat(rate.CNY)
            }
        }
        return (
            <div className="aside-market">
                <div className="aside-market-top clearfix">
                    <div className="clearfix">
                        <h5 onClick={() => this.handleSortChange('desc')} className={tend === 'desc' ? 'active' : ''}>涨幅榜</h5>
                        <h5 onClick={() => this.handleSortChange('asc')} className={tend === 'asc' ? 'active' : ''}>跌幅榜</h5>
                    </div>
                    <Link className="more" target="_blank" to="/markets">
                        MORE&nbsp;&nbsp;>
                    </Link>
                </div>
                <div className="market-column-box">
                    <div className="market-box-list">
                        <div className="market-tab">
                            <ul className="table-title-ul clearfix">
                                {marketTitle.map((item, index) => {
                                    return <li key={index}>{item}</li>
                                })}
                            </ul>
                        </div>
                        {
                            marketListLen8.length === 0 ? <div className="loading">
                                暂无相关内容...
                            </div> : <div className="market-tab-list">
                                <table>
                                    <tbody>{marketListLen8.map((item, index) => {
                                        return <tr key={index} onClick={(e) => {
                                            if (e.target.nodeName.toLowerCase() !== 'div') {
                                                this.toProject(item.coin_id)
                                            }
                                        }}>
                                            <td>
                                                {index + 1}
                                                {/* {item.rank} */}
                                            </td>
                                            <td className="coins-name-column grey">
                                                <font className="img-log"><img src={item.icon} alt=""/></font>
                                                {/* <span
                                            className="blue">{`${item.symbol + (item.cn_name ? ('-' + item.cn_name) : '')}`}</span> */}
                                                <span>{!item.cn_name ? item.symbol : item.cn_name}</span>
                                            </td>
                                            <td>
                                                {symbol}
                                                {formatPrice(price(item.price_usd))}
                                            </td>
                                            <td className={`${item.percent_change_24h >= 0 ? 'green' : 'red'}`}>
                                                {item.percent_change_24h + ' %'}
                                            </td>
                                            <td>
                                            </td>
                                        </tr>
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

MarketAside.defaultProps = {
    marketTabData: {
        coinData: {
            coin: [],
            count: 0
        },
        rate: {}
    }
}

export default injectIntl(MarketAside)
