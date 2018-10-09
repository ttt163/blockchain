/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import {COMMENTNEWS} from '../constants/index'

const initState = [
    {
        id: 'Loading',
        channelId: 'Loading',
        coverPic: 'Loading',
        title: 'Loading'
    }, {
        id: 'Loading',
        channelId: 'Loading',
        coverPic: 'Loading',
        title: 'Loading'
    }, {
        id: 'Loading',
        channelId: 'Loading',
        coverPic: 'Loading',
        title: 'Loading'
    }, {
        id: 'Loading',
        channelId: 'Loading',
        coverPic: 'Loading',
        title: 'Loading'
    }
]

const commentNews = (state = initState, action) => {
    switch (action.type) {
        case COMMENTNEWS:
            return action.news
        default:
            return state
    }
}

export default commentNews
