/**
 * Author：zhoushuanglong
 * Time：2018-02-28 00:47
 * Description：Description
 */

import {
    SETLOGININFO,
    SHOWLOGIN,
    HIDELOGIN
} from '../constants/index'

const init = {
    createTime: 1519734073000,
    iconUrl: '',
    nickName: '',
    passportId: '',
    phoneNum: '',
    token: '',
    introduce: ''
}

export const loginInfo = (state = init, action) => {
    switch (action.type) {
        case SETLOGININFO:
            return {...state, ...action.obj}
        default:
            return state
    }
}

const loginInit = {
    show: false,
    type: 'login' // 'signin' || 'retrievePassword'
}

export const loginShow = (state = loginInit, action) => {
    switch (action.type) {
        case SHOWLOGIN:
            return {
                show: true,
                type: action.loginType
            }
        case HIDELOGIN:
            return {
                show: false,
                type: 'login'
            }
        default:
            return state
    }
}
