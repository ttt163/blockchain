/**
 * Author：liushaozong
 * Time：2018-01-21 21:34
 * Description：project
 */

import React, {Component} from 'react'
import {array} from 'prop-types'
import ReactEcharts from '../../../components/public/ReactEcharts'

import './index.scss'

import bazaarRateTitle from './img/bazaar-rate-title.png'

class BazaaryBate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: 0
        }
    }

    render() {
        const {marketValue, circulate, turnoverRate} = this.props
        return (
            <div className="bazaary-bate">
                <div className="bate-title">
                    <span><img src={bazaarRateTitle} alt=""/></span><h6>市场占有率</h6>
                </div>
                <div className="bazaary-bate-chart">
                    <div className="overall-bate">
                        <div className="chart-box">
                            <ReactEcharts option={marketValue} height="100%"/>
                        </div>
                        <p className="overall-num">90%</p>
                        <span>全局总市值占比</span>
                    </div>
                    <div className="circulate-bate">
                        <div className="chart-box">
                            <ReactEcharts option={circulate} height="100%"/>
                        </div>
                        <p className="circulate-num">90%</p>
                        <span>流通率</span>
                    </div>
                    <div className="change-bate">
                        <div className="chart-box">
                            <ReactEcharts option={turnoverRate} height="100%"/>
                        </div>
                        <p className="change-num">90%</p>
                        <span>换手率</span>
                    </div>
                </div>
            </div>
        )
    }
}

BazaaryBate.defaultProps = {
    marketValue: {
        tooltip: null,
        legend: null,
        color: ['#3f8fdc', '#bbdefb'],
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: ['30%', '75%'],
                avoidLabelOverlap: false,
                label: null,
                data: [
                    {value: 200, name: '直接访问'},
                    {value: 20, name: '邮件营销'}
                ]
            }
        ]
    },
    circulate: {
        tooltip: null,
        legend: null,
        color: ['#80b250', '#dcedc8'],
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: ['30%', '75%'],
                avoidLabelOverlap: false,
                label: null,
                data: [
                    {value: 180, name: '直接访问'},
                    {value: 20, name: '邮件营销'}
                ]
            }
        ]
    },
    turnoverRate: {
        tooltip: null,
        legend: null,
        color: ['#ed693f', '#ffccbc'],
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: ['30%', '75%'],
                avoidLabelOverlap: false,
                label: null,
                data: [
                    {value: 150, name: '直接访问'},
                    {value: 20, name: '邮件营销'}
                ]
            }
        ]
    },
    BazaaryBateData: []
}

BazaaryBate.propTypes = {
    BazaaryBateData: array.isRequired
}

export default (BazaaryBate)
