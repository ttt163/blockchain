/**
 * @Author：liushaozong
 * @Time：2018-08-15 11:30
 * @Desc：activity
 */
import {
    pageLoadingHide,
    isIos,
    isAndroid,
    isWeixin
} from './public/public'

pageLoadingHide()
let iosUrl = 'https://itunes.apple.com/cn/app/id1343659925?mt=8'
let andUrl = 'http://android.myapp.com/myapp/detail.htm?apkName=com.linekong.mars24&ADTAG=mobile#opened'
$(function () {
// 未安装下载
    $('#mAppDownWx, #appDown1, #appDown2').on('click', function () {
        if (isIos()) {
            location.href = iosUrl
        } else if (isAndroid()) {
            location.href = andUrl
        }
    })
    if (window.location.href.indexOf('/appDownWx') !== -1) {
        // let id = $('.m-appDown h1').data('id')
        if (isWeixin()) {
            return false
        } else {
            let preventDefaults = function (event) {
                event = event || window.event
                if (event.preventDefault) {
                    event.preventDefault()
                } else {
                    event.returnValue = false
                }
            }
            preventDefaults()
        }
    }
})
