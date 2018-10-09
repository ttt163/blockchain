/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import {CONCEPTMARKET} from '../constants/index'

const initState = {
    currId: 'Loading',
    average: 'Loading',
    maxPriceUsd: 'Loading',
    maxRise: {
        coinId: 'Loading',
        symbol: 'Loading',
        percentChange24h: 'Loading'
    },
    maxDecline: {
        coinId: 'Loading',
        symbol: 'Loading',
        percentChange24h: 'Loading'
    },
    title: [],
    coins: []
}

const conceptMarket = (state = initState, action) => {
    switch (action.type) {
        case CONCEPTMARKET:
            return {...action.conceptMarket}
        default:
            return state
    }
}

export default conceptMarket
