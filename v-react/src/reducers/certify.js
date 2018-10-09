import {CERTIFY} from '../constants'

export const certifyState = (state = {certifyState: -2}, action) => {
    switch (action.type) {
        case CERTIFY:
            return action.actionData
        default:
            return state
    }
}
