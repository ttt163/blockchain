/**
 * Author：zhoushuanglong
 * Time：2018-02-27 20:00
 * Description：Description
 */

import {GETNEWSCOMMENTS, GETMORENEWSCOMMENTS, REPLAYCOMMENT} from '../constants'

const init = {
    'pageSize': 10,
    'recordCount': 2,
    'currentPage': 1,
    'pageCount': 1,
    'currentTime': 1519719647805,
    'inforList': [
        {
            'comment': {
                'id': 'Loading',
                'targetId': 'Loading',
                'content': 'Loading',
                'upCount': 1,
                'userId': 'Loading',
                'userNickName': 'Loading',
                'userIcon': 'Loading',
                'status': 1,
                'createTime': 1519716024000
            },
            'replies': [
                {
                    'id': 'Loading',
                    'pid': 'Loading',
                    'content': 'Loading',
                    'userId': 'Loading',
                    'userNickName': 'Loading',
                    'userIcon': 'Loading',
                    'status': 1,
                    'createTime': 1519714460000
                }
            ]
        }
    ]
}

// 新闻评论
export const newsComments = (state = init, action) => {
    switch (action.type) {
        case GETNEWSCOMMENTS:
            return action.data
        case REPLAYCOMMENT:
            let inforListReplay = state.inforList

            let objTemp = {}
            let indexTemp = -1
            inforListReplay.map(function (item, index) {
                if (action.pid === item.comment.id) {
                    objTemp = item
                    indexTemp = index
                }
            })

            objTemp.replies.unshift({
                'content': action.content,
                'userNickName': action.nickName,
                'id': action.id
            })

            inforListReplay[indexTemp] = objTemp

            return Object.assign({}, state, {inforList: inforListReplay})
        case GETMORENEWSCOMMENTS:
            let newState = state
            newState.currentTime = action.data.currentTime

            let newInforList = newState.inforList.concat(action.data.inforList)

            return Object.assign({}, state, {inforList: newInforList})
        default:
            return state
    }
}
