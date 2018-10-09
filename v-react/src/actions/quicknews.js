/**
 * Author：zhoushuanglong
 * Time：2018-01-26 15:29
 * Description：quick news action
 */

import {
    APIADDRESSINFO as APIADDRESS,
    GETQUICKNEWSLIST,
    GETMOREQUICKNEWSLIST,
    GOODPROFIT,
    BADPROFIT
} from '../constants/index'

import {axiosAjax} from '../public/index'

export const getLike = (passportid, token, status, id) => {
    return (dispatch) => {
        axiosAjax('GET', APIADDRESS + '/lives/upordown', {
            passportid: passportid,
            token: token,
            status: status,
            id: id
        }, function (data) {
            if (status === 1) {
                dispatch({
                    type: GOODPROFIT,
                    data: {...data, id: id}
                })
            } else {
                dispatch({
                    type: BADPROFIT,
                    data: {...data, id: id}
                })
            }
        })
    }
}

export const getQuickNewsList = (obj) => {
    return (dispatch) => {
        axiosAjax('GET', APIADDRESS + '/lives/showlives', {
            currentPage: obj.currentPage || 1,
            pageSize: obj.pageSize || 10,
            channelId: obj.channelId || null,
            queryTime: obj.queryTime,
            // queryTime: obj.queryTime || Date.parse(new Date()),
            passportid: obj.passportid || ''
        }, function (data) {
            let newArr = []
            data.obj.inforList.map(function (d, i) {
                newArr.push(Object.assign({}, d, {currentTime: data.currentTime}))
            })

            if (obj.type === 'more') {
                dispatch({
                    type: GETMOREQUICKNEWSLIST,
                    data: Object.assign({}, data.obj, {inforList: newArr})
                })
            } else {
                dispatch({
                    type: GETQUICKNEWSLIST,
                    data: Object.assign({}, data.obj, {inforList: newArr})
                })
            }
        })
    }
}
