/**
 * Author：liushaozong
 * Time：2018/03/22
 * Description：showSpecial
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
// import Cookies from 'js-cookie'
import {getExhibition} from '../../actions/special'
import {injectIntl} from 'react-intl'
import './index.scss'
import Footer from '../../components/main/Footer'
import {sevenDays} from '../../public/index'
import slogan from './img/special-slogan.png'
import hotNew from './img/fh-news.png'
import personTitle from './img/xc-person.png'
import xcImg from './img/xc-title.png'
import fTime from './img/fh-time.png'

// 现场图集
const siteImg = [
    {
        leftImg: require('./img/p1.jpg'),
        rightImg: {
            r1: require('./img/p-1-1.jpg'),
            r2: require('./img/p-1-2.jpg'),
            r3: require('./img/p-1-3.jpg'),
            r4: require('./img/p-1-4.jpg')
        }
    },
    {
        leftImg: require('./img/p2.jpg'),
        rightImg: {
            r1: require('./img/p-2-1.jpg'),
            r2: require('./img/p-2-2.jpg'),
            r3: require('./img/p-2-3.jpg'),
            r4: require('./img/p-2-4.jpg')
        }
    }
]
// 导航
const nav = ['峰会首页', '峰会新闻', '峰会议程', '现场嘉宾', '火星财经']
//
const tabList = ['区块链核心技术', '区块链行业应用', '通证经济与分布式商业', '投资专场', '区块链创新前沿', '数字资产存储与交易']
// 嘉宾
const guestData = [
    {
        list: [
            {
                img: require('./img/1.png'),
                name: '王 峰',
                title: '蓝港互动创始人、极客帮创始合伙人、火星财经发起人'
            },
            {
                img: require('./img/2.png'),
                name: 'Jeffrey Wernick',
                title: '芝加哥大学经济学与金融学博士,bitcoin早期参与者,独立投资人'
            },
            {
                img: require('./img/3.png'),
                name: 'Eric Tippetts',
                title: 'NASGO联合创始人'
            },
            {
                img: require('./img/4.png'),
                name: 'Eric Meltzer',
                title: 'INBlockchain合伙人'
            },
            {
                img: require('./img/5.png'),
                name: 'Omer Ozden',
                title: '石木资本董事长，真格基金海外投资首席顾问，优客工场联合创始人'
            },
            {
                img: require('./img/6.png'),
                name: 'Tim McCallum',
                title: '澳大利亚开发者社群领头人，区块链技术开发者，google技术导师'
            },
            {
                img: require('./img/7.png'),
                name: 'Jin Ho Hur',
                title: 'SEMA CEO'
            },
            {
                img: require('./img/8.png'),
                name: 'Chase Freo',
                title: 'Alto CEO'
            },
            {
                img: require('./img/9.png'),
                name: 'Lee Wilkins',
                title: 'WB Council Co-founder'
            },
            {
                img: require('./img/10.png'),
                name: 'Lvan Solovyev',
                title: 'Impact Blockchain联合创始人'
            },
            {
                img: require('./img/11.png'),
                name: '杨 东',
                title: '中国人民大学法学院副院长、金融科技与互联网安全研究中心主任、大数据区块链与监管科技实验室主任'
            },
            {
                img: require('./img/12.png'),
                name: '李世默',
                title: '成为资本创始人及执行董事'
            }
        ]
    },
    {
        list: [
            {
                img: require('./img/13.png'),
                name: '陈伟星',
                title: '泛城资本创始人'
            },
            {
                img: require('./img/14.png'),
                name: '蔡文胜',
                title: '美图秀秀董事长，隆领投资创始人'
            },
            {
                img: require('./img/15.png'),
                name: '孟 可',
                title: '粤嘉基金董事会董事'
            },
            {
                img: require('./img/16.png'),
                name: '赵 东',
                title: '墨迹天气联合创始人、Dfund创始人、区块链领域知名投资人'
            },
            {
                img: require('./img/17.png'),
                name: '玉 红',
                title: '3点钟区块链社群发起人，SEEU&QYGAME创始人及CEO'
            },
            {
                img: require('./img/18.png'),
                name: '厉 晹',
                title: 'Ruff 创始人&CEO'
            },
            {
                img: require('./img/19.png'),
                name: '成 也',
                title: '资深泛娱乐投资人，XMX CEO'
            },
            {
                img: require('./img/20.png'),
                name: '帅 初',
                title: '量子链创始人'
            },
            {
                img: require('./img/21.png'),
                name: '詹 川',
                title: '国金投资管理合伙人，kfund合伙人'
            },
            {
                img: require('./img/22.png'),
                name: '林嘉鹏',
                title: 'LinkVc连接资本创始人 ，AICoin联合创始人 ，全球顶级交易所OKex顾问，区块链领域活跃的投资人'
            },
            {
                img: require('./img/23.png'),
                name: '虫 哥',
                title: '原壹比特创始人'
            },
            {
                img: require('./img/24.png'),
                name: '马昊伯',
                title: '北京好扑信息科技公司创始人&CEO'
            }
        ]
    },
    {
        list: [
            {
                img: require('./img/25.png'),
                name: '朱 波',
                title: '追梦者基金暨创新谷创始人'
            },
            {
                img: require('./img/26.png'),
                name: '杨 楠',
                title: 'INB资本合伙人'
            },
            {
                img: require('./img/27.png'),
                name: '王 一',
                title: 'RealChain投资人&战略合作伙伴淘当铺CEO'
            },
            {
                img: require('./img/28.png'),
                name: '刘小鹰',
                title: '老鹰基金创始人'
            },
            {
                img: require('./img/29.png'),
                name: '廖志宇',
                title: '超脑链Ultrain联合创始人 '
            },
            {
                img: require('./img/30.png'),
                name: '元 道',
                title: '世纪互联数据中心的创始人、董事长，中关村区块链联盟理事长'
            },
            {
                img: require('./img/31.png'),
                name: '易理华',
                title: '了得资本创始人、知名区块链投资人'
            },
            {
                img: require('./img/32.png'),
                name: '孙泽宇',
                title: '创世资本合伙人'
            },
            {
                img: require('./img/33.png'),
                name: '周志峰',
                title: '墨麟集团总裁'
            },
            {
                img: require('./img/34.png'),
                name: '无 极',
                title: '华迎控股董事长'
            },
            {
                img: require('./img/35.png'),
                name: '王小彬',
                title: 'CWV加密世界链生态发展负责人，Ofund创始合伙人'
            },
            {
                img: require('./img/36.png'),
                name: 'SKY',
                title: 'DAC和Vinci联合发起人，三点钟联合发起人'
            }
        ]
    },
    {
        list: [
            {
                img: require('./img/37.png'),
                name: '张 涛',
                title: '火讯财经创始人、区块链投资人'
            },
            {
                img: require('./img/38.png'),
                name: '万浩基',
                title: '经纬中国合伙人'
            },
            {
                img: require('./img/39.png'),
                name: '陆宏宇',
                title: '德同资本合伙人'
            },
            {
                img: require('./img/40.png'),
                name: '蒋波',
                title: '长岭资本合伙人'
            },
            {
                img: require('./img/41.png'),
                name: '丁若宇',
                title: '丹华资本董事总经理'
            },
            {
                img: require('./img/42.png'),
                name: '刘 勇',
                title: '原热酷创始人，JoyCoin & Coinfo创始人'
            },
            {
                img: require('./img/43.png'),
                name: 'Forest',
                title: 'Kfund合伙人，3点钟区块链社群联合发起人'
            },
            {
                img: require('./img/44.png'),
                name: '袁煜明',
                title: '火币中国区块链应用研究院院长'
            },

            {
                img: require('./img/45.png'),
                name: '老 葛',
                title: 'Dfund基金合伙人'
            },
            {
                img: require('./img/46.png'),
                name: '宋 炜',
                title: '全球移动游戏联盟GMGC秘书长，世界区块链理事会发起人'
            },
            {
                img: require('./img/47.png'),
                name: '魏建国',
                title: '六合地产副董事长，天使投资人'
            },
            {
                img: require('./img/48.png'),
                name: '楼霁月',
                title: 'TAMC创始人，了得资本联合创始人'
            }
        ]
    },
    {
        list: [
            {
                img: require('./img/49.jpg'),
                name: '汪东风',
                title: '汪东风隆领投资创始合伙人'
            }
        ]
    }
]
@injectIntl
class Special extends Component {
    state = {
        updateNum: 1,
        channelId: null,
        currentPage: 1,
        queryTime: Date.parse(new Date(sevenDays()[0])).toString(),
        passportid: '',
        navState: 0,
        tabState: 1,
        secondList: 0
    }

    getlist = (channelId, queryTime, passportid) => {
        this.props.actions.getQuickNewsList({
            pageSize: 30,
            channelId: channelId,
            queryTime: queryTime,
            passportid: passportid
        })
    }

    navClick = (e) => {
        this.setState({navState: parseInt(e.target.getAttribute('data-index'))})
    }

    componentWillMount() {
        this.props.actions.getExhibition(1, 6, '区块链大会')
    }

    componentDidMount() {
        $(window).scrollTop('0')
        let hotSwiper = new Swiper('.hot-swiper', {
            pagination: '.hot-pagination',
            paginationClickable: true,
            // loop: true,
            autoplay: 5000,
            observer: true,
            observeParents: true,
            preventClicks: false,
            autoplayDisableOnInteraction: false
        })
        hotSwiper.autoplay = true

        let personSwiper = new Swiper('.swiper-person', {
            pagination: '.person-pagination',
            paginationClickable: true,
            loop: true,
            autoplay: 8000,
            observer: true,
            observeParents: true,
            autoplayDisableOnInteraction: false
        })
        personSwiper.autoplay = true

        let atlasSwiper = new Swiper('.swiper-atlas', {
            paginationClickable: true,
            loop: true,
            // autoplay: 8000,
            autoplayDisableOnInteraction: false,
            nextButton: '.next-atlas',
            prevButton: '.prev-atlas'
        })
        atlasSwiper.autoplay = true

        $(window).on('scroll', function () {
            let scroT = $(window).scrollTop()
            if (scroT > 100) {
                $('.special-nav').addClass('bg')
            } else {
                $('.special-nav').removeClass('bg')
            }
            let aLi = $('.special-nav p')
            let f2 = $('.v1').offset().top - 150
            let f3 = $('.v2').offset().top - 150
            let f4 = $('.v3').offset().top - 150
            let f5 = $('.v4').offset().top - 150
            let f6 = $('.v5').offset().top - 150
            if (scroT >= f2) {
                aLi.eq(1).addClass('active').parent().siblings().children('p').removeClass('active')
            }
            if (scroT >= f3) {
                aLi.eq(2).addClass('active').parent().siblings().children('p').removeClass('active')
            }
            if (scroT >= f4) {
                aLi.eq(3).addClass('active').parent().siblings().children('p').removeClass('active')
            }
            if (scroT >= f5) {
                aLi.eq(4).addClass('active').parent().siblings().children('p').removeClass('active')
            }
            if (scroT >= f6) {
                aLi.eq(5).addClass('active').parent().siblings().children('p').removeClass('active')
            }
        })
        $('.special-nav p').on('click', function () {
            let ind = $('.special-nav p').index(this) + 1
            let vTop = $('.v' + ind).offset().top - 150
            $('html, body').stop().animate({'scrollTop': vTop}, 500)
        })
        // 粒子
        let config = {
            vx: 4, // 小球x轴速度,正为右，负为左
            vy: 4, // 小球y轴速度
            height: 2, // 小球高宽，其实为正方形，所以不宜太大
            width: 2,
            interactive: false,
            count: 100, // 点个数
            color: '121, 162, 185', // 点颜色
            stroke: '130,255,255', // 线条颜色
            dist: 6000, // 点吸附距离
            e_dist: 20000, // 鼠标吸附加速距离
            max_conn: 10 // 点到点最大连接数
        }
        // 调用
        CanvasParticle(config)
    }

    componentDidUpdate() {
    }

    render() {
        const {blockchainConvention} = this.props
        // const justNow = intl.formatMessage({id: 'time.justNow'})
        // const minuteAgo = intl.formatMessage({id: 'time.minuteAgo'})
        // const hourAgo = intl.formatMessage({id: 'time.hourAgo'})
        // let currentTime = quickNews.currentTime
        console.log(blockchainConvention)
        return <div className="show-special">
            <div className="special-top v1">
                <div className="special-nav">
                    <ul>
                        {
                            nav.map((item, index) => {
                                let active = this.state.navState === index ? 'active' : ''
                                return (
                                    <li key={index}>
                                        {
                                            index === 4 ? <p className='' data-index={index}><a href="http://www.huoxing24.com/" target="_blank">{item}</a></p> : <p onClick={this.navClick} className={active} data-index={index}>{item}</p>
                                        }
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div id="mydiv"></div>
                <div className="banner-box wbcworld">
                    <div className="slogan"><img src={slogan} alt=""/></div>
                </div>
            </div>
            <div className="box-swiper-bottom">
                <div className="fh-news v2">
                    <div className="fh-news-title clearfix">
                        <h6><img src={hotNew} alt=""/></h6>
                        <Link to={`/wbcworldNews`} target="_blank">MORE ></Link>
                    </div>
                    <div className="news-box clearfix">
                        {
                            blockchainConvention.inforList.map((item, index) => {
                                let img = JSON.parse(item.coverPic)
                                return (
                                    <div className="news-lists" key={index}>
                                        <Link to={`/newsdetail?id=${item.id}`} target="_blank">
                                            <img src={img.pc} alt=""/>
                                            <div className="h5-title">{item.title}</div>
                                            <p><span>查看详情></span></p>
                                        </Link>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="fh-time v3">
                    <h6><img src={fTime} alt=""/></h6>
                    <div className="time-box">
                        <div className={`tab-list first ${this.state.tabState === 1 ? 'active' : ''}`}>
                            <table>
                                <tbody>
                                    <tr className="tr-header">
                                        <td>日期</td>
                                        <td>时间段</td>
                                        <td>主会场</td>
                                        <td>分会场</td>
                                    </tr>
                                    <tr>
                                        <td rowSpan="2">2018-4-23</td>
                                        <td>18:00-20:00</td>
                                        <td>千人嘉宾、明星走红毯仪式</td>
                                        <td rowSpan="2"></td>
                                    </tr>
                                    <tr>
                                        <td>20:00-23:00</td>
                                        <td>世界区块链大会开幕式暨明星嘉年华盛典</td>
                                    </tr>
                                    <tr>
                                        <td rowSpan="2">2018-4-24</td>
                                        <td>09:00-18:00</td>
                                        <td>世界区块链大会正会<br/>&区块链基金联盟成立大会</td>
                                        <td rowSpan="4" style={{borderBottom: '1px #184069 solid'}}>区块链技术应用路演会</td>
                                    </tr>
                                    <tr>
                                        <td>19:00-22:00</td>
                                        <td>区块链技术应用路演会</td>
                                    </tr>
                                    <tr>
                                        <td rowSpan="2">2018-4-25</td>
                                        <td>09:00-18:00</td>
                                        <td>世界区块链大会正会<br/>世界区块链大会国际行与中国行启动仪式<br/>大会闭幕式</td>
                                    </tr>
                                    <tr>
                                        <td>19:00-22:00</td>
                                        <td>区块链技术应用路演会</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className={`tab-list second clearfix ${this.state.tabState === 2 ? 'active' : ''}`}>
                            <div className="second-list clearfix">
                                {
                                    tabList.map((item, index) => {
                                        let active = this.state.secondList === index ? 'active' : ''
                                        return (
                                            <p key={index} onClick={this.secondListClick} data-index={index}>{item}<span
                                                className={active}></span></p>
                                        )
                                    })
                                }
                            </div>
                            <table>
                                <tbody>
                                    <tr className="time">
                                        <td style={{'width': '150px'}}>时间</td>
                                        <td style={{'width': '440px'}}>议题</td>
                                        <td style={{'width': '150px'}}>演讲嘉宾</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="xc-person v4">
                    <h6><img src={personTitle} alt=""/></h6>
                    <div className="person-box clearfix">
                        <div className="swiper-container swiper-person">
                            <div className="swiper-wrapper">
                                {
                                    guestData.map((item, index) => {
                                        return (
                                            <div className="swiper-slide" key={index}>
                                                {
                                                    item.list.map((d, i) => {
                                                        return (
                                                            <div className="slide-box" key={i}>
                                                                <img src={d.img} alt=""/>
                                                                <h5>{d.name}<span className="x1"></span><span
                                                                    className="x2"></span></h5>
                                                                <p>{d.title}</p>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="swiper-pagination person-pagination"></div>
                            {/*
                             <div className="swiper-button-next next-person"></div>
                             <div className="swiper-button-prev prev-person"></div>
                             */}
                        </div>
                    </div>
                </div>
                <div className="xc-img-box v5 clearfix" style={{display: 'none'}}>
                    <div className="xc-img">
                        <h6><img src={xcImg} alt=""/></h6>
                        <div className="box-atlas clearfix">
                            <div className="swiper-container swiper-atlas">
                                <div className="swiper-wrapper">
                                    {
                                        siteImg.map((item, index) => {
                                            return (
                                                <div className="swiper-slide" key={index}>
                                                    <div className="slide-left"><img src={item.leftImg} alt=""/></div>
                                                    <div className="slide-right">
                                                        <p><img src={item.rightImg.r1} alt=""/></p>
                                                        <p><img src={item.rightImg.r2} alt=""/></p>
                                                        <p><img src={item.rightImg.r3} alt=""/></p>
                                                        <p><img src={item.rightImg.r4} alt=""/></p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="swiper-button-next next-atlas"></div>
                                <div className="swiper-button-prev prev-atlas"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer sColor={'#020d35'}/>
        </div>
    }
}
const mapStateToProps = (state) => {
    return {
        blockchainConvention: state.reducerBlockchain
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getExhibition}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Special)
