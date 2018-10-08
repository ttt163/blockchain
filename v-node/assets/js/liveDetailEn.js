/**
 * Author：tantingting
 * Time：2018/4/9
 * Description：Description
 */
import {pageLoadingHide} from './public/public'
import {LiveDetailConnect} from './liveEn/liveDetail'

$(function () {
    pageLoadingHide()

    let id = $('.live-wrap').data('id')
    let liveDeatil = new LiveDetailConnect(id, $('#replyBox'))
    liveDeatil.init()
})
