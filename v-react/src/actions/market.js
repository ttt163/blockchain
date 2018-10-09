/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */
import {
    MARKET,
    MARKETRATE,
    ATTENTIONCURRECY,
    APIADDRESSMARKET,
    USERATTENTIONCURRENCY
} from '../constants/index'
import Cookies from 'js-cookie'

import {axiosAjax} from '../public'

export const getMarketList = (data) => {
    return (
        (dispatch) => {
            axiosAjax('POST', '/market/coin/querycoins', {...data, passportId: Cookies.get('hx_user_id') === undefined ? '' : Cookies.get('hx_user_id'), pageSize: 20}, function (data) {
                const actionData = data.data
                dispatch({
                    type: MARKET,
                    marketList: actionData
                })
            })
        }
    )
}

export const getRate = () => {
    return (
        (dispatch) => {
            axiosAjax('POST', '/market/coin/financerate', {}, function (data) {
                const actionData = data.data
                dispatch({
                    type: MARKETRATE,
                    marketRate: actionData.legal_rate
                })
            })
        }
    )
}

// 关注货币
export const getAttentionCurrency = (coinId, passportId, token, status) => {
    return (dispatch) => {
        axiosAjax('GET', APIADDRESSMARKET + '/coin/addcollect', {
            coinId: coinId,
            passportId: passportId,
            token: token,
            status: status
        }, function (data) {
            dispatch({
                type: ATTENTIONCURRECY,
                data: {...data, coinId: coinId}
            })
        })
    }
}

// 查询所关注的
export const getUserAttentionCurrency = (passportId, token, currentPage, pageSize) => {
    return (dispatch) => {
        axiosAjax('GET', APIADDRESSMARKET + '/coin/showcollectlist', {
            currentPage: currentPage,
            passportId: passportId,
            token: token,
            pageSize: pageSize
        }, function (data) {
            const actionData = data.data
            dispatch({
                type: USERATTENTIONCURRENCY,
                userAttention: actionData
            })
        })
    }
}
