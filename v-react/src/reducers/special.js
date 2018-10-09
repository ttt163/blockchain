/**
 * Author：liushaozong
 * Time：2017/7/31
 * Description：news
 */

import {
    SPECIALNEWSLIST,
    SPECIALNEWSRECOMMEND,
    BLOCKCHAINEXHIBITION
} from '../constants/index'

const specialRecommend = {
    pageSize: 2,
    recordCount: 66,
    currentPage: 2,
    pageCount: 33,
    currentTime: 1521872634827,
    inforList: [
        {
            iconUrl: '',
            passportId: '',
            nickName: '',
            role: 2,
            id: '',
            channelId: 1,
            cateId: 1,
            title: '',
            tags: '',
            synopsis: '',
            coverPic: '{"pc_recommend":"","pc":"","wap_big":"","wap_small":"h","video_pc":"","video_m":""}',
            author: '',
            source: '',
            readCounts: 1,
            hotCounts: 10452,
            status: 1,
            createdBy: '',
            createTime: 1521519453000,
            recommend: 1,
            original: 0,
            updateTime: 1521870174000,
            publishTime: 1521519439000,
            createrType: 0
        }
    ]
}

// 峰会首页新闻列表
export const reducerSpecialNews = (state = specialRecommend, action) => {
    switch (action.type) {
        case SPECIALNEWSLIST:
            return action.data
        default:
            return state
    }
}

// 峰会推荐
export const reducerSpecialRecommend = (state = specialRecommend, action) => {
    switch (action.type) {
        case SPECIALNEWSRECOMMEND:
            return action.data
        default:
            return state
    }
}

export const reducerBlockchain = (state = specialRecommend, action) => {
    switch (action.type) {
        case BLOCKCHAINEXHIBITION:
            return action.data
        default:
            return state
    }
}
