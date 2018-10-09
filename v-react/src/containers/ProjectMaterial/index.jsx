/**
 * Author：liushaozong
 * Time：2018/01/23
 * Description：ProjectMaterial
 */

import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'

import BazaaryRate from '../../components/projectMaterial/BazaaryRate'
import BazaaryMarket from '../../components/projectMaterial/BazaaryMarket'
import TradingRate from '../../components/projectMaterial/TradingRate'
import ReactHighstock from 'react-highcharts/ReactHighstock'
import Highcharts from 'highcharts/highstock'

import {getMarketTrend, getExchangeList} from '../../actions/project'

import './index.scss'

import bazaarMarketTitle from './img/market-title.png'

const mapStateToProps = (state) => {
    return {
        coinTrendData: state.getCoinTrend,
        coinInfo: state.currencyParticularsReducer,
        exchangeList: state.exchangeListReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getExchangeList, getMarketTrend}, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
export default class ProjectMaterial extends Component {
    constructor(props) {
        super(props)
        this.state = {
            coinid: this.props.location.query.coinid || this.props.coinInfo.data.coin_id,
            from: Date.parse(new Date()) / 1000 - (3650 * 3600 * 24),
            to: Date.parse(new Date()) / 1000,
            max: 0,
            min: 0,
            data: []
        }
    }

    componentWillMount() {
        this.props.actions.getMarketTrend({...this.state, data: null, max: null, min: null}, (data) => {
            let usdPrice = data.price_usd
            this.setState({
                min: usdPrice[0][0],
                max: usdPrice[usdPrice.length - 1][0]
            })
        })
    }

    componentDidMount() {
        $(window).scrollTop('0')

        const {coinid} = this.props.location.query
        this.props.actions.getExchangeList(coinid, 1, 20)
        Highcharts.setOptions({
            global: {
                useUTC: false
            },
            lang: {
                months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                loading: '加载中...',
                noData: '没有数据',
                numericSymbols: ['千', '兆', 'G', 'T', 'P', 'E'],
                printChart: '打印图表',
                resetZoom: '恢复缩放',
                resetZoomTitle: '恢复图表',
                shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                thousandsSep: ',',
                rangeSelectorFrom: '从',
                rangeSelectorTo: '到',
                rangeSelectorZoom: '缩放'
            }
        })
    }

    setExtremes = (e) => {
        // let chart = this.refs.chart && this.refs.chart.getChart()
        e.min && this.props.actions.getMarketTrend({
            coinid: this.state.coinid,
            from: Math.round(e.min / 1000),
            to: Math.round(e.max / 1000)
        })

        // e.min && axiosAjax('GET', '/market/coin/graph', {
        //     coinid: this.state.coinid,
        //     from: Math.round(e.min / 1000),
        //     to: Math.round(e.max / 1000)
        // }, (data) => {
        //     this.setState({
        //         data: {...this.state.data, ...data.data.price_usd}
        //     })
        //     chart && chart.series[0].setData(data.data.price_usd)
        // })
    }

    afterSetExtremes = () => {
        // let chart = this.refs.chart && this.refs.chart.getChart()
        // chart && chart.series[0].setData(this.props.coinTrendData.price_usd)
    }

    dealPieData = () => {
        const {exchangeList} = this.props
        const arr = [
            {
                value: 0,
                name: 'Other'
            }
        ]

        let rateNum = 0
        exchangeList.inforList.map(function (item, index) {
            rateNum += parseFloat(item.volume_rate_24h)
            let isOr = false
            for (let i = 0; i < arr.length; i++) {
                if (item.exchange_name === arr[i].name) {
                    arr[i].value = arr[i].value + parseFloat(item.volume_rate_24h)
                    isOr = true
                    break
                }
            }

            if (isOr === false) {
                arr.push({
                    value: parseFloat(item.volume_rate_24h),
                    name: item.exchange_name
                })
            }
        })

        arr[0].value = 100 - rateNum
        return arr
    }

    render() {
        const {query} = this.props.location
        let currentDate = new Date()
        let UTC = [[Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), 0), null]]

        const dataConvert = [].concat(this.props.coinTrendData.price_usd, UTC).map(function (item, key, ary) {
            return [item[0], parseFloat(item[1])]
        })

        const arrOption = [].concat(dataConvert, UTC)

        this.option = {
            chart: {
                zoomType: 'x'
            },
            rangeSelector: {
                buttons: [{
                    type: 'day',
                    count: 1,
                    text: '1d'
                }, {
                    type: 'week',
                    count: 1,
                    text: '1周'
                }, {
                    type: 'month',
                    count: 1,
                    text: '1月'
                }, {
                    type: 'month',
                    count: 3,
                    text: '3月'
                }, {
                    type: 'ytd',
                    text: '今年'
                }, {
                    type: 'year',
                    count: 1,
                    text: '1年'
                }, {
                    type: 'all',
                    text: '全部'
                }],
                // 按钮样式
                buttonTheme: {
                    fill: 'none',
                    'stroke-width': 1,
                    stroke: '#BDE8FC',
                    width: 60,
                    r: 0,
                    zIndex: 7,
                    style: {
                        'font-size': '14px',
                        color: '#379dfc'
                    },
                    states: {
                        select: {
                            fill: '#52b8fc',
                            style: {
                                fontWeight: 'normal',
                                color: 'white'
                            }
                        }
                    }
                },
                inputBoxBorderColor: '#BDE8FC',
                inputStyle: {
                    'font-size': '14px',
                    color: '#22a5ff'
                },
                inputPosition: {
                    verticalAlign: 'middle'
                },
                labelStyle: {
                    color: '#9c9c9c'
                },
                inputDateFormat: '%Y-%m-%d',
                inputEditDateFormat: '%Y-%m-%d',
                selected: 6
            },
            navigator: {
                adaptToUpdatedData: false,
                series: {
                    lineWidth: 1,
                    data: arrOption
                    // data: [].concat(this.state.data, UTC)
                }
            },
            plotOptions: {
                series: {
                    showInLegend: true
                }
            },
            tooltip: {
                split: false,
                shared: true
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: true
            },
            series: [{
                name: '价格(美元)',
                data: arrOption,
                // data: [].concat(this.state.data, UTC),
                lineWidth: 1,
                dataGrouping: {
                    enabled: true
                }
            }],
            xAxis: {
                events: {
                    // afterSetExtremes: this.setExtremes
                },
                minRange: 3600 * 1000,
                labels: {
                    autoRotation: false,
                    formatter: function () {
                        let vDate = new Date(this.value)
                        return vDate.getFullYear() + '-' + (vDate.getMonth() + 1) + '-' + vDate.getDate()
                    }
                }
            },
            yAxis: {
                title: {
                    text: '价格(美元)'
                },
                opposite: false
            },
            scrollbar: {
                liveRedraw: false
            }
        }
        return <div className="project-material">
            <div className="project-tab">
                <div className="bazaary-rate" style={{display: 'none'}}>
                    <BazaaryRate/>
                </div>
                <div className="bazaary-market-title">
                    <span>
                        <img src={bazaarMarketTitle} alt=""/>
                    </span>
                    <h6>市场行情</h6>
                </div>
                <div className="bazaary-market-wrap clearfix">
                    <div className="bazaary-market-left">
                        <BazaaryMarket {...query} exchangeList={this.props.exchangeList}/>
                    </div>
                    <div className="bazaary-market-right">
                        <TradingRate data={this.dealPieData()}/>
                    </div>
                </div>
                <div className="price-trend">
                    <h5 className="price-trend-title">
                        <span>价格趋势</span>
                    </h5>
                    <div className="high-charts-content">
                        <ReactHighstock
                            config={this.option}
                            ref="chart"
                            type={'stockChart'}
                            height="400px"/>
                    </div>
                </div>
            </div>
        </div>
    }
}
