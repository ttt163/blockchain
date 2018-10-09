/**
 * Author：zhoushuanglong
 * Time：2017/7/26
 * Description：index
 */

import React from 'react'
import './index.scss'

// import NewCoinsHeader from '../../components/newCoins/NewCoinsHeader'

const NewCoinsIndex = (props) => {
    return (
        <div className="new-coins-content">
            {/*
            <NewCoinsHeader key="NewCoinsHeader" />
            */}
            <div className="new-coins-father">{props.children}</div>
        </div>
    )
}

export default NewCoinsIndex
