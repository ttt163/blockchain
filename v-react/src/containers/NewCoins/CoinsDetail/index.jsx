/**
 * Author：zhoushuanglong
 * Time：2018-01-20 21:34
 * Description：Header nav
 */

import React, {Component} from 'react'

import NewCoinsDetail from '../../../components/newCoins/NewCoinsDetail'

class CoinsDetail extends Component {
    render() {
        return (
            <NewCoinsDetail id={this.props.location.query.id} key="NewCoinsDetail"/>
        )
    }
}

export default CoinsDetail
