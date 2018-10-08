/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */

import {pageLoadingHide, axiosAjax, proxyUrl, getTimeContent} from './public/public'

$(function () {
    pageLoadingHide()
    let pageNum = 1

    $('#videoCont').waterfall({
        itemClass: '.video-box',
        minColCount: 4,
        spacingHeight: 15,
        resizeable: true,
        ajaxCallback: function (success, end) {
            let pageCount = $('#videoMore').data('page')
            let getPage = (currentPage) => {
                axiosAjax({
                    type: 'get',
                    url: proxyUrl + `/info/video/getvideolist`,
                    formData: false,
                    params: {
                        currentPage: currentPage,
                        pageSize: 12
                    },
                    fn: function (res) {
                        if (res.code === 1) {
                            let dataArr = res.obj.inforList
                            console.log(dataArr)
                            let str = ''
                            dataArr.map(function (item, index) {
                                let coverImg = JSON.parse(item.coverPic)
                                let time = getTimeContent(item.publishTime, new Date().getTime(), '刚刚', '分钟前', '小时前')
                                str += `<div class="video-box">
                <div class="video-img"><a title="${item.title}" href="/videoDetails/${item.id}/${item.publishTime}" target="_blank"><img src=${coverImg.pc} alt="${item.title}"><span class="btn"><img src="../img/video/video-btn.png" alt=""></span><span class="title">火星视频</span></a></div>
                <h5>${item.title}</h5>
            <div class="video-describe">${item.content}</div>
            <div class="box-bottom">
                <p class="comment"><span>${item.commentCounts}</span>评论</p>
                <p class="endorse"><span>${item.hotCounts}</span></p>
                <p class="time"><span>${time}</span></p>
            </div>
            </div>`
                            })
                            $('#videoCont').append(str)
                            success()
                        }
                    }
                })
            }
            pageNum++
            if (parseInt(pageCount) >= pageNum) {
                getPage(pageNum)
            } else {
                $('#videoMore').html('没有更多了')
            }
        }
    })
})
