/**
 * Author：liushaozong
 * Time：2017/7/27
 * Description：news actions
 */

import {axiosAjax, axiosFormData, axiosPostAjax, axiosArticleAjax} from '../public/index'
import Cookies from 'js-cookie'
import '../../node_modules/layui-layer/dist/layer.js'

import {setLoginInfo} from './loginInfo'
import {
    GETUSERINFO,
    USERUPLOADIMG,
    USERUPDATEIMG,
    USERUPDATENICK,
    APIPASSPORT,
    APIADDRESSINFO,
    SETLOGININFO,
    AUTHORMESSAGE,
    GETFOLLOWLIST
    // ATTENTIONAUTHOR
} from '../constants/index'

// 获取用户信息(暂时未用上)
export const getUserInfo = (obj) => {
    return (dispatch) => {
        axiosAjax('GET', 'info/news/search', obj, function (data) {
            dispatch({
                type: GETUSERINFO,
                data
            })
        })
    }
}

export const uploadImgCerfy = (obj, fn) => (dispatch) => {
    axiosFormData('POST', '/mgr/picture/upload', obj, function (data) {
        fn && fn(data)
    })
}

export const uploadImg = (obj) => {
    return (dispatch) => {
        axiosFormData('POST', '/mgr/picture/upload', obj, function (data) {
            dispatch({
                type: USERUPLOADIMG,
                data
            })
            if (data.code === 1) {
                dispatch(updateImg({
                    passportid: Cookies.get('hx_user_id'),
                    token: Cookies.get('hx_user_token'),
                    url: data.obj
                }))
                dispatch(setLoginInfo({
                    iconUrl: data.obj
                }))
                dispatch({
                    type: USERUPDATEIMG,
                    data
                })
            }
        })
    }
}

export const updateImg = (obj) => {
    return (dispatch) => {
        axiosPostAjax('POST', APIPASSPORT + '/account/updateusericon', obj, function (data) {
            if (data.code === 1) {
                Cookies.set('hx_user_url', obj.url)
                // window.location.reload()
            }
        })
    }
}

export const updateNickName = (obj, fn) => {
    return (dispatch) => {
        axiosPostAjax('POST', APIPASSPORT + '/account/updateusernick', obj, function (data) {
            dispatch({
                type: USERUPDATENICK,
                data
            })
            if (data.code === 1) {
                fn(data)
            } else {
                layer.msg(data.msg)
            }
        })
    }
}

export const changePassword = (obj, fn) => {
    return (dispatch) => {
        axiosPostAjax('POST', APIPASSPORT + '/account/updateuserpw', obj, function (data) {
            fn(data)
        })
    }
}

export const sendArticle = (obj, fn) => {
    return (dispatch) => {
        axiosArticleAjax('POST', APIADDRESSINFO + '/news/columnadd', obj, function (data) {
            fn(data)
        }, 'application/x-www-form-urlencoded')
    }
}

export const changeIntro = (obj) => (dispatch) => {
    axiosPostAjax('POST', APIPASSPORT + '/account/updateintroduce', obj, (data) => {
        layer.msg(data.msg)
        if (data.code === 1) {
            dispatch({
                type: SETLOGININFO,
                obj: {introduce: obj.introduce}
            })
            Cookies.set('hx_user_url', obj.iconUrl, 'hx_user_nickname', obj.nickName, 'hx_user_id', obj.passportId)
        }
    })
}

// 作者相关信息
export const getAuthorMessage = (passportId) => {
    return (dispatch) => {
        axiosAjax('GET', APIADDRESSINFO + '/news/getauthorinfo', {
            passportId: passportId
        }, function (data) {
            dispatch({
                type: AUTHORMESSAGE,
                data
            })
        })
    }
}

// 获取用户粉丝量和文章数量
export const getAuthorInfo = (obj) => (dispatch) => {
    axiosPostAjax('POST', '/info/news/getauthorinfo', obj, (data) => {
        console.log(data)
        if (data.code === 1) {
            Cookies.set('hx_user_intro', obj.introduce)
            dispatch({
                type: SETLOGININFO,
                obj: data.obj
            })
        }
    })
}

// 获取关注用户列表
export const getFollowlist = (obj) => (dispatch) => {
    axiosPostAjax('POST', '/info/follow/author/list', obj, (data) => {
        dispatch({
            type: GETFOLLOWLIST,
            actionData: data.obj
        })
    })
}

// 关注用户
export const attentionAuthor = (obj) => (dispatch) => {
    axiosPostAjax('POST', '/info/follow/add', obj, (data) => {
        alert(data.msg)
    })
}

// 上传视频
// export const uploadvideo = (arg, fn) => {
//     return (dispatch) => {
//         axiosFormData('POST', '/mgr/file/upload', arg, function (res) {
//             // console.log(res)
//             fn(res)
//         })
//     }
// }
