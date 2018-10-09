/**
 * Author：zhoushuanglong
 * Time：2018-01-24 17:27
 * Description：index new coin item
 */

import React from 'react'
import {Link} from 'react-router'
import {string} from 'prop-types'

import {FormattedDate} from 'react-intl'

import './index.scss'
import logo from './img/index-new-coin-logo.jpg'

const IndexNewCoinItem = (props) => {
    const {img, mainName, from, to, status} = props
    let statusStyle = {}
    switch (status) {
        case 'ongoing':
            statusStyle = {status: 'going', name: '进行中'}
            break
        case 'upcoming':
            statusStyle = {status: 'will', name: '即将开始'}
            break
        case 'past':
            statusStyle = {status: 'did', name: '已结束'}
            break
        default:
            statusStyle = {status: 'going', name: '进行中'}
    }
    return <Link to={{pathname: `/newcoinsDetail`, query: {id: mainName}}} target="_blank">
        <div className="index-new-coin-item clearfix">
            <div className="inci-logo">
                <img src={img} alt="Logo"/>
            </div>
            <div className="inci-con">
                <div className="inci-con-up clearfix">
                    <h3>{mainName}</h3>
                    <span className={statusStyle.status}>{statusStyle.name}</span>
                </div>
                <p>
                    {from ? <FormattedDate value={from}/> : '暂无'}
                    &nbsp;至&nbsp;
                    {to ? <FormattedDate value={to}/> : '暂无'}
                </p>
            </div>
        </div>
    </Link>
}

IndexNewCoinItem.defaultProps = {
    img: logo,
    mainName: 'Loading',
    from: false,
    to: false,
    status: 0
}

IndexNewCoinItem.propTypes = {
    img: string.isRequired,
    mainName: string.isRequired,
    status: string.isRequired
}

export default IndexNewCoinItem
