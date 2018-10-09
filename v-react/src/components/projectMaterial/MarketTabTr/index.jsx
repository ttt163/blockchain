/**
 * Author：liushaozong
 * Time：2018-01-21 21:34
 * Description：项目资料  市场行情 表格数据
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {object} from 'prop-types'
import {formatPrice} from '../../../public/index'

import './index.scss'

const mapStateToProps = (state) => {
    return {
        exchangeList: state.exchangeListReducer,
        marketList: state.marketList
    }
}

@connect(mapStateToProps)
class MarketTabBox extends Component {
    render() {
        const {exchangeItem, marketList} = this.props
        return <tr className="market-table-tr">
            <td>
                <span>{exchangeItem.rank}</span>
            </td>
            <td className="blue">
                {/* <img src={props.logo} alt=""/> */}
                <span>{exchangeItem.exchange_name}</span>
            </td>
            <td className="blue">
                <span>{exchangeItem.pair}</span>
            </td>
            <td>
                {/* <span>￥{parseFloat(exchangeItem.price * marketList.rate.CNY).toFixed(7)}</span> */}
                <span>￥{formatPrice(parseFloat(exchangeItem.price * marketList.rate.CNY))}</span>
            </td>
            <td>
                <span>{parseFloat(exchangeItem.volume_in_24h).toFixed(7)}</span>
            </td>
            <td>
                <span>{exchangeItem.volume_rate_24h}%</span>
            </td>
            <td>
                <span>{exchangeItem.updated}</span>
            </td>
        </tr>
    }
}

MarketTabBox.defaultProps = {
    exchangeItem: {
        'id': 0,
        'coin_id': 'Loading', // 币ID
        'rank': 0, // 市值排名
        'exchange_name': 'Loading', // 交易所名字
        'pair': 'Loading', // 交易对
        'volume_in_24h': 'Loading', // 24小时成交额，美元
        'price': 'Loading', // 单价，美元
        'volume_rate_24h': 'Loading', // 成交量占比
        'updated': 'Loading' // 更新时间
    }
}

MarketTabBox.propTypes = {
    exchangeItem: object.isRequired
}

export default MarketTabBox
