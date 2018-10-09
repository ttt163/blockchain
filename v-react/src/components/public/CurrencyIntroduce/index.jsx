/**
 * Author：liushaozong
 * Time：2018-01-21 21:34
 * Description：项目资料  货币介绍组件
 */

import React, {Component} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import Cookies from 'js-cookie'
import { getCurrencyParticulars } from '../../../actions/project'
import { getAttentionCurrency } from '../../../actions/market'
import './index.scss'
class CurrencyIntroduce extends Component {
    state = {
        pop: false
    }
    handleParticularClick = () => {
        this.setState({pop: true})
        this.props.particularPop(this.props.currencyParticulars.data.description)
    }
    attentionCurrency = (e) => {
        let coinId = e.target.getAttribute('data-name')
        let status = e.target.getAttribute('data-id')
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
            alert('请登录后，再关注')
        }
    }
    componentDidMount() {
        let passportId = Cookies.get('hx_user_token') !== undefined ? Cookies.get('hx_user_id') : ''
        this.props.actions.getCurrencyParticulars(this.props.currencyDetails, passportId)
    }
    render() {
        const {currencyParticulars, intl} = this.props
        const particularsName = intl.formatMessage({id: 'currency.particulars'}).split(',')
        let particularsCont = currencyParticulars.data
        let websites = particularsCont.websites.split(',')
        let explorer = particularsCont.explorer.split(',')
        let time = particularsCont.release_time === 0 ? '暂无信息' : new Date(particularsCont.release_time).toLocaleString().split(' ')[0].split('/').join('-')
        document.title = `${particularsCont.cn_name}${particularsCont.name}-区块链先锋门户`
        return (
            <div className="currency-introduce">
                <div className="currency-title">
                    <span><img src={particularsCont.icon} alt=""/></span>
                    <h6>{particularsCont.cn_name}{particularsCont.name}</h6>
                </div>
                <div className="attention"><font>关注：</font><span data-name={particularsCont.name} data-id={particularsCont.ifCollect} onClick={this.attentionCurrency} className={particularsCont.ifCollect === 1 ? 'active' : ''}></span></div>
                <p className="currency-text">
                    {particularsCont.description === '' ? '暂无信息' : particularsCont.description}
                </p>
                <div className={particularsCont.description === '' ? 'particulars-btn none' : 'particulars-btn'} onClick={this.handleParticularClick}>查看介绍</div>
                <div style={{clear: 'both'}}></div>
                <div className="currency-bazaar">
                    <p className="time">{particularsName[0]}: <span>{time}</span></p>
                    <p className="putaway">{particularsName[1]}: <span>{particularsCont.marketcount}</span>家</p>
                    <p className="ranking">{particularsName[2]}: <span>第<font>{particularsCont.rank}</font>名</span></p>
                </div>
                <div className="white-book" style={{display: 'none'}}>
                    <p>白皮书：</p><span>https://www.feixiaohao.com/#CNY</span>
                </div>
                <div className="grade" style={{display: 'none'}}><p>评分：</p><span>3.5</span> 分</div>
                <div className="official">
                    <p>{particularsName[3]}：</p>
                    <span><a href={websites[0]} target="_blank">{websites[0] === '' ? '暂无信息' : websites[0]}</a></span>
                    <span><a href={websites[1]} target="_blank">{websites[1]}</a></span>
                </div>
                <div className="block">
                    <p>{particularsName[4]}：</p>
                    <span><a href={explorer[0]} target="_blank">{explorer[0] === '' ? '暂无信息' : explorer[0]}</a></span>
                    <span><a href={explorer[1]} target="_blank">{explorer[1]}</a></span>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currencyParticulars: state.currencyParticularsReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getCurrencyParticulars, getAttentionCurrency}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CurrencyIntroduce))
