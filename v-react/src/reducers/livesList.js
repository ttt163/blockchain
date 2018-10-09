/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import {LIVESLIST, PASTLIST} from '../constants/index'

const obj = {
    pageSize: 20,
    recordCount: 1,
    currentPage: 1,
    pageCount: 1,
    inforList: []
}

export const livesList = (state = obj, action) => {
    switch (action.type) {
        case LIVESLIST:
            return action.data.data
        default:
            return state
    }
}

const previous = {
    data: {
        contentList: [
            {
                content: {
                    castId: '',
                    content: '',
                    contentId: '',
                    createTime: '',
                    updateTime: ''
                },
                user: {
                    createTime: '',
                    description: '',
                    headUrl: '',
                    userId: '',
                    userName: '',
                    userType: ''
                }
            }
        ],
        room: {
            guest: {
                description: '',
                headUrl: '',
                userName: ''
            },
            presenter: {
                description: '',
                headUrl: '',
                userName: ''
            },
            webcast: {
                wbackImage: '',
                beginTime: '',
                coverPic: '',
                desc: '',
                guestId: '',
                presenterId: '',
                status: '',
                title: '',
                updateIime: ''
            }
        }
    }
}

export const pastList = (state = previous, action) => {
    switch (action.type) {
        case PASTLIST:
            return action.data
        default:
            return state
    }
}
