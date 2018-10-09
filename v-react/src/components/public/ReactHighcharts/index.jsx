/**
 * Author：zhoushuanglong
 * Time：2017/7/5
 * Description：react echarts
 */

import React, {Component} from 'react'
import Highcharts from 'highcharts/highstock'

import {generateUUID, compareObject} from '../../../public/index'

class ReactHighcharts extends Component {
    state = {
        id: generateUUID()
    }

    chartsRender = () => {
        const {type, modules, options} = this.props

        Highcharts.setOptions({
            lang: {
                months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                loading: '加载中',
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

        if (modules) {
            modules.forEach(function (module) {
                module(Highcharts)
            })
        }

        this.chart = new Highcharts[type || 'Chart'](
            this.state.id,
            {...options}
        )
    }

    componentWillUnmount() {
        this.chart.destroy()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return compareObject(this.props, nextProps) === false
    }

    componentDidMount() {
        this.chartsRender()
    }

    componentDidUpdate() {
        this.chartsRender()
    }

    render() {
        return <div className="echarts-content" id={this.state.id} style={{height: this.props.height + 'px'}}/>
    }
}

export default ReactHighcharts
