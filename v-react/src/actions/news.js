/**
 * Author：liushaozong
 * Time：2017/7/27
 * Description：news actions
 */

import {axiosAjax, axiosPostAjax} from '../public/index'
import Cookies from 'js-cookie'
import '../../node_modules/layui-layer/dist/layer.js'

import {
    INDEXNEWSLIST,
    INDEXNEWSLISTMORE,
    INDEXNEWSRECOMMEND,
    NEWSCORRELATION,
    NEWSDETAILS,
    APIADDRESSINFO as APIADDRESS,
    NEWSLISTRECOMMEND,
    GETHOTNEWS,
    GETRECOMMENDNEWS,
    GETCOLUMNNEWSLIST,
    GETMYNEWS,
    NEWSCOLLECT
    // HOTLABEL,
    // HOTLABELMORE
} from '../constants/index'

// 首页新闻列表 、 查看更多
export const getIndexNewsList = (currentPage, pageSize, channelId, type, tags, userId) => {
    let url = ''
    let param = {}

    if (tags) {
        url = APIADDRESS + '/news/relatednews1'
        param = {
            currentPage: currentPage,
            pageSize: pageSize,
            tags: tags
        }
    } else if (userId) {
        url = APIADDRESS + '/news/showcolumnlist'
        param = {
            passportId: userId,
            currentPage: currentPage,
            pageSize: pageSize,
            status: 1
        }
    } else {
        url = APIADDRESS + '/news/shownews'
        param = {
            currentPage: currentPage,
            pageSize: pageSize,
            channelId: channelId
        }
    }

    return (dispatch) => {
        axiosAjax('GET', url, param, function (data) {
            const serverDate = data.obj.currentTime

            const inforList = data.obj.inforList
            let newInforList = []
            inforList.map(function (d, i) {
                newInforList.push(Object.assign({}, d, {currentTime: serverDate}))
            })

            if (type === 1) {
                dispatch({
                    type: INDEXNEWSLIST,
                    data: Object.assign({}, data.obj, {inforList: newInforList})
                })
            } else if (type === 2) {
                dispatch({
                    type: INDEXNEWSLISTMORE,
                    data: newInforList
                })
            }
        })
    }
}

export const getUserNewsList = (obj, type = 1) => (dispatch) => {
    axiosPostAjax('POST', APIADDRESS + '/news/showcolumnlist', obj, (data) => {
        const serverDate = data.obj.currentTime

        const inforList = data.obj.inforList
        let newInforList = []
        inforList.map(function (d, i) {
            newInforList.push(Object.assign({}, d, {currentTime: serverDate}))
        })
        if (type === 1) {
            dispatch({
                type: INDEXNEWSLIST,
                data: Object.assign({}, data.obj, {inforList: newInforList})
            })
        } else {
            dispatch({
                type: INDEXNEWSLISTMORE,
                data: Object.assign({}, data.obj, {inforList: newInforList})
            })
        }
    })
}

// 首页四个新闻图
export const getIndexNewsRecommend = (pageSize) => {
    return (dispatch) => {
        axiosAjax('GET', APIADDRESS + '/news/shownews', {
            pageSize: pageSize,
            recommend: 1
        }, function (data) {
            dispatch({
                type: INDEXNEWSRECOMMEND,
                data: data.obj
            })
        })
    }
}

// 新闻详情
export const getNewsDetails = (id) => {
    return (dispatch) => {
        axiosAjax('GET', APIADDRESS + '/news/getbyid', {
            id: id,
            passportId: Cookies.get('hx_user_id') || null,
            token: Cookies.get('hx_user_token') || null
        }, function (data) {
            if (data.code === 1) {
                dispatch({
                    type: NEWSDETAILS,
                    data: {...data}
                })
                dispatch(correlation(data.obj.current.tags, data.obj.current.id, 6))
            } else if (data.code === -1) {
                layer.msg(data.msg)
            } else if (data.code === -4) {
                window.location.reload()
            }
        })
    }
}
const correlation = (tags, id, newsCounts) => {
    return (dispatch) => {
        axiosAjax('GET', APIADDRESS + '/news/relatednews', {
            tags: tags,
            id: id,
            newsCounts: newsCounts
        }, function (data) {
            dispatch({
                type: NEWSCORRELATION,
                data
            })
        })
    }
}
// 相关新闻
export const getNewsCorrelation = (tags, id, newsCounts) => {
    return (dispatch) => {
        axiosAjax('GET', APIADDRESS + '/news/relatednews', {
            tags: tags,
            id: id,
            newsCounts: newsCounts
        }, function (data) {
            dispatch({
                type: NEWSCORRELATION,
                data
            })
        })
    }
}

// 热门新闻
export const getHotNews = () => {
    return (dispatch) => {
        axiosAjax('GET', APIADDRESS + '/news/hotnews', {
            lastDays: 3,
            readCounts: 50,
            newsCounts: 10
        }, function (data) {
            dispatch({
                type: GETHOTNEWS,
                data
            })
        })
    }
}

// 新闻排行
export const getRecommendNews = () => {
    return (dispatch) => {
        axiosAjax('GET', APIADDRESS + '/news/recommend', {
            lastDays: 3,
            readCounts: 50,
            newsCounts: 10
        }, function (data) {
            dispatch({
                type: GETRECOMMENDNEWS,
                data
            })
        })
    }
}

// 新闻列表新闻推荐
export const getNewsListRecommend = (lastDays, readCounts, newsCounts) => {
    return (dispatch) => {
        axiosAjax('GET', APIADDRESS + '/news/hotnews', {
            lastDays: lastDays,
            readCounts: readCounts,
            newsCounts: newsCounts
        }, function (data) {
            dispatch({
                type: NEWSLISTRECOMMEND,
                data
            })
        })
    }
}

// 用户收藏新闻列表
export const getNewsListColumn = (obj, fn) => (dispatch) => {
    axiosPostAjax('POST', APIADDRESS + '/news/collectlist', obj, (data) => {
        dispatch({
            type: GETCOLUMNNEWSLIST,
            data
        })
        fn && fn()
    })
}

// 获取用户新闻

export const getMyNewsList = (obj, fn) => (dispatch) => {
    axiosPostAjax('POST', APIADDRESS + '/news/showcolumnlist', obj, (data) => {
        dispatch({
            type: GETMYNEWS,
            data
        })
        fn && fn()
    })
}

// 新闻收藏按钮

export const collectNews = (params) => {
    return (dispatch) => {
        axiosPostAjax('POST', '/info/news/collect', params, function (data) {
            let actionCollect = {ifCollect: params.status}
            if (data.code === 1) {
                dispatch({
                    type: NEWSCOLLECT,
                    actionCollect
                })
            }
        })
    }
}

// 热门标签
/* export const getHotLabel = (currentPage, pageSize, tags, type, fn) => {
    return (dispatch) => {
        axiosAjax('get', '/info/news/relatednews1', {
            currentPage: currentPage,
            pageSize: pageSize,
            tags: tags
        }, function (data) {
            console.log(data)
            const serverDate = data.obj.currentTime
            const inforList = data.obj.inforList ? data.obj.inforList : []
            let newInforList = []
            inforList.map(function (d, i) {
                newInforList.push(Object.assign({}, d, {currentTime: serverDate}))
            })
            if (type === 1) {
                dispatch({
                    type: HOTLABEL,
                    data: Object.assign({}, data.obj, {inforList: newInforList})
                })
            } else if (type === 2) {
                dispatch({
                    type: HOTLABELMORE,
                    data: newInforList
                })
            }
            if (fn) {
                fn(data)
            }
        })
    }
} */
