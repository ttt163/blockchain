/**
 * Author：tantingting
 * Time：2018/4/27
 * Description：Description
 */
import {pageLoadingHide} from './public/public'
import {TopNav} from './modules/m-topNav'

$(function () {
    pageLoadingHide()
    let opt = {
        isNoSlide: true,
        isBack: true
    }
    let topNav = new TopNav(opt)
    topNav.init()
})
