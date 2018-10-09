import {SETLOGININFO, APIPASSPORT} from '../constants'
import { axiosPostAjax } from '../public'

export const getUserInfo = (obj) => (dispatch) => {
    axiosPostAjax('POST', APIPASSPORT + '/account/getuserinfo', obj, (data) => {
        let obj = data.obj[0]
        dispatch({
            type: SETLOGININFO,
            obj
        })
    })
}

export const certify = (obj) => (dispatch) => {
    axiosPostAjax('POST', APIPASSPORT + '/account/addrealauth', obj, (data) => {
        dispatch({
            type: SETLOGININFO,
            obj: {realAuth: 0}
        })
    })
}

export const updaterealauth = (obj, fn) => (dispatch) => {
    axiosPostAjax('POST', APIPASSPORT + '/account/updaterealauth', obj, (data) => {
        dispatch({
            type: SETLOGININFO,
            obj: {realAuth: -2}
        })
        fn && fn()
    })
}
