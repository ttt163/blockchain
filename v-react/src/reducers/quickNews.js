/**
 * Author：zhoushuanglong
 * Time：2018-01-26 15:44
 * Description：quick news
 */

import {GETQUICKNEWSLIST, GETMOREQUICKNEWSLIST, GOODPROFIT, BADPROFIT} from '../constants/index'

const initState = {
    pageSize: 0,
    recordCount: 0,
    currentPage: 1,
    pageCount: 0,
    inforList: [
        {
            id: 'id',
            content: 'Loading',
            upCounts: 0,
            downCounts: 0,
            images: '0',
            urlName: 'urlName',
            url: '',
            status: 1,
            createdTime: new Date()
        }
    ],
    linkResult: null
}

const quickNews = (state = initState, action) => {
    switch (action.type) {
        case GETQUICKNEWSLIST:
            return action.data
        case GETMOREQUICKNEWSLIST:
            let quickNewsListMore = state.inforList
            action.data.inforList.map((d, i) => {
                quickNewsListMore.push(d)
            })
            return Object.assign({}, state, {inforList: quickNewsListMore})
        case GOODPROFIT:
            let updateId = action.data.id
            let listUp = state.inforList
            listUp.map((item) => {
                if (item.id === updateId) {
                    if (item.type) {
                        if ((parseInt(item.type) === 1)) {
                            delete item.type
                            if (item.upCounts > 0) {
                                item.upCounts = item.upCounts - 1
                            } else {
                                item.upCounts = 0
                            }
                        } else {
                            item.type = '1'
                            item.upCounts = item.upCounts + 1
                            if (item.downCounts > 0) {
                                item.downCounts = item.downCounts - 1
                            } else {
                                item.downCounts = 0
                            }
                        }
                    } else {
                        item.type = '1'
                        item.upCounts = item.upCounts + 1
                    }
                    return false
                }
            })
            return {...state, inforList: listUp, likeResult: updateId}
        case BADPROFIT:
            let downdateId = action.data.id
            let listDown = state.inforList
            listDown.map((item) => {
                if (item.id === downdateId) {
                    if (item.type) {
                        if ((parseInt(item.type) === 0)) {
                            delete item.type
                            if (item.downCounts > 0) {
                                item.downCounts = item.downCounts - 1
                            } else {
                                item.downCounts = 0
                            }
                        } else {
                            item.type = '0'
                            item.downCounts = item.downCounts + 1
                            if (item.upCounts > 0) {
                                item.upCounts = item.upCounts - 1
                            } else {
                                item.upCounts = 0
                            }
                        }
                    } else {
                        item.type = '0'
                        item.downCounts = item.downCounts + 1
                    }
                    return false
                }
            })
            return {...state, inforList: listDown, likeResult: downdateId}
        default:
            return state
    }
}

export {quickNews}
