/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */

import {axiosPostAjax} from '../public'

import {
    LIVESLIST,
    PASTLIST
} from '../constants/index'

export const getLivesList = (obj) => (dispatch) => {
    axiosPostAjax('post', '/push/text/room/list', obj, (data) => {
        if (data.code === 1) {
            dispatch({
                type: LIVESLIST,
                data
            })
        }
    })
}

export const getPastList = (obj) => (dispatch) => {
    axiosPostAjax('post', '/push/text/room/content/list', obj, (data) => {
        if (data.code === 1) {
            dispatch({
                type: PASTLIST,
                data
            })
        }
    })
}
