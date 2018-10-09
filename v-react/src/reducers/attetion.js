import {
    GETFOLLOWLIST
} from '../constants/index'

export const followList = (state = {list: []}, action) => {
    switch (action.type) {
        case GETFOLLOWLIST:
            let listData = action.actionData || []
            listData.map((item, index) => {
                item.ifCollect = 1
                return item
            })
            return {...state, list: listData}
        default:
            return state
    }
}
