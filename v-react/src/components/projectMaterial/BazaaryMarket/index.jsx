/**
 * Author：liushaozong
 * Time：2018-01-21 21:34
 * Description：项目资料  市场行情
 */

import React, {Component} from 'react'
// import {browserHistory} from 'react-router'
import {injectIntl} from 'react-intl'
import {object} from 'prop-types'

import './index.scss'

import MarketTabTr from '../MarketTabTr'
import CheckMore from '../../../components/public/CheckMore'

@injectIntl
export default class BazaaryMarket extends Component {
    state = {
        currencyActive: 0
    }

    goMore = () => {
        /* browserHistory.push({
            pathname: '/exchangelist',
            query: {
                coinid: this.props.coinid
            }
        }) */

        window.open(`/exchangelist?coinid=${this.props.coinid}`, '_blank')
    }

    render() {
        let This = this
        const {intl, exchangeList, hideMoreBtn} = this.props
        const more = intl.formatMessage({id: 'more'})
        const currency = intl.formatMessage({id: 'currency'}).split(',')
        const marketTab = intl.formatMessage({id: 'market.tab'}).split(',')
        return (
            <div className="bazaary-market">
                <div className="bazaary-market-tab-heade" style={{display: 'none'}}>
                    <ul className="clearfix">
                        {currency.map(function (item, index) {
                            let active = index === This.state.currencyActive ? 'active' : ''
                            return (
                                <li className={active} key={index}>{item}<span className={active}></span></li>
                            )
                        })}
                    </ul>
                    <div className="currency-more">{more}</div>
                </div>
                <div className="market-tab-box">
                    <table>
                        <thead>
                            <tr className="sort-heade">
                                {marketTab.map(function (item, index) {
                                    return (
                                        <td key={index}><span>{item}</span></td>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>{exchangeList.inforList.map(function (item, index) {
                            if (index <= 10) {
                                return <MarketTabTr key={index} exchangeItem={item}/>
                            }
                        })}
                        </tbody>
                    </table>
                    <CheckMore
                        style={{display: hideMoreBtn && 'none', borderTop: '1px solid #eee'}}
                        onClick={this.goMore}/>
                </div>
            </div>
        )
    }
}

BazaaryMarket.defaultProps = {
    'pageSize': 0,
    'recordCount': 0,
    'currentPage': 0,
    'pageNum': 0,
    'inforList': [
        {
            'id': 0,
            'coin_id': 'Loading',
            'rank': 0,
            'exchange_name': 'Loading',
            'pair': 'Loading',
            'volume_in_24h': 'Loading',
            'price': 'Loading',
            'volume_rate_24h': 'Loading',
            'updated': 'Loading'
        }
    ]
}

BazaaryMarket.propTypes = {
    exchangeList: object.isRequired
}
