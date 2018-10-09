/**
 * Author：zhoushuanglong
 * Time：2018-01-20 21:34
 * Description：Header nav
 */

import React from 'react'
import {array} from 'prop-types'
import {injectIntl, FormattedMessage, FormattedNumber} from 'react-intl'

import './index.scss'

const HeaderRollMsg = (props) => {
    const {headerRollMsg} = props
    return <div className="header-roll">
        {headerRollMsg.map((item, i) => {
            return <div className="coin-info" key={i}>
                <span className="name">
                    {`${item.symbol}-${item.cn_name}`}
                    &nbsp;&nbsp;
                    {/* <FormattedMessage id="nav.final"/>: */}
                </span>
                <span className="price">
                    <FormattedMessage id="nav.symbol"/>
                    <FormattedNumber value={item.price_usd}/>
                </span>
                <span className={`rate rateUp ${item.percent_change_24h < 0 ? 'down' : 'up'}`}>
                    <i className="trend"/>
                    {`${parseFloat(item.percent_change_24h)}%`}
                </span>
            </div>
        })}
    </div>
}

HeaderRollMsg.defaultProps = {
    headerRollMsg: [
        {
            'coin_id': '...',
            'available_supply': 0,
            'cn_name': '...',
            'en_name': '...',
            'icon': '...',
            'name': '...',
            'percent_change_24h': 0,
            'price_usd': 0,
            'symbol': '...',
            'max_supply': 0
        }
    ]
}

HeaderRollMsg.propTypes = {
    headerRollMsg: array.isRequired
}

export default injectIntl(HeaderRollMsg)
