/**
 * Author：liushaozong
 * Time：2017/7/27
 * Description：news actions
 */

import {axiosAjax} from '../public/index'
import {
    NEWSSEARCH
} from '../constants/index'

// 新闻关键词搜索
export const getNewsSearch = (page, pageSize, inputVal) => {
    return (dispatch) => {
        axiosAjax('GET', 'info/news/search', {
            page: page,
            pageSize: pageSize,
            q: inputVal
        }, function (data) {
            dispatch({
                type: NEWSSEARCH,
                data
            })
        })
    }
}
