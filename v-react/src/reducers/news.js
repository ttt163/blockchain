/**
 * Author：liushaozong
 * Time：2017/7/31
 * Description：news
 */

import {
    INDEXNEWSLIST,
    INDEXNEWSLISTMORE,
    INDEXNEWSRECOMMEND,
    NEWSCORRELATION,
    NEWSDETAILS,
    NEWSLISTRECOMMEND,
    GETHOTNEWS,
    GETRECOMMENDNEWS,
    GETCOLUMNNEWSLIST,
    GETMYNEWS,
    NEWSCOLLECT,
    CLEARNEWS
    // HOTLABEL,
    // HOTLABELMORE
} from '../constants/index'

const obj = {
    currentPage: 0,
    pageCount: 0,
    recordCount: 0,
    pageSize: 0,
    inforList: [{
        author: '',
        cateId: '',
        channelId: '',
        content: '',
        coverPic: '{"pc": "Loading", "wap_big": "Loading", "wap_small": "Loading"}',
        createTime: '',
        id: '',
        readCounts: '',
        recommend: '',
        source: '',
        status: -1,
        synopsis: '',
        tags: '',
        title: '',
        updateTime: ''
    }]
}

// 首页新闻列表
export const reducerNewList = (state = obj, action) => {
    switch (action.type) {
        case INDEXNEWSLIST:
            return action.data
        case INDEXNEWSLISTMORE:
            let newsListMore = state.inforList
            action.data.map((d, i) => {
                newsListMore.push(d)
            })
            return Object.assign({}, state, {inforList: newsListMore})
        default:
            return state
    }
}

// 首页四个新闻
export const reducerNewRecommend = (state = obj, action) => {
    switch (action.type) {
        case INDEXNEWSRECOMMEND:
            return Object.assign({}, state, {inforList: action.data.inforList})
        default:
            return state
    }
}

// 相关新闻
export const reducerNewCorrelation = (state = obj, action) => {
    switch (action.type) {
        case NEWSCORRELATION:
            console.log(state)
            return Object.assign({}, state, {inforList: action.data.obj.inforList})
        default:
            return state
    }
}

export const reducerColumnNews = (state = obj, action) => {
    switch (action.type) {
        case GETCOLUMNNEWSLIST:
            return {...state, ...action.data.obj}
        case CLEARNEWS:
        default:
            return state
    }
}

export const reducerMyNews = (state = obj, action) => {
    switch (action.type) {
        case GETMYNEWS:
            return {...state, ...action.data.obj}
        default:
            return state
    }
}

// 新闻详情
const newDetails = {
    code: 0,
    msg: '',
    obj: {
        current: {
            audio: '',
            author: '',
            cateId: '',
            channelId: '',
            content: '',
            coverPic: '{"pc": "Loading", "wap_big": "Loading", "wap_small": "Loading"}',
            createTime: '1517045621000',
            id: '',
            readCounts: '',
            recommend: '',
            source: '',
            status: '',
            synopsis: '',
            tags: '',
            title: '',
            updateTime: ''
        },
        prev: {
            channelId: '',
            id: '',
            title: ''
        },
        ifCollect: -1,
        next: {
            channelId: '',
            id: '',
            title: ''
        }
    }
}
export const reducerNewsDetails = (state = newDetails, action) => {
    switch (action.type) {
        case NEWSDETAILS:
            return action.data
        case NEWSCOLLECT:
            return {...state, obj: {...state.obj, ifCollect: action.actionCollect.ifCollect}}
        default:
            return state
    }
}

// 新闻列表新闻推荐
export const reducerNewListRecommend = (state = obj, action) => {
    switch (action.type) {
        case NEWSLISTRECOMMEND:
            return Object.assign({}, state, {inforList: action.data.obj.inforList})
        case CLEARNEWS:
        default:
            return state
    }
}

// 热门新闻
export const reducerHotNews = (state = obj, action) => {
    switch (action.type) {
        case GETHOTNEWS:
            return Object.assign({}, state, {inforList: action.data.obj.inforList})
        default:
            return state
    }
}

// 新闻排行
export const reducerRecommendNews = (state = obj, action) => {
    switch (action.type) {
        case GETRECOMMENDNEWS:
            return Object.assign({}, state, {inforList: action.data.obj.inforList})
        default:
            return state
    }
}

// 热门标签
/* export const reducerHotLabel = (state = obj, action) => {
    switch (action.type) {
        case HOTLABEL:
            return action.data
        case HOTLABELMORE:
            let newsListMore = state.inforList
            action.data.map((d, i) => {
                newsListMore.push(d)
            })
            return Object.assign({}, state, {inforList: newsListMore})
        default:
            return state
    }
} */
