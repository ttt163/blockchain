/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */

import {axiosPostAjax} from '../public'

import {
    HOTSUBJECT,
    APIADDRESSINFO,
    HOTSUBJECTTOPIC
} from '../constants/index'

export const getHotSubject = (obj) => (dispatch) => {
    axiosPostAjax('post', APIADDRESSINFO + '/topic/listall', obj, (data) => {
        if (data.code === 1) {
            dispatch({
                type: HOTSUBJECT,
                data: data.obj
            })
        }
    })
}

export const getHotSubjectTopic = (obj) => (dispatch) => {
    axiosPostAjax('post', APIADDRESSINFO + '/topic/querytopic', obj, (data) => {
        if (data.code === 1) {
            dispatch({
                type: HOTSUBJECTTOPIC,
                data: data.obj
            })
        }
    })
}
