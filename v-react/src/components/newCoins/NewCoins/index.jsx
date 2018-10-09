/**
 * Author：zhoushuanglong
 * Time：2018-01-20 21:34
 * Description：Header nav
 */

import React, {Component} from 'react'
import {Link} from 'react-router'
// import {array} from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Pagination from 'rc-pagination'
import {injectIntl, FormattedMessage, FormattedDate} from 'react-intl'
import {getNewCoins} from '../../../actions/newCoins'

import './index.scss'
import 'rc-pagination/assets/index.css'
import next from './img/next.png'

const title = [
    {id: 'nc.underway', status: 'ongoing'},
    {id: 'nc.coming', status: 'upcoming'},
    {id: 'nc.end', status: 'past'}
]

class NewCoins extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTitle: 'ongoing',
            ongoingPage: 1,
            upcomingPage: 1,
            pastPage: 1
        }
    }

    // const {newCoinsList} = props
    handleClick(status) {
        this.setState({
            activeTitle: status
        }, function () {
            this.props.actions.getNewCoins(1, 20, this.state.activeTitle)
        })
    }

    changePages = (page) => {
        this.props.actions.getNewCoins(page, 20, this.state.activeTitle)
    }

    componentDidMount() {
        this.props.actions.getNewCoins(1, 20, this.state.activeTitle)
    }

    render() {
        const {newCoinsReducer} = this.props
        return <div>
            <div className="new-coins-head">
                <div className="coins-head">
                    {title.map((item, index) => {
                        return <span
                            className={this.state.activeTitle === item.status ? 'active' : ''}
                            key={index}
                            onClick={() => {
                                this.handleClick(item.status)
                            }}>
                            <FormattedMessage id={item.id}/>
                        </span>
                    })}
                </div>
            </div>
            <div className="coins-content-div block-style">
                <ul className="coins-content">
                    {newCoinsReducer.obj.inforList.map((item, index) => {
                        let startTime = new Date(item.startTime).toLocaleString().split(' ')[0]
                        let endTime = new Date(item.endTime).toLocaleString().split(' ')[0]
                        return <li className="coins-item" key={index}>
                            <div className="item-img">
                                <div className="item-con"><img src={item.img} alt=""/></div>
                            </div>
                            <div className="name">
                                <p className="main-name">{item.symbol}</p>
                                <p className="second-name">{item.name}</p>
                            </div>
                            <div className="status">
                                {(() => {
                                    if (item.status === title[0].status) {
                                        return <p className="underway">
                                            <FormattedMessage id="nc.underway"/>
                                        </p>
                                    } else if (item.status === title[1].status) {
                                        return <p className="coming">
                                            <FormattedMessage id="nc.coming"/>
                                        </p>
                                    } else if (item.status === title[2].status) {
                                        return <p className="end">
                                            <FormattedMessage id="nc.end"/>
                                        </p>
                                    }
                                })()}
                                {!item.startTime ? <p className="duration">暂无数据</p> : <p className="duration">
                                    <span className="from"><FormattedDate value={startTime}/></span>&nbsp;&nbsp;
                                    <span><FormattedMessage id="nc.to"/></span>
                                    &nbsp;&nbsp;
                                    <span className="to"><FormattedDate value={endTime}/></span>
                                </p>}
                            </div>
                            <div className="detail">
                                <p>
                                    {item.description}
                                </p>
                            </div>
                            <div className="to-details">
                                <Link to={{pathname: `/newcoinsDetail`, query: {id: item.id}}} target="_blank">
                                    <FormattedMessage id="nc.toDetail"/>
                                    <img src={next} alt=""/>
                                </Link>
                            </div>
                        </li>
                    })}
                </ul>
                <div className="pagination">
                    <Pagination
                        total={newCoinsReducer.obj.recordCount || 0} current={newCoinsReducer.obj.currentPage || 0}
                        pageSize={20}
                        onChange={this.changePages}/>
                </div>
            </div>
        </div>
    }
}

// NewCoins.defaultProps = {}
//
// NewCoins.propTypes = {
//     newCoinsList: array.isRequired
// }

const mapStateToProps = (state) => {
    return {
        newCoinsReducer: state.newCoinsReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getNewCoins}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(NewCoins))
