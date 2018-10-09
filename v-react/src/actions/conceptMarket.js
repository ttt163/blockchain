
/**
 * Created by zhang on 2018/1/30.
 */

import {
    CONCEPTMARKET
} from '../constants/index'

import {axiosAjax} from '../public'

export const conceptMarket = (params) => {
    return (
        (dispatch) => {
            axiosAjax('POST', '/market/coin/concept', {currId: null, ...params}, function (data) {
                const actionData = data.data
                dispatch({
                    type: CONCEPTMARKET,
                    conceptMarket: actionData
                })
            })
        }
    )
}
