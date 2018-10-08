/**
 * Author：zhoushuanglong
 * Time：2018-04-08 15:46
 * Description：Description
 */
import {pageLoadingHide, axiosAjax, proxyUrl, isPoneAvailable} from '../js/public/public'
// import layer from 'layui-layer'
import '../../node_modules/layui-layer/dist/layer.js'
// if (isPc()) {
//     window.location.href = 'http://www.huoxing24.com'
// }

$(function () {
    pageLoadingHide()
    $(document.body).css('overflow', 'auto')
    function hintFn (hint) {
        let str = `<div class='hint-p'>${hint}</div>`
        $(document.body).append(str)
        setTimeout(function () {
            $('.hint-p').remove()
        }, 1500)
    }
    let pathName = location.pathname
    let pathType = 1
    if (pathName === '/mtcsign') {
        pathType = 1
    } else if (pathName === '/mtcsign2') {
        pathType = 2
    } else if (pathName === '/mtcsign3') {
        pathType = 3
    } else if (pathName === '/mtcsign4') {
        pathType = 4
    } else if (pathName === '/mtcsign5') {
        pathType = 5
    }
    function getApply (name, age, phoneNum, wechat, email, city, company, identityAttr, companyInfo, attentReason, trainingInfo, acquireChannel, refereeVideo) {
        axiosAjax({
            type: 'get',
            url: `${proxyUrl}/mgr/marstrainenroll/add`,
            formData: false,
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            params: {
                name: name,
                age: age,
                phoneNum: phoneNum,
                wechat: wechat,
                email: email,
                city: city,
                company: company,
                identityAttr: identityAttr,
                companyInfo: companyInfo,
                attentReason: attentReason,
                trainingInfo: trainingInfo,
                acquireChannel: acquireChannel,
                refereeVideo: refereeVideo,
                activityType: pathType
            },
            fn: function (res) {
                if (res.code === 1) {
                    $('.succeed-mtc').show()
                    $(document.body).css('overflow', 'hidden')
                }
            }
        })
    }

    let uploadId = ''
    let currIndex = 1
    let pause = false

    function Upload () {
        let files = document.getElementById('myFile').files
        if (files.length < 1) {
            hintFn('请选择文件~')
            return
        }
        let file = files[0]
        let totalSize = file.size // 文件大小
        let blockSize = 1024 * 1024 * 2 // 块大小
        let blockCount = Math.ceil(totalSize / blockSize) // 总块数

        // 创建FormData对象
        let formData = new FormData()
        formData.append('fileName', file.name) // 文件名
        formData.append('blockCount', blockCount) // 总块数
        formData.append('currIndex', currIndex) // 当前上传的块下标
        formData.append('uploadId', uploadId) // 上传编号
        formData.append('uploadFile', null)
        formData.append('type', 'video')
        UploadPost(file, formData, totalSize, blockCount, blockSize)
        $('#progress').html('0.00%')
    }

    function UploadPost (file, formData, totalSize, blockCount, blockSize) {
        if (pause) {
            return // 暂停
        }
        try {
            let start = (currIndex - 1) * blockSize
            let end = Math.min(totalSize, start + blockSize)
            let uploadFile = file.slice(start, end)
            formData.set('uploadFile', uploadFile)
            formData.set('currIndex', currIndex)
            formData.set('uploadId', uploadId)

            axiosAjax({
                type: 'post',
                url: `${proxyUrl}/mgr/file/upload`,
                contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                params: formData,
                fn: function (res) {
                    if (res.code === 1) {
                        if (currIndex === 1) {
                            uploadId = res.obj
                        }
                        let num = currIndex / blockCount * 100
                        if ((currIndex + 1) === blockCount) {
                            num = 100
                        }
                        $('#progress').text((num).toFixed(2) + '%')
                        if (currIndex < blockCount) {
                            currIndex++
                            UploadPost(file, formData, totalSize, blockCount, blockSize)
                        }
                    } else if (res.code < 0) {
                        console.log('code:' + res.code + ' msg:' + res.msg)
                    } else if (res.code === 2) {
                        // console.log('code:' + res.code + ' msg:' + res.msg + ' url:' + res.obj)
                        $('#progress').html('')
                        if ($('.video-list p').length === 2) {
                            $('.video-add').hide()
                        }
                        if ($('.video-list p').length === 0) {
                            $('.video-list').html(`<p data-src=${res.obj}><img alt="视频" src="../img/m-apply/video.png" data-src=${res.obj}></p>`)
                        } else {
                            $('.video-list').append(`<p data-src=${res.obj}><img alt="视频" src="../img/m-apply/video.png" data-src=${res.obj}></p>`)
                        }
                    }
                }
            })
        } catch (e) {
            alert(e)
        }
    }
    $('.video-add').on('click', function () {
        currIndex = 1
        uploadId = ''
        // Upload()
    })
    $('#myFile').on('change', function (e) {
        let filess = document.getElementById('myFile').files
        $('.inputContent .text span').html(`${e.currentTarget.files[0].name}`)
        if (filess.length > 0) {
            Upload()
        }
    })
    $('#applyBtn').on('click', function () {
        let $Name = $('#name').val()
        let $Age = $('#age').val()
        let $Phone = $('#Phone').val()
        let $WeChat = $('#WeChat').val()
        let $EMail = $('#EMail').val()
        let $City = $('#City').val()
        let $Firm = $('#Firm').val()
        const myregAge = /[^\d]/g
        const myregEml = /(\S)+[@]{1}(\S)+[.]{1}(\w)+/
        let $identity = $('.identity .item input:checked').val()
        let $synopsis = $('#synopsis').val() // 简介
        let $university = $('#university').val() // 大学
        let $cultivate = $('#cultivate').val() // 培训
        let $source = $('#source').val() // 来源
        if ($Name.trim() === '') {
            hintFn('姓名不能为空！')
            return false
        }
        if ($Age.trim() === '' || myregAge.test($Age)) {
            hintFn('年龄输入错误！')
            return false
        }
        if ($Phone.trim() === '' || !isPoneAvailable($Phone)) {
            hintFn('手机号码有误')
            return false
        }
        if ($WeChat.trim() === '') {
            hintFn('微信号码不能为空！')
            return false
        }
        if ($EMail.trim() === '' || !myregEml.test($EMail)) {
            hintFn('邮箱输入有误！')
            return false
        }
        if ($City.trim() === '') {
            hintFn('所在城市不能为空')
            return false
        }
        if ($Firm.trim() === '') {
            hintFn('公司名称不能为空！')
            return false
        }
        if ($identity === undefined) {
            hintFn('身份属性不能为空！')
            return false
        }
        if ($synopsis.trim() === '') {
            hintFn('简介不能为空！')
            return false
        }
        if ($university.trim() === '') {
            hintFn('目的不能为空！')
            return false
        }
        if ($cultivate.trim() === '') {
            hintFn('名校不能为空！')
            return false
        }
        if ($source.trim() === '') {
            hintFn('渠道不能为空！')
            return false
        }
        let videoArr = []
        $('.video-list p').each(function (i, e) {
            videoArr.push($(e).data('src'))
        })
        let videoStr = videoArr.join(',')

        getApply($Name, $Age, $Phone, $WeChat, $EMail, $City, $Firm, $identity, $synopsis, $university, $cultivate, $source, videoStr)
    })

    // 视频播放
    $('.video-list').on('click', 'p', function () {
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
})
