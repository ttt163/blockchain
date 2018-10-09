/**
 * Author：liushaozong
 * Time：2018-01-21 21:34
 * Description：项目资料  货币交易
 */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Select from 'react-select'
import { injectIntl, FormattedNumber } from 'react-intl'
import { getCurrencyParticularsPrice } from '../../../actions/project'
import { getRate } from '../../../actions/market'
import { numTrans, formatPrice } from '../../../public'

import 'react-select/dist/react-select.css'
import './index.scss'

class CurrencyDeal extends Component {
    state = {
        currencyValueOption: '',
        currency: '1'
    }
    handleCurrencyChange = (currencyValueOption) => {
        this.setState({currencyValueOption, currency: currencyValueOption.value})
    }

    componentDidMount() {
        this.props.actions.getCurrencyParticularsPrice(this.props.currencyPrice)
        this.props.actions.getRate()
    }

    render() {
        const {currencyParticularsPrice, intl, market} = this.props
        const particularsType = intl.formatMessage({id: 'currency.particulars.price'}).split(',')
        const {currencyValueOption, currency} = this.state
        const currencyValue = currencyValueOption && currencyValueOption.value
        let currencyPrice = currencyParticularsPrice.data
        let marketCny = market.rate.CNY
        const symbol = currency === '0' ? '＄' : '￥'
        const price = (price) => {
            if (currency === '0') {
                return parseFloat(price)
            } else if (currency === '1') {
                return parseFloat(price) * parseFloat(marketCny)
            }
        }
        // console.log(currencyPrice.price_usd)
        return (
            <div className="currency-deal">
                <div className="kind">
                    <Select
                        name="form-field-name"
                        value={currencyValue || '1'}
                        clearable={false}
                        searchable={false}
                        onChange={this.handleCurrencyChange}
                        options={[
                            {value: '1', label: 'CNY'},
                            {value: '0', label: 'USD'}
                        ]}
                    />
                </div>
                <div className="currency-price">
                    <h6><font style={{fontSize: '28px'}}>{symbol}</font>
                        {/* <FormattedNumber value={price(currencyPrice.price_usd).toFixed(7)}/> */}
                        <FormattedNumber maximumSignificantDigits={5} value={formatPrice(price(currencyPrice.price_usd))}/>
                        {/* {
                            price(currencyPrice.price_usd) > 1 ? <FormattedNumber value={formatPrice(price(currencyPrice.price_usd))}/> : formatPrice(price(currencyPrice.price_usd))
                        } */}
                    </h6>
                    <p className={parseFloat(currencyPrice.percent_change_24h) > 0 ? 'float' : 'float lose'}><FormattedNumber value={currencyPrice.percent_change_24h}/>%</p>
                </div>
                <div className="deal-24">
                    <div className="highest-24">
                        <font>{particularsType[0]}：</font>
                        {
                            currencyPrice.high_price_in_24h === 0 ? 'N/A' : <span>{symbol}<FormattedNumber maximumSignificantDigits={5} value={formatPrice(price(currencyPrice.high_price_in_24h))}/></span>
                        }
                        {/* {
                            currencyPrice.high_price_in_24h === 0 ? 'N/A' : (
                                <span>{symbol}
                                    {
                                        price(currencyPrice.price_usd) > 1 ? <FormattedNumber value={formatPrice(price(currencyPrice.high_price_in_24h))}/> : formatPrice(price(currencyPrice.high_price_in_24h))
                                    }
                                </span>
                            )
                        } */}
                    </div>
                    <div className="lowest-24">
                        <font>{particularsType[1]}：</font>
                        {
                            currencyPrice.low_price_in_24h === 0 ? 'N/A' : <span>{symbol}<FormattedNumber maximumSignificantDigits={5} value={formatPrice(price(currencyPrice.low_price_in_24h))}/></span>
                        }
                        {/* {
                            currencyPrice.low_price_in_24h === 0 ? 'N/A' : (
                                <span>{symbol}
                                    {
                                        price(currencyPrice.price_usd) > 1 ? <FormattedNumber value={formatPrice(price(currencyPrice.low_price_in_24h))}/> : formatPrice(price(currencyPrice.low_price_in_24h))
                                    }
                                </span>
                            )
                        } */}
                    </div>
                </div>
                <div className="market-price">
                    <div className="market-num">
                        <font>{particularsType[2]}</font>
                        {
                            currencyPrice.available_supply === 0 ? '暂无信息' : <span>{symbol}<FormattedNumber
                                value={numTrans(price(currencyPrice.price_usd * currencyPrice.available_supply))}/>{price(currencyPrice.price_usd * currencyPrice.available_supply) > 99999999 ? '亿' : '万'}</span>
                        }
                    </div>
                    <div className="deal-num">
                        <font>{particularsType[3]}</font>
                        <span>{symbol}<FormattedNumber value={numTrans(price(currencyPrice.volume_usd_24h))}/>{price(currencyPrice.price_usd * currencyPrice.available_supply) > 99999999 ? '亿' : '万'}</span>
                    </div>
                </div>
                <div className="sum-issue">
                    <div className="market-quantity">
                        <font>{particularsType[4]}</font>
                        {
                            currencyPrice.available_supply === 0 ? '暂无信息' : <span><FormattedNumber value={numTrans(currencyPrice.available_supply)}/>{currencyPrice.available_supply > 99999999 ? '亿' : '万'}</span>
                        }
                    </div>
                    <div className="issue-num">
                        <font>{particularsType[5]}</font>
                        {
                            currencyPrice.max_supply === 0 ? '暂无信息' : <span><FormattedNumber value={numTrans(currencyPrice.max_supply)}/>{currencyPrice.max_supply > 99999999 ? '亿' : '万'}</span>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currencyParticularsPrice: state.currencyParticularsPriceReducer,
        market: state.marketList
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getCurrencyParticularsPrice, getRate}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CurrencyDeal))
