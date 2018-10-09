/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import {MARKET, MARKETRATE, ATTENTIONCURRECY, USERATTENTIONCURRENCY} from '../constants/index'

const market = (state = {coinData: {coin: [], count: 0}, rate: {}}, action) => {
    switch (action.type) {
        case MARKET:
            return {...state, coinData: {...action.marketList}}
        case MARKETRATE:
            return {...state, rate: {...action.marketRate}}
        case ATTENTIONCURRECY:
            let coinId = action.data.coinId
            let listData = state.coinData.coin
            listData = listData.map((item, index) => {
                if (item.coin_id === coinId) {
                    item.ifCollect = 1 - item.ifCollect // 取非
                }
                return item
            })
            return Object.assign({}, state, {coinData: Object.assign({}, state.coinData, {coin: listData})})
        case USERATTENTIONCURRENCY:
            return Object.assign({}, state, {coinData: Object.assign({}, state.coinData, {coin: action.userAttention.inforList}, {count: action.userAttention.recordCount}, {currentPage: action.userAttention.currentPage})})
        default:
            return state
    }
}

export default market
