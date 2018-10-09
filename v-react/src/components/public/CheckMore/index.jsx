/**
 * Author：zhoushuanglong
 * Time：2018-02-25 20:28
 * Description：check more
 */

import React from 'react'

import './index.scss'

const CheckMore = (props) => {
    return [
        <div className="clearfix" key="checkMoreLoadClearFix"/>,
        <div {...props} className="check-more-load clearfix" key="checkMoreLoad">查看更多</div>
    ]
}

export default CheckMore
