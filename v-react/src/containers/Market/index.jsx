/**
 * Author：liushaozong
 * Time：2017/7/26
 * Description：market
 */

import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'

import {getMarketList, getRate, getAttentionCurrency} from '../../actions/market'
import {numTrans, formatPrice} from '../../public'

import {injectIntl, FormattedNumber} from 'react-intl'
import Pagination from 'rc-pagination'
import Select from 'react-select'

import 'react-select/dist/react-select.css'
import './index.scss'
import 'rc-pagination/assets/index.css'
import search from './img/search-btn.png'
import noDataImg from './img/no-data-img.png'

const mapStateToProps = (state) => {
    return {
        marketList: state.marketList.coinData.coin,
        totalCount: state.marketList.coinData.count,
        currentPage: state.marketList.coinData.currentPage,
        rate: state.marketList.rate,
        attentionCurrency: state.marketList.coinData.coin,
        userAttention: state.marketList.userAttention
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getMarketList, getRate, getAttentionCurrency}, dispatch)
    }
}

let timer = ''

@connect(mapStateToProps, mapDispatchToProps)
class Market extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            selectedOption: '',
            sortValueOption: '',
            currencyValueOption: '',
            current: 1,
            currency: '1',
            sortColumn: 'rank',
            isMineable: null,
            filterValue: '',
            tend: 'asc',
            statusAttention: 0,
            allStatus: 1
        }
    }

    componentWillMount() {
        // 稍后优化
        this.props.actions.getMarketList({currentPage: 1, myCollect: 0})
        this.props.actions.getRate({})
    }

    componentDidMount() {
        const {filterValue, sortColumn, isMineable, tend} = this.state
        timer = setInterval(() => {
            let myCollect = 0
            let passportId = Cookies.get('hx_user_id') === undefined ? '' : Cookies.get('hx_user_id')
            if (this.state.allStatus === 1) {
                myCollect = 0
            } else if (myCollect === 0 && passportId !== undefined) {
                myCollect = 1
            }
            this.props.actions.getMarketList({
                currentPage: this.props.currentPage,
                sort: {column: sortColumn, order: tend},
                isMineable: isMineable,
                value: filterValue,
                myCollect: myCollect
            })
        }, 60000)
        setInterval(() => {
            this.props.actions.getRate({})
        }, 60000)
    }

    changePages = (page) => {
        let myCollect = 0
        let passportId = Cookies.get('hx_user_id') === undefined ? '' : Cookies.get('hx_user_id')
        if (this.state.allStatus === 1) {
            myCollect = 0
        } else if (myCollect === 0 && passportId !== undefined) {
            myCollect = 1
        }
        const {isMineable, sortColumn, tend, filterValue} = this.state
        this.setState({
            current: page
        })
        this.props.actions.getMarketList({
            currentPage: page,
            sort: {column: sortColumn, order: tend},
            isMineable: isMineable,
            value: filterValue,
            myCollect: myCollect
        })

        clearInterval(timer)

        timer = setInterval(() => {
            this.props.actions.getMarketList({
                currentPage: page,
                sort: {column: sortColumn, order: tend},
                isMineable: isMineable,
                value: filterValue,
                myCollect: myCollect
            })
        }, 60000)
    }

    attentionCurrency = (e) => {
        let coinId = e.target.getAttribute('id')
        let status = e.target.getAttribute('data-type')
        if (Cookies.get('hx_user_token') !== undefined) {
            if (status === '1') {
                this.setState({statusAttention: 0})
                // 取消关注
                this.props.actions.getAttentionCurrency(coinId, Cookies.get('hx_user_id'), Cookies.get('hx_user_token'), -1)
            } else if (status === '0') {
                // 关注
                this.setState({statusAttention: 1})
                this.props.actions.getAttentionCurrency(coinId, Cookies.get('hx_user_id'), Cookies.get('hx_user_token'), 1)
            }
        } else {
            layer.msg('请登录后，再关注')
        }
    }

    userAttentionCurrency = () => {
        let myCollect = Cookies.get('hx_user_id') === undefined ? 0 : 1
        if (Cookies.get('hx_user_token') !== undefined) {
            this.setState({allStatus: 0})
            this.props.actions.getMarketList({currentPage: 1, myCollect: myCollect})
        } else {
            layer.msg('请登录后，再查看我的关注')
        }
    }
    allAttentionCurrency = () => {
        this.setState({allStatus: 1})
        this.props.actions.getMarketList({currentPage: 1, myCollect: 0})
    }

    handleSortChange = (sortValueOption) => {
        let myCollect = 0
        let passportId = Cookies.get('hx_user_id') === undefined ? '' : Cookies.get('hx_user_id')
        if (this.state.allStatus === 1) {
            myCollect = 0
        } else if (myCollect === 0 && passportId !== undefined) {
            myCollect = 1
        }
        const {current, isMineable} = this.state
        let column = sortValueOption.value.split('-')[0]
        let tend = sortValueOption.tend
        this.setState({
            sortValueOption: sortValueOption,
            sortColumn: column,
            tend: tend
        })
        this.props.actions.getMarketList({
            currentPage: current,
            sort: {column: column, order: tend},
            isMineable: isMineable,
            myCollect: myCollect
        })
        clearInterval(timer)

        timer = setInterval(() => {
            this.props.actions.getMarketList({
                currentPage: this.props.currentPage,
                sort: {column: column, order: tend},
                isMineable: isMineable,
                value: this.state.filterValue,
                myCollect: myCollect
            })
        }, 60000)
    }

    handleMiningChange = (selectedOption) => {
        let myCollect = 0
        let passportId = Cookies.get('hx_user_id') === undefined ? '' : Cookies.get('hx_user_id')
        if (this.state.allStatus === 1) {
            myCollect = 0
        } else if (myCollect === 0 && passportId !== undefined) {
            myCollect = 1
        }
        const {current, sortColumn, tend, filterValue} = this.state
        let column = selectedOption.value
        this.setState({
            selectedOption: selectedOption,
            isMineable: column
        })
        this.props.actions.getMarketList({
            currentPage: current,
            sort: {
                column: sortColumn,
                order: tend
            },
            isMineable: column,
            myCollect: myCollect
        })

        clearInterval(timer)

        timer = setInterval(() => {
            this.props.actions.getMarketList({
                currentPage: current,
                sort: {column: sortColumn, order: tend},
                isMineable: column,
                value: filterValue,
                myCollect: myCollect
            })
        }, 60000)
    }

    filterChange(e) {
        let myCollect = 0
        let passportId = Cookies.get('hx_user_id') === undefined ? '' : Cookies.get('hx_user_id')
        if (this.state.allStatus === 1) {
            myCollect = 0
        } else if (myCollect === 0 && passportId !== undefined) {
            myCollect = 1
        }
        clearInterval(timer)
        const {sortColumn, isMineable, tend} = this.state
        let value = e.target.value.toUpperCase()
        if (value.trim() !== '') {
            this.setState({
                filterValue: value
            }, () => {
                this.props.actions.getMarketList({value: value})
            })
        } else {
            this.props.actions.getMarketList({
                currentPage: this.props.currentPage,
                sort: {column: sortColumn, order: tend},
                isMineable: isMineable,
                value: value,
                myCollect: myCollect
            })
            this.setState({filterValue: ''})
            timer = setInterval(() => {
                this.props.actions.getMarketList({
                    currentPage: this.props.currentPage,
                    sort: {column: sortColumn, order: tend},
                    isMineable: isMineable,
                    value: value,
                    myCollect: myCollect
                })
            }, 60000)
        }
    }

    clickToSearch = () => {
        let myCollect = 0
        let passportId = Cookies.get('hx_user_id') === undefined ? '' : Cookies.get('hx_user_id')
        if (this.state.allStatus === 1) {
            myCollect = 0
        } else if (myCollect === 0 && passportId !== undefined) {
            myCollect = 1
        }
        this.props.actions.getMarketList({value: this.state.filterValue, myCollect: myCollect})
    }

    handleCurrencyChange = (currencyValueOption) => {
        this.setState({
            currencyValueOption: currencyValueOption,
            currency: currencyValueOption.value
        })
    }

    chartOption = (data) => {
        let datas = data.split(',')
        let option = {
            xAxis: {
                show: false,
                type: 'category'
            },
            yAxis: {
                min: Math.min.apply(null, datas) / 1.1,
                max: Math.max.apply(null, datas) * 1.1,
                show: false
            },
            series: [{
                showSymbol: false,
                data: datas,
                type: 'line'
            }],
            color: ['#379dfc']
        }
        return option
    }

    toProject(coinId) {
        window.open(`/project?coinid=${coinId}`, '_blank')
    }

    render() {
        const {intl, marketList, totalCount, rate, currentPage} = this.props
        // console.log(marketList)
        const {selectedOption, sortValueOption, currencyValueOption, currency} = this.state
        const value = selectedOption && selectedOption.value
        const sortValue = sortValueOption && sortValueOption.value
        const currencyValue = currencyValueOption && currencyValueOption.value
        const marketTitle = intl.formatMessage({id: 'market.title'}).split(',')
        const marketSort = intl.formatMessage({id: 'market.sort'}).split(',')
        const symbol = currency === '0' ? '＄' : '￥'
        const price = (price) => {
            if (currency === '0') {
                return price
            } else if (currency === '1') {
                return price * parseFloat(rate.CNY)
            }
        }
        const marketSortItem = [
            {value: 'percent_change_24h-d', tend: 'desc', id: marketSort[0]},
            {value: 'percent_change_24h-a', tend: 'asc', id: marketSort[1]},
            {value: 'rank-a', tend: 'asc', id: marketSort[2]},
            {value: 'rank-d', tend: 'desc', id: marketSort[3]},
            {value: 'price_usd-d', tend: 'desc', id: marketSort[4]},
            {value: 'price_usd-a', tend: 'asc', id: marketSort[5]},
            {value: 'volume_usd_24h-d', tend: 'desc', id: marketSort[6]},
            {value: 'volume_usd_24h-a', tend: 'asc', id: marketSort[7]}
        ]
        return <div className="market-column-box">
            <div className="market-cut-tab">
                <p
                    className={`all ${this.state.allStatus === 1 ? 'active' : ''}`}
                    onClick={this.allAttentionCurrency}>
                    全部
                </p>
                <p
                    className={`my-attention ${this.state.allStatus === 0 ? 'active' : ''}`}
                    onClick={this.userAttentionCurrency}>
                    我关注的
                </p>
                <p
                    className="attention-market"
                    style={{display: 'none'}}>
                    概念行情
                </p>
                <div
                    className="sort sort-div">
                    <Select
                        placeholder={`${intl.formatMessage({id: 'market.sortName'})}`}
                        className='sort-select'
                        value={sortValue || 'rank-a'}
                        clearable={false}
                        searchable={false}
                        onChange={this.handleSortChange}
                        options={
                            marketSortItem.map((item, index) => {
                                return ({tend: `${item.tend}`, value: `${item.value}`, label: `${item.id}`})
                            })
                        }/>
                </div>
                <div className="currency-type sort-div">
                    <Select
                        placeholder={`${intl.formatMessage({id: 'market.currencyType'})}`}
                        className='currency-select'
                        value={currencyValue || '1'}
                        clearable={false}
                        searchable={false}
                        onChange={this.handleCurrencyChange}
                        options={[
                            {value: '0', label: `${intl.formatMessage({id: 'dollar'})}`},
                            {value: '1', label: `${intl.formatMessage({id: 'cny'})}`}
                        ]}/>
                </div>
                <div className="mining sort-div">
                    <Select
                        placeholder={`${intl.formatMessage({id: 'market.mining'})}`}
                        className='mining-select'
                        value={value}
                        clearable={false}
                        searchable={false}
                        onChange={this.handleMiningChange}
                        options={[
                            {value: null, label: `${intl.formatMessage({id: 'market.miningAll'})}`},
                            {value: 'true', label: `${intl.formatMessage({id: 'market.canMining'})}`},
                            {value: 'false', label: `${intl.formatMessage({id: 'market.canNotMining'})}`}
                        ]}/>
                </div>
                <p className="search-keyword">
                    <input onChange={(e) => {
                        this.filterChange(e)
                    }} type="text" placeholder="输入货币名称搜索"/>
                    <a onClick={this.clickToSearch} className="search"><img src={search} alt=""/></a>
                </p>
            </div>
            <div className="market-box-list">
                <div className="market-tab">
                    <ul className="table-title-ul">
                        {marketTitle.map((item, index) => {
                            return <li key={index}>{item}</li>
                        })}
                    </ul>
                </div>
                {
                    marketList.length === 0 ? <div className="loading">
                        暂无相关内容...
                    </div> : <div className="market-tab-list">
                        <table>
                            <tbody>{marketList.map((item, index) => {
                                return <tr key={index} onClick={(e) => {
                                    if (e.target.nodeName.toLowerCase() !== 'div') {
                                        this.toProject(item.coin_id)
                                    }
                                }}>
                                    <td onClick={this.attentionCurrency}>
                                        <div
                                            data-type={item.ifCollect}
                                            className={`attention ${item.ifCollect === 1 ? 'active' : ''}`}
                                            id={item.coin_id}/>
                                    </td>
                                    {/*
                                    <td
                                        style={{display: 'none'}}>
                                        {item.mineable === 1 ? <img src={followed} alt=""/> : <img src={notFollowed} alt=""/>}
                                    </td>
                                    */}
                                    <td>
                                        {item.rank}
                                    </td>
                                    <td className="coins-name-column">
                                        <font className="img-log"><img src={item.icon} alt=""/></font>
                                        <span
                                            className="blue">{`${item.symbol + (item.cn_name ? ('-' + item.cn_name) : '')}`}</span>
                                    </td>
                                    <td>
                                        {symbol}
                                        <FormattedNumber
                                            value={numTrans(price(item.available_supply * item.price_usd))}/>
                                        {item.available_supply * item.price_usd > 99999999 ? '亿' : '万'}
                                    </td>
                                    <td className="blue">
                                        {symbol}
                                        {formatPrice(price(item.price_usd))}
                                        {/* {price(item.price_usd).toFixed(3)} */}
                                    </td>
                                    <td>
                                        <FormattedNumber value={numTrans(item.available_supply)}/>
                                        {item.available_supply > 99999999 ? '亿' : '万'}
                                    </td>
                                    <td className="blue">
                                        {symbol}
                                        <FormattedNumber value={numTrans(price(item.volume_usd_24h))}/>
                                        {item.volume_usd_24h > 99999999 ? '亿' : '万'}
                                    </td>
                                    <td className={`${item.percent_change_24h >= 0 ? 'green' : 'red'}`}>
                                        {item.percent_change_24h + ' %'}
                                    </td>
                                    <td>
                                        {/* {item.price_chart === '' ? <img src={noDataImg} alt="" className="noDataImg"/> : <ReactEcharts height='100%' option={this.chartOption(item.price_chart)}/>} */}
                                        {item.price_chart === '' ? <img
                                            src={noDataImg}
                                            alt=""
                                            className="noDataImg"
                                        /> : <img
                                            src={item.price_chart}
                                            alt=""
                                        />}
                                        {/* <img src={item.price_chart} alt=""/> */}
                                    </td>
                                </tr>
                            })}
                            </tbody>
                        </table>
                    </div>
                }
                <div className="pagination">
                    <Pagination
                        total={totalCount || 0} current={currentPage || 0} pageSize={20}
                        onChange={this.changePages}/>
                </div>
            </div>
        </div>
    }
}

Market.defaultProps = {
    marketTabData: {
        coinData: {
            coin: [],
            count: 0
        },
        rate: {}
    }
}

export default injectIntl(Market)
