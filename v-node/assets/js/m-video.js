/**
 * Author：zhoushuanglong
 * Time：2018-04-08 15:46
 * Description：Description
 */

import {pageLoadingHide, axiosAjax, proxyUrl, formatDate} from '../js/public/public'
import {TopNav} from './modules/m-topNav'

$(function () {
    pageLoadingHide()
    let topNav = new TopNav({isHideTop: false})
    topNav.init()

    let pageNum = 1
    $('.video-more').on('click', function () {
        let pageCount = $(this).data('page')
        function getPage (pageNum) {
            axiosAjax({
                type: 'get',
                url: `${proxyUrl}/info/video/getvideolist`,
                formData: false,
                contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                params: {
                    currentPage: pageNum,
                    pageSize: 12
                },
                fn: function (res) {
                    if (res.code === 1) {
                        let dataArr = res.obj.inforList
                        console.log(dataArr)
                        let str = ''
                        dataArr.map(function (item, index) {
                            let coverImg = JSON.parse(item.coverPic)
                            str += `<div class="video-list">
                                        <div class="list-img" data-id=${item.id}>
                                            <img src=${coverImg.video_m} alt="">
                                            <h5>${item.author}</h5>
                                            <a class="btn" href="/videoDetails/${item.id}/${item.createTime}/"><img src="../../img/m-img/btn.png" alt=""></a>
                                            <p class="shade"></p>
                                        </div>
                                        <div class="list-bottom">
                                            <div class="user">
                                                <img src=${item.iconUrl}>
                                                <span>${item.nickName}</span>
                                            </div>
                                            <div class="m-comment"><font></font><span>${item.commentCounts}</span></div>
                                            <span>${formatDate(item.publishTime)}</span>
                                        </div>
                                    </div>`
                        })
                        $('.video-list-box').append(str)
                    }
                }
            })
        }
        pageNum++
        if (parseInt(pageCount) >= pageNum) {
            getPage(pageNum)
        } else {
            $('.video-more p').html('没有更多了')
        }
    })
})
