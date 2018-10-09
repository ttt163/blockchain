/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import {GETHEADERROLLMSG} from '../constants/index'

const initState = [{
    'coin_id': 'Loading',
    'available_supply': 0,
    'cn_name': 'Loading',
    'en_name': 'Loading',
    'icon': 'Loading',
    'name': 'Loading',
    'percent_change_24h': 0,
    'price_usd': 0,
    'symbol': 'Loading',
    'max_supply': 0
}]

const headerRollMsg = (state = initState, action) => {
    switch (action.type) {
        case GETHEADERROLLMSG:
            return action.data
        default:
            return state
    }
}

export default headerRollMsg
