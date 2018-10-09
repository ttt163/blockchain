/**
 * Author：zhoushuanglong
 * Time：2018-01-20 21:34
 * Description：Header nav
 */

import React from 'react'
import {injectIntl, FormattedMessage} from 'react-intl'

import './index.scss'

const NewCoinsHeader = () => {
    return <div className="new-coins-head">
        <div className="coins-head">
            <span className="active"><FormattedMessage id="nc.underway"/></span>
            <span><FormattedMessage id="nc.coming"/></span>
            <span><FormattedMessage id="nc.end"/></span>
        </div>
    </div>
}

export default injectIntl(NewCoinsHeader)
