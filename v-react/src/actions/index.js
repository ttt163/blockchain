/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */

import {
    APIADDRESSMARKET as APIADDRESS,
    GETHEADERROLLMSG
} from '../constants/index'

import {axiosAjaxNoLoading} from '../public/index'

export const getHeaderRollMsg = (lang) => {
    return (dispatch) => {
        axiosAjaxNoLoading('POST', APIADDRESS + '/coin/total', {}, function (data) {
            const coinArr = data.data.coin
            axiosAjaxNoLoading('GET', APIADDRESS + '/coin/financerate', {}, function (data) {
                let newCoinArr = []
                const coinType = lang === 'zh' ? data.data.legal_rate.CNY : data.data.legal_rate.USD
                coinArr.map(function (d, i) {
                    newCoinArr.push(Object.assign({}, d, {price_usd: d.price_usd * coinType}))
                })
                dispatch({
                    type: GETHEADERROLLMSG,
                    data: newCoinArr
                })
            }, 'noloading')
        }, 'noloading')
    }
}
