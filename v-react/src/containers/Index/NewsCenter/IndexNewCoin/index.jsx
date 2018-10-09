/**
 * Author：zhoushuanglong
 * Time：2018-01-24 16:54
 * Description：inde new coin
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {array} from 'prop-types'
import {Link} from 'react-router'
import {injectIntl, FormattedMessage} from 'react-intl'

import './index.scss'

import CheckMore from '../../../../components/public/CheckMore'
import TitleAside from '../../../../components/public/TitleAside'
import IndexNewCoinItem from '../../../../components/index/IndexNewCoinItem'
import IndexNewCoinIcon from './img/index-new-coin-icon.png'
import logo from './img/index-new-coin-logo.jpg'

import {getNewCoins} from '../../../../actions/newCoins'
// import {convertData} from '../../../../public/index'

const title = [
    {id: 'nc.underway', status: 'ongoing'},
    {id: 'nc.coming', status: 'upcoming'},
    {id: 'nc.end', status: 'past'}
]

const mapStateToProps = (state) => {
    return {
        newCoins: state.newCoinsReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getNewCoins}, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
@TitleAside
class IndexNewCoin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ongoingPage: 1,
            upcomingPage: 1,
            pastPage: 1,
            icon: IndexNewCoinIcon,
            title: this.props.intl.formatMessage({id: 'nav.newCoins'}),
            optionTitle: 0,
            newCoinsItem: [],
            index: title[0].status
        }
    }

    convertData = () => {
        const arr = []
        this.props.newCoins.obj.inforList.map(function (item, index) {
            arr.push({
                img: item.img,
                mainName: item.name,
                status: item.status,
                secondName: item.symbol,
                content: item.description,
                from: item.startTime,
                to: item.endTime
            })
        })

        return arr
    }

    handleClick = (status) => {
        this.setState({
            index: status
        })
        this.props.actions.getNewCoins(1, 6, status)
    }

    componentDidMount() {
        this.props.actions.getNewCoins(1, 6, this.state.index)
    }

    render() {
        const newCoinsItem = this.convertData().filter((item) => item.status === this.state.index)
        return <div className="indec-new-coin">
            <div className="inc-nav clearfix">
                {title.map((item, index) => {
                    return <a
                        className={this.state.index === item.status ? 'active' : ''}
                        key={index}
                        onClick={() => {
                            this.handleClick(item.status)
                        }}>
                        <FormattedMessage id={item.id}/>
                    </a>
                })}
            </div>
            <div>
                {newCoinsItem.map(function (d, i) {
                    if (i < 5) {
                        return <IndexNewCoinItem key={i} {...d}/>
                    }
                })}
            </div>
            <Link to="/newcoins">
                <CheckMore style={{borderTop: '1px solid #eee'}}/>
            </Link>
        </div>
    }
}

IndexNewCoin.defaultProps = {
    coinList: [
        {
            img: logo,
            mainName: 'Loading',
            from: 'Loading',
            to: 'Loading',
            status: 0
        }
    ]
}

IndexNewCoin.propTypes = {
    coinList: array.isRequired
}
export default IndexNewCoin
