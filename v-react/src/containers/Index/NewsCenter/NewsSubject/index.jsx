/**
 * Author：liushaozong
 * Time：2018-01-21 21:34
 * Description：index news-center - img
 */

import React, {Component} from 'react'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import LazyLoad from 'react-lazyload'
import {getHotSubject} from '../../../../actions/hotSubject'
import Ad from '../../../../components/public/Ad'
import './index.scss'
// import subject02 from '../../img/subject-02.jpg'
// import subject03 from '../../img/subject-03.jpg'
// import subject04 from '../../img/subject-04.jpg'
// import subject06 from '../../img/subject-06.jpg'
// import subject07 from '../../img/subject-07.jpg'
// import subject08 from '../../img/subject-08.jpg'
// import subject09 from '../../img/subject-09.jpg'
// import subject10 from '../../img/subject-10.jpg'
// import subject11 from '../../img/subject-11.jpg'
// import subject12 from '../../img/subject-12.jpg'
// import subject13 from '../../img/subject-13.jpg'

class NewsSubject extends Component {
    componentWillMount() {
        this.props.actions.getHotSubject({
            currentPage: 1,
            pageSize: 20
        })
    }

    render() {
        // const {newsContent} = this.props
        const {hotSubject, imgArr} = this.props
        return <div className="subject-tab clearfix">
            {
                hotSubject.inforList.map((item, index) => {
                    if (index > 0 && (index + 1) % 2 === 0 && imgArr.length > 0) {
                        let arrObj = imgArr[(index - 1) / 2]
                        return (
                            <div key={index}>
                                <div className="subject-box clearfix">
                                    <div className="subject-first">
                                        <LazyLoad height='auto' offset={-10} once>
                                            <Link
                                                to={item.topic.typeLink && item.topic.typeLink.trim() !== '' ? item.topic.typeLink : ('/hot?tags=' + (item.topic.tags ? item.topic.tags : '区块链') + '&id=' + item.topic.id)}
                                                target="_blank">
                                                <img src={item.topic.pcImgSrc} alt=""/>
                                            </Link>
                                        </LazyLoad>
                                    </div>
                                    <div className="subject-ul clearfix">
                                        {/*
                                        <Link className="subject-title" to={'/hot?tags=' + (item.topic.tags ? item.topic.tags : '区块链') + '&id=' + item.topic.id} target="_blank">
                                            {item.topic.topicName}
                                        </Link>
                                        */}
                                        {
                                            item.contentList.map((itemIn, indexIn) => {
                                                if (indexIn <= 2) {
                                                    return <li className="clearfix" key={indexIn}>
                                                        <span/>
                                                        <Link href={itemIn.url} target="_blank">{itemIn.title}</Link>
                                                    </li>
                                                }
                                            })
                                        }
                                    </div>
                                </div>
                                {!arrObj ? '' : <Ad imgArr={[arrObj]}/>}
                            </div>
                        )
                    } else {
                        return (
                            <div key={index}>
                                <div className="subject-box clearfix">
                                    <div className="subject-first">
                                        <LazyLoad height='auto' offset={-10} once>
                                            <Link
                                                to={item.topic.typeLink && item.topic.typeLink.trim() !== '' ? item.topic.typeLink : ('/hot?tags=' + (item.topic.tags ? item.topic.tags : '区块链') + '&id=' + item.topic.id)}
                                                target="_blank">
                                                <img src={item.topic.pcImgSrc} alt=""/>
                                            </Link>
                                        </LazyLoad>
                                    </div>
                                    <div className="subject-ul clearfix">
                                        {/*
                                        <Link className="subject-title" to={'/hot?tags=' + (item.topic.tags ? item.topic.tags : '区块链') + '&id=' + item.topic.id} target="_blank">
                                            {item.topic.topicName}
                                        </Link>
                                        */}
                                        {
                                            item.contentList.map((itemIn, indexIn) => {
                                                if (indexIn <= 2) {
                                                    return <li className="clearfix" key={indexIn}>
                                                        <span/>
                                                        <Link href={itemIn.url} target="_blank">{itemIn.title}</Link>
                                                    </li>
                                                }
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })
                /* newsContent.map(function (item, index) {
                 return <div className="subject-box clearfix" key={index}>
                 <div className="subject-first">
                 <LazyLoad height='auto' offset={-10} once>
                 <Link
                 to={item.title.tags ? item.title.tags : ''}
                 href={item.title.tags ? '' : item.title.imgHref} target="_blank">
                 <img src={item.title.img} alt=""/>
                 <span>{item.title.text}</span>
                 </Link>
                 </LazyLoad>
                 </div>
                 <div className="subject-ul clearfix">
                 <Link className="subject-title" to={item.title.tags ? item.title.tags : ''}
                 href={item.title.tags ? '' : item.title.imgHref} target="_blank">
                 {item.title.text}
                 </Link>
                 {
                 item.content.map((itemIn, indexIn) => {
                 return <li className="clearfix" key={indexIn}>
                 <span/>
                 <Link href={itemIn.imgHref} target="_blank">{itemIn.text}</Link>
                 </li>
                 })
                 }
                 </div>
                 </div>
                 }) */
            }
            {
                (() => {
                    let subjectAd = hotSubject.inforList.length / 2
                    let newArr = []
                    if (subjectAd < imgArr.length) {
                        newArr.push(imgArr.splice(0, subjectAd))
                        return (
                            <Ad imgArr={imgArr} />
                        )
                    }
                })()
            }
        </div>
    }
}

// NewsSubject.defaultProps = {
//     newsContent: [
//         {
//             title: {
//                 tags: '/hot?tags=龚健',
//                 img: subject13,
//                 imgHref: '',
//                 text: '龚健谈区块链隐私'
//             },
//             content: [
//                 {
//                     imgHref: '/newsdetail?id=2018032815102422271',
//                     text: '效率换隐私？区块链说不！'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018032814340698866',
//                     text: '区块链真的安全吗？贿赂攻击者模型浅谈'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018032814355358920',
//                     text: '怎样保证区块链的安全稳定和积极有序？探索加密经济学的魅力'
//                 }
//             ]
//         },
//         {
//             title: {
//                 tags: '/hot?tags=超级节点',
//                 img: subject11,
//                 imgHref: '',
//                 text: 'EOS超级节点之争：谁是最后赢家'
//             },
//             content: [
//                 {
//                     imgHref: '/newsdetail?id=2018033020383313855',
//                     text: 'EOS超级节点投票：「千亿」利润下的币圈国家战争'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018032823293029162',
//                     text: 'EOS超级节点竞选：暴走恭亲王宣布将全力参与'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018032823112302031',
//                     text: 'EOS超级节点竞选：老猫宣布选择做个超级节点'
//                 }
//             ]
//         }, {
//             title: {
//                 tags: '/hot?tags=杭州高峰论坛',
//                 img: subject12,
//                 imgHref: '',
//                 text: '2018全球区块链杭州高峰论坛'
//             },
//             content: [
//                 {
//                     imgHref: '/newsdetail?id=2018032711370369664',
//                     text: '3点钟无眠区块链现场版：王峰犀利提问，陈伟星号召“打假”'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018032715133964249',
//                     text: '跨链圆桌：跨链没有单一赢家，未开发市场潜力巨大'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018032614492055841',
//                     text: '蚂蚁金服区块链技术负责人张辉：蚂蚁金服的区块链实践'
//                 }
//             ]
//         },
//         {
//             title: {
//                 tags: '/hot?tags=IT领袖峰会',
//                 img: subject10,
//                 imgHref: '',
//                 text: '2018中国(深圳)IT领袖峰会大佬谈区块链'
//             },
//             content: [
//                 {
//                     imgHref: '/newsdetail?id=2018032517444473918',
//                     text: '2018 IT领袖峰会 | 张首晟谈区块链：有了区块链，黑客就不可能黑每个人的数据'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018032517253501892',
//                     text: '2018IT领袖峰会 | 刘晓松谈区块链：“区块链+文娱”有机会'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018032517082268179',
//                     text: '2018IT领袖峰会 | 阎焱谈区块链：区块链本身很好，扎实做研究的公司很少'
//                 }
//             ]
//         }, {
//             title: {
//                 tags: '/hot?tags=白皮书',
//                 img: subject09,
//                 imgHref: '',
//                 text: '上市公司区块链白皮书专题'
//             },
//             content: [
//                 {
//                     imgHref: '/newsdetail?id=2018032215122687439',
//                     text: '京东区块链技术白皮书（附完整版PDF下载链接）'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018032216215921377',
//                     text: '美图官方发布区块链方案白皮书（附白皮书全文）'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018032216452583369',
//                     text: '腾讯发布区块链方案白皮书 打造数字经济时代信任基石'
//                 }
//             ]
//         }, {
//             title: {
//                 tags: '/hot?tags=蒋涛',
//                 img: subject08,
//                 imgHref: '',
//                 text: 'CSDN及极客帮创投蒋涛谈区块链'
//             },
//             content: [
//                 {
//                     imgHref: '/newsdetail?id=2018031823481065345',
//                     text: 'CSDN创始人蒋涛：DCO才是区块链的杀手级应用！'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018031123345146228',
//                     text: 'CSDN创始人蒋涛：这五件事发生的那一刻，即是ICO泡沫破裂的那一天'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018031913285223244',
//                     text: 'CSDN创始人蒋涛：我们还处在区块链的“Windows 2.0”时代，懂技术的人员太缺了'
//                 }
//             ]
//         },
//         {
//             title: {
//                 tags: '/hot?tags=甲子光年',
//                 img: subject04,
//                 imgHref: '',
//                 text: '甲小姐说区块链'
//             },
//             content: [
//                 {
//                     imgHref: '/newsdetail?id=2018040103082271878',
//                     text: '九谈区块链“捧”与“杀”：当王小川们辩起来时……'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018033021351610946',
//                     text: '王小川、帅初、王峰、徐易容、老冒等50+行业领袖共话区块链：泡沫退潮，人开始认真干活了'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018030715404063249',
//                     text: '甲子光年 | 2018区块链人才大迁徙：那个你身边悄悄离职的人去哪儿了？'
//                 }
//             ]
//         }, {
//             title: {
//                 tags: '/hot?tags=币圈邦德',
//                 img: subject06,
//                 imgHref: '',
//                 text: '币圈邦德专栏'
//             },
//             content: [
//                 {
//                     imgHref: '/newsdetail?id=2018031013000211480',
//                     text: '30岁区块链“原始人”李雄：身价9位数，封不住信仰'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018031415275495456',
//                     text: '区块链，一种诞生于草根的时尚？'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018031415471292056',
//                     text: '区块链能改变什么？“金融城”上海VS“互联网高地”杭州的变革终局'
//                 }
//             ]
//         }, {
//             title: {
//                 tags: '/hot?tags=人才',
//                 img: subject02,
//                 imgHref: '',
//                 text: '2018区块链人才在哪儿？'
//             },
//             content: [
//                 {
//                     imgHref: '/newsdetail?id=2018031014161278298',
//                     text: '区块链招聘乱象丛生：核心人才难觅招来投机，培训机构趁虚而入'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018030920293657272',
//                     text: '追逐区块链风口：资金跑步入场，人才纷纷跳槽'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018030712093904391',
//                     text: '超九成区块链人才月薪过万元，被指存在薪资泡沫'
//                 }
//             ]
//         }, {
//             title: {
//                 tags: '/hot?tags=监管',
//                 img: subject03,
//                 imgHref: '',
//                 text: '全球区块链监管政策'
//             },
//             content: [
//                 {
//                     imgHref: '/newsdetail?id=2018031115380526446',
//                     text: '北京鼓励区块链创新应用项目孵化，打造新型信用监管格局'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018030916480485710',
//                     text: '日本连发8道“肃清令”！全球首例数字货币及ICO落地监管方案全调查'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018030217342454936',
//                     text: 'IDG资本：重磅监管箭在弦上，合规或成区块链行业唯一出路'
//                 }
//             ]
//         }, {
//             title: {
//                 tags: '/hot?tags=矿业',
//                 img: subject07,
//                 imgHref: '',
//                 text: '矿业动态信息'
//             },
//             content: [
//                 {
//                     imgHref: '/newsdetail?id=2018021617285492292',
//                     text: '区块链简史（一）：一篇文章告诉你，区块链的前世今生'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018021709442925559',
//                     text: '区块链简史（二）：一分钟看懂比特币工作量证明和矿工存在意义'
//                 },
//                 {
//                     imgHref: '/newsdetail?id=2018021810122954409',
//                     text: '区块链简史（三）：比特币全民挖矿时代，教你怎么“挖矿”'
//                 }
//             ]
//         }
//     ]
// }

const mapStateToProps = (state) => {
    return {
        hotSubject: state.hotSubject
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getHotSubject}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NewsSubject)
