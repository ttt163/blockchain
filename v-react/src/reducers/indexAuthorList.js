import {
    GETINDEXAUTHORLIST
} from '../constants/index'

const authorList = (state = {listInfo: {}}, action) => {
    switch (action.type) {
        case GETINDEXAUTHORLIST:
            return {...state, listInfo: {...action.actionData}}
        default:
            return state
    }
}

export default authorList
