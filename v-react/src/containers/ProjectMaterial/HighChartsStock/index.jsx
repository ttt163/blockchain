/**
 * Author：liushaozong
 * Time：2018/01/23
 * Description：ProjectMaterial
 */

import React, {Component} from 'react'
import {injectIntl} from 'react-intl'

import ReactHighcharts from '../../../components/public/ReactHighcharts'

class HighchartsPic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            option: this.props.option
        }
    }

    componentDidMount() {
        this.setState({
            option: this.props.option
        })
    }

    render() {
        const {option} = this.state
        return <ReactHighcharts option={option} type='stockChart' height="400px"/>
    }
}

export default injectIntl(HighchartsPic)
