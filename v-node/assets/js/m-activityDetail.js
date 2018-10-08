/**
 * @Author：liushaozong
 * @Time：2018-08-15 11:30
 * @Desc：activity
 */
import {
    pageLoadingHide
} from './public/public'
import {TopNav} from './modules/m-topNav'

$(function () {
    pageLoadingHide()
    let topNav = new TopNav({isHideTop: false})
    topNav.init()
})
