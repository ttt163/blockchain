/**
 * Author：liushaozong
 * Time：2018-01-20 21:34
 * Description：Header nav
 */

import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { getNewCoinsDetails } from '../../../actions/newCoins'

import './index.scss'

// import titleImg from './img/img.png'
class NewCoinsDetail extends Component {
    componentDidMount() {
        this.props.actions.getNewCoinsDetails(this.props.id)
    }

    render() {
        const {intl, newCoinsDetails} = this.props
        const detailsData = newCoinsDetails
        const startTime = detailsData.startTime === 0 ? '' : new Date(detailsData.startTime).toLocaleString().split(' ')[0]
        const endTime = detailsData.endTime === 0 ? '' : new Date(detailsData.endTime).toLocaleString().split(' ')[0]
        const coinsDetailKey = intl.formatMessage({id: 'new.coins.detail'}).split(',')
        const detailsTitle = intl.formatMessage({id: 'newCoinsDetails.title'}).split(',')
        return <div className="new-coins-detail">
            <div className="detail-title">
                <div className="title-name">
                    <img src={detailsData.img} alt=""/>
                    <p>{detailsData.name}</p>
                </div>
                <div className="back"><Link to={'/newcoins'}><FormattedMessage id="news.back"/> ></Link></div>
            </div>
            <div className="table-list">
                <table>
                    <tbody>
                        <tr>
                            <td>{coinsDetailKey[0]}<span>{startTime}</span></td>
                            <td>{coinsDetailKey[1]}<span>{endTime}</span></td>
                            <td>{coinsDetailKey[2]}
                                {(() => {
                                    if (detailsData.status === 'ongoing') {
                                        return <p className="underway">
                                            <FormattedMessage id="nc.underway"/>
                                        </p>
                                    } else if (detailsData.status === 'upcoming') {
                                        return <p className="coming">
                                            <FormattedMessage id="nc.coming"/>
                                        </p>
                                    } else if (detailsData.status === 'past') {
                                        return <p className="end">
                                            <FormattedMessage id="nc.end"/>
                                        </p>
                                    }
                                })()}
                            </td>
                            <td>{coinsDetailKey[3]}<span>{detailsData.symbol === 'null' ? '' : detailsData.symbol}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>{coinsDetailKey[4]}<span>{detailsData.raised === 'null' ? '' : detailsData.raised}</span>
                            </td>
                            <td>{coinsDetailKey[5]}<span>{detailsData.supply === 'null' ? '' : detailsData.supply}</span>
                            </td>
                            <td>{coinsDetailKey[6]}<span>{detailsData.legalForm === 'null' ? '' : detailsData.legalForm}</span>
                            </td>
                            <td>{coinsDetailKey[7]}<span>{detailsData.chainType === 'null' ? '' : detailsData.chainType}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>{coinsDetailKey[8]}<span>{detailsData.jurisdiction}</span></td>
                            <td>{coinsDetailKey[9]}<span>{detailsData.securityAudit}</span></td>
                            <td>{coinsDetailKey[10]}<span>{detailsData.assignment}</span></td>
                            <td></td>
                        </tr>
                        {
                            detailsData.icoPriceList.map(function (item, i) {
                                return (
                                    <tr key={i}>
                                        <td>{coinsDetailKey[11]}<span>{item.symbol}</span></td>
                                        <td>{coinsDetailKey[12]}<span>{item.price}</span></td>
                                        <td>{coinsDetailKey[13]}<span>{item.goal}</span></td>
                                        <td></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className="introduce-cont">
                <div className="introduction clearfix">
                    <h6>{detailsTitle[0]}</h6>
                    <p>{detailsData.description}</p>
                </div>
                <div className="team clearfix">
                    <h6>{detailsTitle[1]}</h6>
                    {
                        detailsData.icoTeamList.map(function (item, index) {
                            return (
                                <p key={index}>{item.name}</p>
                            )
                        })
                    }
                </div>
                <div className="media clearfix">
                    <h6>{detailsTitle[2]}</h6>
                    {
                        detailsData.icoLinkList.map(function (item, index) {
                            return (
                                <p key={index}>{item.name}----<a href={item.url} target="_blank">{item.name}</a></p>
                            )
                        })
                    }
                </div>
                {/* <div className="technology clearfix">
                 <h6>{detailsTitle[3]}</h6>
                 {
                 detailsData.icoPriceList.map(function (item, index) {
                 return (
                 <p key={index}>{item.name}</p>
                 )
                 })
                 }
                 </div> */}
            </div>
        </div>
    }
}
const mapStateToProps = (state) => {
    return {
        newCoinsDetails: state.newCoinsDetailsReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getNewCoinsDetails}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(NewCoinsDetail))
