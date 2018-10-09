/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import {HOTSUBJECT, HOTSUBJECTTOPIC} from '../constants/index'
const obj = {
    pageSize: 20,
    recordCount: 0,
    currentPage: 1,
    pageCount: 0,
    inforList: [
        {
            'topic': {
                'id': '',
                'topicName': '',
                'mImgSrc': '',
                'pcImgSrc': '',
                'mBackImage': '',
                'pcBackImage': '',
                'status': 2,
                'type': 4
            },
            'contentList': [
                {
                    'id': '',
                    'topicId': '',
                    'title': '',
                    'url': '',
                    'status': 1,
                    'synopsis': '',
                    'coverPic': '',
                    'publishTime': 1522486914000
                }
            ]
        }
    ]
}
let topic = {
    'id': '',
    'topicName': '',
    'mImgSrc': '',
    'pcImgSrc': '',
    'mBackImage': '',
    'pcBackImage': '',
    'status': 1,
    'type': 3,
    'typeLink': '',
    'createTime': ''
}
export const hotSubject = (state = obj, action) => {
    switch (action.type) {
        case HOTSUBJECT:
            return action.data
        default:
            return state
    }
}

export const hotSubjectTopic = (state = topic, action) => {
    switch (action.type) {
        case HOTSUBJECTTOPIC:
            return action.data
        default:
            return state
    }
}
