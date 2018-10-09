/**
 * Author：zhoushuanglong
 * Time：2018-02-27 19:59
 * Description：Description
 */

import Cookies from 'js-cookie'
import {
    GETNEWSCOMMENTS,
    GETMORENEWSCOMMENTS,
    APIADDRESSINFO,
    REPLAYCOMMENT
} from '../constants'
import {axiosAjax} from '../public'
import '../../node_modules/layui-layer/dist/layer.js'

export const getNewsConments = (articleId, currentPage, pageSize, checkMore) => {
    return (dispatch) => {
        axiosAjax('GET', APIADDRESSINFO + '/comment/getbyarticle', {
            id: articleId,
            currentPage: currentPage,
            pageSize: pageSize
        }, function (data) {
            if (!checkMore) {
                dispatch({
                    type: GETNEWSCOMMENTS,
                    data: data.obj
                })
            } else {
                dispatch({
                    type: GETMORENEWSCOMMENTS,
                    data: data.obj
                })
            }
        })
    }
}

export const conmentReplay = (articleId, pid, content, fn) => {
    const userToken = Cookies.get('hx_user_token')
    const userId = Cookies.get('hx_user_id')
    const nickName = Cookies.get('hx_user_nickname')

    return (dispatch) => {
        axiosAjax('GET', APIADDRESSINFO + '/comment/reply', {
            token: userToken,
            targetId: articleId,
            pid: pid,
            content: content,
            userId: userId,
            userNickName: nickName
        }, function (data) {
            console.log(data)
            if (data.code === -1) {
                layer.msg(data.msg)
                return false
            }
            if (data.code === 1) {
                fn()
                dispatch({
                    type: REPLAYCOMMENT,
                    pid: pid,
                    content: content,
                    nickName: nickName,
                    id: data.obj.id
                })
            } else {
                layer.msg(data.msg)
            }
        })
    }
}

export const commentedNews = (articleId, content, fn) => {
    const userToken = Cookies.get('hx_user_token')
    const userId = Cookies.get('hx_user_id')
    const nickName = Cookies.get('hx_user_nickname')

    return (dispatch) => {
        axiosAjax('GET', APIADDRESSINFO + '/comment/add', {
            token: userToken,
            targetId: articleId,
            content: content,
            userId: userId,
            userNickName: nickName
        }, function (data) {
            if (data.code === 1) {
                fn()
            } else if (data.code === -1) {
                layer.msg(data.msg)
            } else {
                layer.msg(data.msg)
            }
        })
    }
}

export const delCommentReplay = (id, fn) => {
    const userToken = Cookies.get('hx_user_token')
    const userId = Cookies.get('hx_user_id')

    return (dispatch) => {
        axiosAjax('GET', APIADDRESSINFO + '/comment/del', {
            id: id,
            token: userToken,
            passportid: userId
        }, function (data) {
            if (data.code === 1) {
                fn()
            } else {
                layer.msg(data.msg)
            }
        })
    }
}
