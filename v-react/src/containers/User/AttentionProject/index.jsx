/**
 * Author：liushaozong
 * Time：2018/02/21
 * Description：news
 */
import React, {Component} from 'react'
import {injectIntl} from 'react-intl'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'

import Pagination from 'rc-pagination'

import {getMarketList, getRate, getAttentionCurrency} from '../../../actions/market'
// import {numTrans} from '../../../public'

import './index.scss'
import 'rc-pagination/assets/index.css'
// import currencyTitle from '../img/currency-title.png'
// import attentionActcive from '../img/attention-actcive.png'
// import attentionCancel from '../img/attention-cancel.png'

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getMarketList, getRate, getAttentionCurrency}, dispatch)
    }
}

const mapStateToProps = (state) => {
    return {
        totalCount: state.marketList.coinData.count,
        currentPage: state.marketList.coinData.currentPage,
        marketList: state.marketList.coinData.coin,
        rate: state.marketList.rate
    }
}

@injectIntl
class AttentionProject extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currency: '1'
        }
    }
    componentDidMount() {
        // $(window).scrollTop('0')
    }

    componentWillMount() {
        this.props.actions.getMarketList({currentPage: 1, myCollect: 1})
        this.props.actions.getRate({})
    }

    changePages = (page) => {
        this.setState({
            current: page
        })
        this.props.actions.getMarketList({
            currentPage: page,
            myCollect: 1
        })
    }

    toProject(coinId) {
        window.open(`/project?coinid=${coinId}`, '_blank')
    }

    cancelAttention = (e) => {
        e.preventDefault()
        e.stopPropagation()
        let coinId = e.target.getAttribute('id')
        let status = e.target.getAttribute('data-type')
        if (status === '1') {
            this.setState({statusAttention: 0})
            // 取消关注
            this.props.actions.getAttentionCurrency(coinId, Cookies.get('hx_user_id'), Cookies.get('hx_user_token'), -1)
        } else if (status === '0') {
            // 关注
            this.setState({statusAttention: 1})
            this.props.actions.getAttentionCurrency(coinId, Cookies.get('hx_user_id'), Cookies.get('hx_user_token'), 1)
        }
    }

    render() {
        const {intl, marketList, totalCount, rate, currentPage} = this.props
        const projectTitle = intl.formatMessage({id: 'user.project.title'}).split(',')
        const symbol = '￥'
        const price = (price) => {
            return price * parseFloat(rate.CNY)
        }
        return <div className="attention-project">
            <div className="project-tab">
                {marketList.length === 0 ? <div className="loading">暂无关注内容...</div> : <table width='100%'>
                    {
                        <tbody className="market-tab-list">
                            <tr>
                                {
                                    projectTitle.map((item, index) => {
                                        return (
                                            <td key={index}>{item}</td>
                                        )
                                    })
                                }
                            </tr>
                            {marketList.map((item, index) => {
                                return <tr key={index} onClick={(e) => { this.toProject(item.coin_id) }}>
                                    <td>
                                        {(index + 1) + (currentPage - 1) * 20}
                                    </td>
                                    <td className="coins-name-column">
                                        <span className="blue">{`${item.symbol + (item.cn_name ? ('-' + item.cn_name) : '')}`}</span>
                                    </td>
                                    <td className="blue">
                                        {symbol}
                                        {price(item.price_usd).toFixed(3)}
                                    </td>
                                    <td className={`${item.percent_change_24h >= 0 ? 'green' : 'red'}`}>
                                        {item.percent_change_24h >= 0 ? '+' + item.percent_change_24h + ' %' : item.percent_change_24h + '%'}
                                    </td>
                                    <td className="bolder">
                                        普通
                                    </td>
                                    <td className="blue" data-type={item.ifCollect} onClick={this.cancelAttention} id={item.coin_id}>
                                        {`${item.ifCollect === 1 ? '取消关注' : '重新关注'}`}
                                    </td>
                                    {/*
                                    <td className="blue">
                                        {symbol}
                                        <FormattedNumber value={numTrans(price(item.volume_usd_24h))}/>
                                        {item.volume_usd_24h > 99999999 ? '亿' : '万'}
                                    </td>
                                    */}
                                </tr>
                            })}
                        </tbody>
                    }
                </table>}
            </div>
            {marketList.length !== 0 ? <div className="pagination">
                <Pagination
                    total={totalCount || 0} current={currentPage || 0} pageSize={20}
                    onChange={this.changePages}/>
            </div> : ''}
            {/* <div className='noAttention'>您还没有关注的项目</div> */}
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AttentionProject)
