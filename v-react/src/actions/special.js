/**
 * Author：liushaozong
 * Time：2017/7/27
 * Description：news actions
 */

import {axiosAjax} from '../public/index'

import {
    SPECIALNEWSLIST,
    APIADDRESSINFO,
    SPECIALNEWSRECOMMEND,
    BLOCKCHAINEXHIBITION
} from '../constants/index'

// 新闻列表
export const getSpecialNewsList = (currentPage, pageSize, channelId) => {
    return (dispatch) => {
        axiosAjax('GET', APIADDRESSINFO + '/news/shownews', {
            currentPage: currentPage,
            pageSize: pageSize,
            channelId: channelId
        }, function (data) {
            dispatch({
                type: SPECIALNEWSLIST,
                data: data.obj
            })
        })
    }
}

// 峰会推荐
export const getSpecialRecommend = (currentPage, pageSize, recommend, channelId) => {
    return (dispatch) => {
        axiosAjax('GET', APIADDRESSINFO + '/news/shownews', {
            currentPage: currentPage,
            pageSize: pageSize,
            recommend: recommend,
            channelId: channelId
        }, function (data) {
            dispatch({
                type: SPECIALNEWSRECOMMEND,
                data: data.obj
            })
        })
    }
}

// 区块链

export const getExhibition = (currentPage, pageSize, tags) => {
    return (dispatch) => {
        axiosAjax('GET', APIADDRESSINFO + '/news/relatednews1', {
            currentPage: currentPage,
            pageSize: pageSize,
            tags: tags
        }, function (data) {
            dispatch({
                type: BLOCKCHAINEXHIBITION,
                data: data.obj
            })
        })
    }
}
