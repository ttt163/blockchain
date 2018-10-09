/**
 * Author：liushaozong
 * Time：2017/7/31
 * Description：newsSearch
 */

import {
    NEWSSEARCH
} from '../constants/index'

const obj = {
    currentIndex: 0,
    totalIndex: 0,
    totalCount: 0,
    pageSize: 0,
    datas: [{
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
        status: '',
        synopsis: '',
        tags: '',
        title: '',
        updateTime: ''
    }]
}
// 新闻关键词搜索
const reducerNewsSearch = (state = obj, action) => {
    switch (action.type) {
        case NEWSSEARCH:
            return action.data.obj
        default:
            return state
    }
}

export default reducerNewsSearch
