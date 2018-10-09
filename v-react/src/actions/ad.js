/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */

import {axiosAjax} from '../public'

import {
    AD
} from '../constants/index'

export const getAdInfo = (params) => {
    return (dispatch) => {
        axiosAjax('GET', '/info/ad/showad', {...params, type: 1}, (data) => {
            if (data.code === 1) {
                const actionData = {...data.obj, adPlace: params.adPlace}
                dispatch({
                    type: AD,
                    actionData
                })
            }
        })
    }
}
