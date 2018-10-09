/**
 * Author：liushaozong
 * Time：2017/7/31
 * Description：newsSearch
 */

import {
    GETUSERINFO,
    USERUPLOADIMG,
    USERUPDATEIMG,
    USERUPDATENICK,
    AUTHORMESSAGE
} from '../constants/index'

// 新闻关键词搜索
const reducerUser = (state = {userInfo: {}, uploadInfo: {}, updateInfo: {}, userNick: {}, authorMessage: {}}, action) => {
    switch (action.type) {
        case GETUSERINFO:
            return {...state, userInfo: action.data}
        case USERUPLOADIMG:
            return {...state, uploadInfo: action.data}
        case USERUPDATEIMG:
            return {...state, updateInfo: action.data}
        case USERUPDATENICK:
            return {...state, userNick: action.data}
        case AUTHORMESSAGE:
            return {...state, authorMessage: action.data}
        default:
            return state
    }
}

export default reducerUser
