/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */
import {
    APIADDRESSINFO,
    NEWCOINS,
    NEWCOINSDETAILS
} from '../constants/index'

import {axiosAjax} from '../public'
// 打新币

export const getNewCoins = (currentPage, pageSize, status) => {
    return (
        (dispatch) => {
            axiosAjax('get', APIADDRESSINFO + '/ico/geticolist', {
                currentPage: currentPage,
                pageSize: pageSize,
                status: status
            }, function (data) {
                dispatch({
                    type: NEWCOINS,
                    data
                })
            })
        }
    )
}

export const getNewCoinsDetails = (id) => {
    return (
        (dispatch) => {
            axiosAjax('get', APIADDRESSINFO + '/ico/geticodetail', {
                id: id
            }, function (data) {
                dispatch({
                    type: NEWCOINSDETAILS,
                    data
                })
            })
        }
    )
}
