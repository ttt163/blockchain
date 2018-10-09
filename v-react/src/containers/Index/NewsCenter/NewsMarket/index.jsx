/**
 * Author：liushaozong
 * Time：2018-01-21 21:34
 * Description：index news list
 */

import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import ReactEcharts from '../../../../components/public/ReactEcharts'

import {conceptMarket} from '../../../../actions/conceptMarket'
import {getRate} from '../../../../actions/market'

import {array} from 'prop-types'
import {injectIntl} from 'react-intl'
import {numTrans} from '../../../../public'

import './index.scss'
import TitleAside from '../../../../components/public/TitleAside'
import recommend from './img/market.png'
import noDataImg from './img/no-data-img.png'

const mapStateToProps = (state) => {
    return {
        rate: state.marketList.rate,
        conceptData: state.conceptMarket
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({conceptMarket, getRate}, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
@TitleAside
class NewsMarket extends Component {
    state = {
        icon: recommend,
        title: this.props.intl.formatMessage({id: 'title.market'}),
        optionTitle: 0
    }

    componentWillMount() {
        this.props.actions.conceptMarket({})
        this.props.actions.getRate({})
    }
    componentDidMount() {
        setInterval(() => {
            this.props.actions.getRate({})
        }, 60000)
    }

    chartOption = (data) => {
        let datas = data.split(',')
        let option = {
            xAxis: {
                show: false,
                type: 'category'
            },
            yAxis: {
                min: Math.min.apply(null, datas) / 1.3,
                max: Math.max.apply(null, datas) * 1.1,
                show: false
            },
            series: [{
                showSymbol: false,
                data: datas,
                type: 'line',
                lineStyle: {
                    width: 1
                }
            }],
            color: ['#379dfc']
        }
        return option
    }

    changeItem(id, index) {
        this.setState({
            optionTitle: index
        })
        this.props.actions.conceptMarket({currId: id})
    }

    render() {
        const {intl, conceptData, rate} = this.props
        const maxFloat = intl.formatMessage({id: 'title.maxFloat'})
        const maxFall = intl.formatMessage({id: 'title.maxFall'})
        return conceptData.currId ? <div className="index-news-market clearfix">
            <ul className="option-title">
                {
                    conceptData && conceptData.title.map((item, index) => {
                        return (
                            <li onClick={() => this.changeItem(item.id, index)} className={index === this.state.optionTitle ? 'active' : ''} key={index}>{item.name}</li>
                        )
                    })
                }
            </ul>
            <div className="tab-cont">
                <div className="box-cont">
                    <div className="price">
                        <p className="atPresent">￥ {conceptData.maxPriceUsd && (conceptData.maxPriceUsd * rate.CNY).toFixed(3)}</p>
                        <p className={`float ${conceptData.average > 0 ? 'rise' : 'fall'}`}>{conceptData.average && parseFloat(conceptData.average).toFixed(3)} %</p>
                    </div>
                    <div className="float-box">
                        <div className="max-float">
                            <p className="float-text">{maxFloat}</p>
                            <span className="float-num">{conceptData.maxRise && conceptData.maxRise.symbol} {conceptData.maxRise && conceptData.maxRise.percentChange24h} %</span>
                        </div>
                        <div className="max-fall">
                            <p className="fall-text">{maxFall}</p>
                            <span className="fall-num">{conceptData.maxDecline && conceptData.maxDecline.symbol} {conceptData.maxDecline && conceptData.maxDecline.percentChange24h} %</span>
                        </div>
                    </div>
                    <div className="tab-deal">
                        <table className="concept-table">
                            <tbody>
                                <tr className="concept-table-head">
                                    <td>币种</td>
                                    <td>价格</td>
                                    <td>24H成交额</td>
                                    <td>7D价格趋势</td>
                                </tr>
                                {conceptData && conceptData.coins.map((item, index) => {
                                    return <tr key={index}>
                                        <td className="coin-name">{item.symbol + `${item.cn_name !== '' ? ('-' + item.cn_name) : ''} `}</td>
                                        <td className="coin-price">￥ {item.price_usd && (parseFloat(item.price_usd) * rate.CNY).toFixed(2)}</td>
                                        <td className="coin-24">{numTrans(item.volume_usd_24h)}{item.available_supply > 99999999 ? '亿' : '万'}</td>
                                        <td className="coin-charts">
                                            {item.price_chart === '' ? <img src={noDataImg} alt="" className="noDataImg"/> : <ReactEcharts
                                                height='100%'
                                                option={this.chartOption(item.price_chart)}
                                            />}
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div> : <div className="loading">数据加载中...</div>
    }
}

NewsMarket.defaultProps = {
    marketData: [
        {
            title: '去中心交易',
            price: {
                atPresent: '当前钱数',
                float: '涨幅'
            },
            floatData: {
                float: 'EMC 19%',
                fall: 'CVC -10%'
            },
            listData: {
                list: '标题',
                time: '2018-01-21'
            },
            tabDeal: [
                {}
            ]
        },
        {
            title: '公正防伪',
            price: {
                atPresent: '当前钱数',
                float: '涨幅'
            },
            chart: {},
            listData: {
                list: '标题',
                time: '时间'
            }
        },
        {
            title: '基于DAG',
            price: {
                atPresent: '当前钱数',
                float: '涨幅'
            },
            chart: {},
            listData: {
                list: '标题',
                time: '时间'
            }
        }
    ]
}

NewsMarket.propTypes = {
    marketData: array.isRequired
}

export default NewsMarket
