import {
    GETAUTHORINFO,
    ATTENTIONAUTHOR,
    CANCELATTENTION
} from '../constants/index'

export const authorInfo = (state = {}, action) => {
    switch (action.type) {
        case GETAUTHORINFO:
            return {...state, ...action.actionData}
        case ATTENTIONAUTHOR:
            return {...state, ifCollect: 1, followCount: state.followCount + 1}
        case CANCELATTENTION:
            return {...state, ifCollect: 0, followCount: state.followCount - 1}
        default:
            return state
    }
}
