import {
    GETAUTHORINFO,
    ATTENTIONAUTHOR,
    CANCELATTENTION,
    GETINDEXAUTHORLIST
} from '../constants/index'
import {axiosPostAjax} from '../public/index'

export const getAuthorInfo = (obj) => (dispatch) => {
    axiosPostAjax('POST', '/info/news/getauthorinfo', obj, (data) => {
        dispatch({
            type: GETAUTHORINFO,
            actionData: data.obj
        })
    })
}

export const attentionAuthor = (obj, fn) => (dispatch) => {
    axiosPostAjax('POST', '/info/follow/author/add', obj, (data) => {
        if (data.code === 1) {
            layer.msg('关注成功!')
            dispatch({
                type: ATTENTIONAUTHOR,
                actionData: data
            })
            if (fn) {
                fn(data)
            }
        } else {
            layer.msg(data.msg)
        }
    })
}
export const cancelAttention = (obj, fn) => (dispatch) => {
    axiosPostAjax('POST', '/info/follow/author/delete', obj, (data) => {
        if (data.code === 1) {
            layer.msg('关注已取消!')
            dispatch({
                type: CANCELATTENTION,
                actionData: data
            })
            if (fn) {
                fn(data)
            }
        } else {
            layer.msg(data.msg)
        }
    })
}

// 获取首页专栏作者列表
export const getIndexAuthorList = (obj) => (dispatch) => {
    axiosPostAjax('POST', '/info/author/showauthorlist', obj, (data) => {
        dispatch({
            type: GETINDEXAUTHORLIST,
            actionData: data.obj
        })
    })
}
