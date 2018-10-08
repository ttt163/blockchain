/**
 * Author：zhoushuanglong
 * Time：2018-04-08 15:46
 * Description：Description
 */
import {pageLoadingHide, axiosAjax, proxyUrl, formatDateMore} from '../js/public/public'
import Cookies from 'js-cookie'
$(function () {
    pageLoadingHide()
    $('.user-btn').on('click', function () {
        let userName = $('#userName').val()
        let userPass = $('#userPass').val()
        Cookies.set('apply_userName', userName, { expires: 1 })
        Cookies.set('apply_userPass', userPass, { expires: 1 })
        window.location.reload()
    })
    // window.onunload = onunloadMessage
    // function onunloadMessage () {
    //     Cookies.remove('apply_userName')
    //     Cookies.remove('apply_userPass')
    // }
    // 视频播放
    $('.apply-list').on('click', '.video-url', function () {
        let videoUrl = $(this).data('src')
        $('#videoplayWrap').show()
        $('#videoplayMask').show()
        $('#videoplayWrap video').attr('src', videoUrl)
    })
    $('#videoplayClose').on('click', function () {
        $('#videoplayWrap').hide()
        $('#videoplayMask').hide()
        $('#videoplayWrap video').attr('src', '')
    })
    function getList (type) {
        axiosAjax({
            type: 'get',
            url: `${proxyUrl}/mgr/marstrainenroll/list`,
            formData: false,
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            params: {
                activityType: type
            },
            fn: function (res) {
                if (res.code === 1) {
                    let dataArr = res.obj.inforList
                    let tabStr = ''
                    dataArr.map(function (item, index) {
                        let x = null
                        switch (Number(item.identityAttr)) {
                            case 1:
                                x = '创始人'
                                break
                            case 2:
                                x = '投资人'
                                break
                            case 3:
                                x = '合伙人'
                                break
                            case 4:
                                x = '高管'
                                break
                            case 5:
                                x = '其他职员'
                                break
                            default:
                        }
                        let videoArr = item.refereeVideo.split(',')
                        let videoStr = ''
                        for (let j = 0; j < videoArr.length; j++) {
                            if (videoArr[j] === '') {
                                continue
                            } else {
                                videoStr += `<span class="video-url" data-src="${videoArr[j]}">视频${j + 1}</span>`
                            }
                        }
                        tabStr += `<tr>
                            <td>${index}</td>
                            <td>${formatDateMore(item.createTime)}</td>
                            <td class="name">${item.name}</td>
                            <td class="age">${item.age}</td>
                            <td class="phone">${item.phoneNum}</td>
                            <td class="wechat">${item.wechat}</td>
                            <td class="mail">${item.email}</td>
                            <td class="cyty">${item.city}</td>
                            <td class="firm">${item.company}</td>
                            <td class="position">${x}</td>
                            <td class="about">${item.companyInfo}</td>
                            <td class="school">${item.attentReason}</td>
                            <td class="train">${item.trainingInfo}</td>
                            <td class="source">${item.acquireChannel}</td>
                            <td class="video">${videoStr}</td>
                        </tr>`
                    })
                    $('.apply-list table tbody').html(tabStr)
                }
            }
        })
    }
    $('.apply-title p').on('click', function () {
        $(this).addClass('active').siblings().removeClass('active')
        let index = $(this).data('index')
        getList(index)
    })
})
