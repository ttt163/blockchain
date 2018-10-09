/**
 * Author：zhoushuanglong
 * Time：2018-01-25 21:29
 * Description：trading rate
 */

import React, {Component} from 'react'
import {FormattedMessage} from 'react-intl'

import './index.scss'

import ReactEcharts from '../../../components/public/ReactEcharts'

class TradingRate extends Component {
    chartOption() {
        return {
            tooltip: {
                trigger: 'item',
                formatter: '{b} <br/>{d}%'
            },
            color: ['#d9dce3', '#f48fb1', '#ff8a80', '#80cbc4', '#fadd60', '#80cbc4', '#ce93d8', '#90caf9', '#ffcc80', '#bdbdbd', '#80deea', '#619fb4', '#a7c7ee', '#580a06', '#af777a', '#486585'],
            legend: null,
            series: [
                {
                    name: '成交额占比',
                    type: 'pie',
                    radius: ['40%', '80%'],
                    avoidLabelOverlap: false,
                    label: null,
                    data: this.props.data
                }
            ]
        }
    }

    render() {
        const option = this.chartOption()
        return <div className="trading-rate">
            <div className="trading-rate-btn">
                <a style={{display: 'none'}}><FormattedMessage id="rate.counterparty"/></a>
                <a className="active"><FormattedMessage id="rate.bourse"/></a>
            </div>
            <div className="trading-rate-chart">
                <ReactEcharts option={option} height='270px'/>
            </div>
            <ul className="trading-rate-legend clearfix">
                {option.series[0].data.map((d, i) => {
                    return <li key={i}><span style={{background: option.color[i]}}></span><em>{d.name}</em></li>
                })}
            </ul>
        </div>
    }
}

TradingRate.defaultProps = {
    data: [
        {value: 1, name: 'Loading'}
    ]
}

TradingRate.propTypes = {}

export default TradingRate
