/**
 * @Author：liushaozong
 * @Time：2018-08-15 11:30
 * @Desc：activity
 */
import {pageLoadingHide} from './public/public'

$(function () {
    pageLoadingHide()
    $('#shareBox').share({sites: ['qq', 'weibo', 'wechat']})
})
