/**
 * Author：yangbo
 * Time：2018/8/24 11:45
 * Description：m-coinEncyclopedia.js
 */

import {pageLoadingHide} from './public/public'

let echarts = require('echarts/lib/echarts')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/grid')
require('echarts/lib/component/legend')
require('echarts/lib/chart/pie')

$(function () {
    pageLoadingHide()

    let totalInfo = $('#dataInfo')
    let total = totalInfo.data('total')
    let ico = totalInfo.data('ico') || 0
    let team = totalInfo.data('team') || 0
    let mining = totalInfo.data('mining') || 0
    let foundation = totalInfo.data('foundation') || 0

    if ($('#pie').length > 0) {
        if (ico || team || mining || foundation) {
            let myChart = echarts.init($('#pie')[0])
            let dataOpt = []
            let other = 100 - team - ico - foundation - mining

            if (team) {
                dataOpt.push({name: '团队自持', value: Number((team / 100 * total).toFixed(2))})
            }
            if (ico) {
                dataOpt.push({name: '散户ICO', value: Number((ico / 100 * total).toFixed(2))})
            }
            if (foundation) {
                dataOpt.push({name: '基石投资', value: Number((foundation / 100 * total).toFixed(2))})
            }
            if (mining) {
                dataOpt.push({name: '挖矿', value: Number((mining / 100 * total).toFixed(2))})
            }
            if (other) {
                dataOpt.push({name: '其他', value: Number((other / 100 * total).toFixed(2))})
            }

            let formatter = function (name) {
                let total = 0
                let target
                for (let i = 0, l = dataOpt.length; i < l; i++) {
                    total += dataOpt[i].value
                    if (dataOpt[i].name === name) {
                        target = dataOpt[i].value
                    }
                }
                return name + ' ' + ((target / total) * 100).toFixed(2) + '%'
            }
            let option = {
                color: ['#f0a26c', '#f9df6b', '#8bbff9', '#9be8c6', '#ee7e7a'],
                title: {
                    show: false
                },
                tooltip: {
                    trigger: 'item',
                    confine: true,
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    type: 'plain',
                    orient: 'vertical',
                    right: 'right',
                    top: 'center',
                    textStyle: {
                        fontSize: '14'
                    },
                    selectedMode: false,
                    formatter,
                    data: dataOpt.map((item) => {
                        item.icon = 'circle'
                        return item
                    })
                },
                series: [
                    {
                        name: 'ICO',
                        type: 'pie',
                        radius: '80%',
                        center: ['25%', '50%'],
                        data: dataOpt,
                        label: {
                            show: false
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.3)'
                            }
                        }
                    }
                ]
            }
            myChart.setOption(option)
        }
    }

    let open = $('.intro-action')
    let self = $('.self-action')

    if (open.length > 0) {
        open.on('click', function (e) {
            e.stopPropagation()
            let that = $(this)
            if (that.hasClass('closed')) {
                that.removeClass('closed').html('展开<i class="iconfont iconfont-open"></i>').prev().addClass('maxShow')
            } else {
                that.addClass('closed').html('收起<i class="iconfont iconfont-open"></i>').prev().removeClass('maxShow')
            }
        })
    }

    if (self.length > 0) {
        self.on('click', function (e) {
            e.stopPropagation()
            if ($(this).hasClass('maxShow')) {
                $(this).removeClass('maxShow').next().addClass('closed').html('收起<i class="iconfont iconfont-open"></i>')
            }
        })
    }
})
