/**
 * Author：zhoushuanglong
 * Time：2018-04-08 15:46
 * Description：Description
 */
import {pageLoadingHide, axiosAjax, proxyUrl, isPoneAvailable, rem, fomartQuery} from '../js/public/public'
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

    // 地名个数
    let siteNum = () => {
        let $city = $('#city').html()
        if ($city.length > 3) {
            $('.site').css('marginTop', rem(60))
        } else {
            $('.site').css('marginTop', rem(75))
        }
    }
    siteNum()
    // 报名
    function getApply (cityNum, name, company, phoneNum, email, professionAttr, acquireChannel, remark) {
        let sendData = {
            cityNum: cityNum,
            name: name,
            company: company,
            phoneNum: phoneNum,
            email: email,
            acquireChannel: acquireChannel,
            professionAttr: professionAttr,
            remark: remark
        }
        axiosAjax({
            type: 'post',
            url: `${proxyUrl}/info/marschinatrip/addinfo?${fomartQuery(sendData)}`,
            formData: false,
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    alert('报名成功！')
                    window.location.reload()
                }
            }
        })
    }

    // 获取城市
    function getCityName (cityNum) {
        axiosAjax({
            type: 'post',
            url: `${proxyUrl}/info/marschinatrip/getcitylist?cityNum=${cityNum}`,
            formData: false,
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            params: {},
            fn: function (res) {
                if (res.code === 1) {
                    let cityText = res.obj.inforList[0].city
                    let sitesite = res.obj.inforList[0].detailAddress
                    let time = res.obj.inforList[0].activityTime
                    console.log(time)
                    $('#city').html(cityText)
                    $('.activity-cont p').html(sitesite)
                    $('.activity-time p').html(time)
                }
            }
        })
    }

    getCityName($('#city').data('id'))

    $('#applyBtn').on('click', function () {
        let $Name = $('#name').val()
        let $Firm = $('#Firm').val()
        let $Phone = $('#Phone').val()
        let $EMail = $('#EMail').val()
        const myregEml = /(\S)+[@]{1}(\S)+[.]{1}(\w)+/
        let $identity = $('.identity .item input:checked').val()
        let $source = $('.source .item input:checked').val()
        if ($Name.trim() === '') {
            hintFn('姓名不能为空！')
            return false
        }
        if ($Firm.trim() === '') {
            hintFn('公司名称不能为空！')
            return false
        }
        if ($Phone.trim() === '' || !isPoneAvailable($Phone)) {
            hintFn('手机号码有误')
            return false
        }
        if ($EMail.trim() === '' || !myregEml.test($EMail)) {
            hintFn('邮箱输入有误！')
            return false
        }
        if ($source === undefined) {
            hintFn('了解的渠道不能为空！')
            return false
        }
        if ($identity === undefined) {
            hintFn('职业属性不能为空！')
            return false
        }

        getApply($('#city').data('id'), $Name, $Firm, $Phone, $EMail, $identity, $source, null)
    })
})
