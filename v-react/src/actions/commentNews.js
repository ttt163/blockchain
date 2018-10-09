/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */

import {
    COMMENTNEWS
} from '../constants/index'

export const getCommentNews = () => {
    return {
        type: COMMENTNEWS,
        news: [
            {
                name: 'BTC-比特币',
                title: '经济参考报:比特币”博傻”进入下半场'
            }, {
                name: 'BTC-比特币',
                title: '经济参考报:比特币”博傻”进入下半场'
            }, {
                name: 'BTC-比特币',
                title: '经济参考报:比特币”博傻”进入下半场'
            }, {
                name: 'BTC-比特币',
                title: '经济参考报:比特币”博傻”进入下半场'
            }

        ]
    }
    /* return (dispatch) => {
        axiosAjax('GET', '/api_login', {
            email: email,
            password: password
        }, function (data) {
            Cookies.get('email', data.data.email)
            Cookies.get('password', data.data.password)
            const actionData = data.data
            dispatch({
                type: LOGIN,
                actionData
            })
            browserHistory.push('/')
        })
    } */
}
