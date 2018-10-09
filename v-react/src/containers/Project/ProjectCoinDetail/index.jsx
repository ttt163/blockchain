/**
 * Author：zhoushuanglong
 * Time：2018-02-09 02:03
 * Description：Description
 */

import React, {Component} from 'react'

import './index.scss'

import CurrencyIntroduce from '../../../components/public/CurrencyIntroduce'
import CurrencyDeal from '../../../components/public/CurrencyDeal'

export default class ProjectCoinDetail extends Component {
    state = {
        particularCont: '',
        show: false
    }
    particularPop = (cont) => {
        this.setState({show: true, particularCont: cont})
    }
    partcularClose = () => {
        this.setState({show: false})
    }

    render() {
        const {coinid} = this.props
        return <div className="message-banner" key='project-header'>
            <div className="message-banner-box">
                <CurrencyIntroduce
                    currencyDetails={coinid}
                    particularPop={this.particularPop}
                    key="CurrencyIntroduce"/>
                <CurrencyDeal currencyPrice={coinid} key="CurrencyDeal"/>
            </div>
            <div
                className={this.state.show ? 'currency-introduce-pop show' : 'currency-introduce-pop'}
                key="currencyIntroduceTop">
                <div className="close" onClick={this.partcularClose}/>
                <h6>项目介绍</h6>
                <div className="introduce-cont">{this.state.particularCont}</div>
            </div>
            <div className={this.state.show ? 'currency-introduce-pop show' : 'currency-introduce-pop'} key='show'>
                <div className="close" onClick={this.partcularClose}/>
                <h6>项目介绍</h6>
                <div className="introduce-cont">{this.state.particularCont}</div>
            </div>
            <div className={this.state.show ? 'shade show' : 'shade'} key='shade'/>
        </div>
    }
}
