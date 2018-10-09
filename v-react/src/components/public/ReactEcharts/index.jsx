/**
 * Author：zhoushuanglong
 * Time：2017/7/5
 * Description：react echarts
 */

import React, {Component} from 'react'
import Echarts from 'echarts'

import {generateUUID, compareObject} from '../../../public/index'

class ReactEcharts extends Component {
    state = {
        id: generateUUID(),
        chartsRender: null
    }

    chartsRender = () => {
        this.setState({
            chartsRender: Echarts.init(document.getElementById(this.state.id))
        }, () => {
            this.state.chartsRender.setOption(this.props.option)
        })
    }

    componentWillMount() {
        window.onresize = () => {
            this.state.chartsRender.resize()
        }
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
        return <div className="echarts-content" id={this.state.id} style={{height: this.props.height}}/>
    }
}

export default ReactEcharts
