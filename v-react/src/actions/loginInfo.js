/**
 * Author：zhoushuanglong
 * Time：2018-02-28 00:51
 * Description：login info
 */

import {
    SETLOGININFO,
    SHOWLOGIN,
    HIDELOGIN
} from '../constants/index'

export const setLoginInfo = (obj) => {
    return {
        type: SETLOGININFO,
        obj
    }
}

export const showLogin = (loginType) => {
    return {
        type: SHOWLOGIN,
        loginType
    }
}

export const hideLogin = () => {
    return {
        type: HIDELOGIN
    }
}
