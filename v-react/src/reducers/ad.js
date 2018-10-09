/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import {AD} from '../constants/index'

const adInfo = (state = {all: {}, mainTop: {}, mainCenterLeft: {}, mainCenterRight: {}, mainBottom: {}, newsDetailTop: {}, newsDetailBottom: {}, relateNews: {}}, action) => {
    switch (action.type) {
        case AD:
            let place = action.actionData.adPlace
            if (place === 1) {
                return {...state, mainTop: action.actionData}
            } else if (place === 2) {
                return {...state, mainCenterLeft: action.actionData}
            } else if (place === 3) {
                return {...state, mainCenterRight: action.actionData}
            } else if (place === 4) {
                return {...state, mainBottom: action.actionData}
            } else if (place === 5) {
                return {...state, newsDetailTop: action.actionData}
            } else if (place === 6) {
                return {...state, newsDetailBottom: action.actionData}
            } else if (place === 7) {
                return {...state, relateNews: action.actionData}
            } else {
                return {...state, all: action.actionData}
            }
        default:
            return state
    }
}

export default adInfo
