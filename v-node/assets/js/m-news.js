/**
 * Author：zhoushuanglong
 * Time：2018-04-08 15:46
 * Description：Description
 */

import {pageLoadingHide} from '../js/public/public'
import {TopNav} from './modules/m-topNav'
import {NewsList} from './modules/m-newsList'

$(function () {
    pageLoadingHide()
    let currBox = $('#currNewsBox')
    let searchId = currBox.data('id')

    let topNav = new TopNav({isHideTop: false})
    topNav.init()

    // 新闻列表
    new NewsList(currBox.find('.list-box'), searchId).init()
})
