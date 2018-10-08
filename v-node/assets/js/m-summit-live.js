/**
 * Author：tantingting
 * Time：2018/8/13
 * Description：Description
 */

import {pageLoadingHide} from './public/public'
import {LiveConfig} from './public/liveConfig'
$(function () {
    pageLoadingHide()
    new LiveConfig().init()
})
