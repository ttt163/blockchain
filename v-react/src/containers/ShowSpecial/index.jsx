/**
 * Author：liushaozong
 * Time：2018/03/22
 * Description：showSpecial
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
// import {hashHistory} from 'react-router'
// import Swiper from 'swiper'
import Cookies from 'js-cookie'
import {getSpecialNewsList, getSpecialRecommend} from '../../actions/special'
import {getQuickNewsList} from '../../actions/quicknews'
import {injectIntl} from 'react-intl'
import './index.scss'
import Footer from '../../components/main/Footer'
import {sevenDays, getTime, cutString} from '../../public/index'
import slogan from './img/special-slogan.png'
import hxLogo from './img/special-huoxing.png'
import fhHot from './img/fh-title.png'
import hotNew from './img/fh-news.png'
import personTitle from './img/xc-person.png'
// import person from './img/person.jpg'
import xcImg from './img/xc-title.png'
import fhTime from './img/fh-time.png'
import initiator from './img/initiator.png'

// 发起人
const initiatorList = [
    {
        img: require('./img/2.jpg'),
        name: '王 峰',
        title: '火星财经发起人、蓝港互动创始人'
    },
    {
        img: require('./img/1.jpg'),
        name: '蒋 涛',
        title: 'CSDN创始人&董事长、极客帮创始合伙人'
    },
    {
        img: require('./img/3.jpg'),
        name: '元 道',
        title: '中关村区块链产业联盟理事长'
    },
    {
        img: require('./img/4.jpg'),
        name: '孟 岩',
        title: 'CSDN副总裁、柏链道捷CEO'
    }
]
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
const nav = ['火星财经', '峰会首页', '峰会热点', '峰会新闻', '峰会议程', '现场嘉宾', '现场图集']
//
const tabList = ['区块链核心技术', '区块链行业应用', '通证经济与分布式商业', '投资专场', '区块链创新前沿', '数字资产存储与交易']
// 30号
const data30 = [
    {
        time: '主持人',
        cont: '',
        guest: '刘　江',
        title: '美团点评技术学院院长'
    },
    {
        time: '9:00-9:20',
        cont: '通证派第66天',
        guest: '元　道',
        title: '中关村区块链产业联盟理事长'
    },
    {
        time: '09:00-10:00',
        cont: '十问2018区块链',
        guest: '王　峰',
        title: '蓝港互动创始人、火星财经发起人'
    },
    {
        time: '9:40-10:00',
        cont: '程序员伟大窗口期开启',
        guest: '蒋　涛',
        title: 'CSDN创始人&董事长、极客帮创始合伙人'
    },
    {
        time: '10:00-10:20',
        cont: 'DCO协议宣言仪式',
        guest: '',
        title: ''
    },
    {
        time: '10:20-10:40',
        cont: '一条公链的生机（生态）',
        guest: '达鸿飞',
        title: 'NEO创始人、Onchain分布科技创始人兼CEO'
    },
    {
        time: '10:40-11:00',
        cont: '20年互联网观察者眼中的区块链可能性演进',
        guest: '何宝宏',
        title: '中国信息通信研究院云计算与大数据研究所所长'
    },
    {
        time: '11:00-11:20',
        cont: '区块链未来世界和我的位置',
        guest: '帅 初',
        title: 'Qtum量子链联合创始人'
    },
    {
        time: '11:20-11:40',
        cont: '区块链技术和应用创新——热潮中的冷思考',
        guest: '陶曲明',
        title: '万向区块链股份公司副总经理'
    },
    {
        time: '11:40-12:00',
        cont: '如何搭建一个可大规模商用的区块链公链平台',
        guest: '周 迅',
        title: 'EKT通用积分CEO'
    },
    {
        time: '12:00-13:30',
        cont: '午餐',
        guest: '',
        title: ''
    },
    {
        time: '13:30-13:50',
        cont: 'SCRY数据驱动区块链智能合约DAPP',
        guest: '符安文',
        title: 'SCRY创始人兼CEO'
    },
    {
        time: '13:50-14:10',
        cont: '区块链及其商业应用探讨',
        guest: '蒋 海',
        title: '布比创始人兼CEO'
    },
    {
        time: '14:10-14:30',
        cont: '矩阵元创始人兼CEO',
        guest: '孙立林',
        title: '下一代计算架构'
    },
    {
        time: '14:30-14:50',
        cont: '区块链协议栈',
        guest: '杨建新',
        title: '井通科技CTO'
    },
    {
        time: '14:50-15:10',
        cont: '主题演讲',
        guest: '张 健',
        title: '博晨创始人兼CEO、Zipper技术社区发起人'
    },
    {
        time: '15:10-15:30',
        cont: 'PCHAIN下一代的区块链3.0系统',
        guest: '曹 锋',
        title: 'PChain发起人'
    },
    {
        time: '15:30-15:40',
        cont: '中场休息',
        guest: '',
        title: ''
    },
    {
        time: '15:40-16:00',
        cont: '数字货币开启电商红利新纪元',
        guest: '卢 亮',
        title: 'Cybermiles CEO'
    },
    {
        time: '16:00-16:20',
        cont: 'Facebook的解体，重启百花齐放的互联网',
        guest: '姜孟君（笨总）',
        title: 'Merculet创始人'
    },
    {
        time: '16:20-17:20',
        cont: '主题演讲',
        guest: '神秘嘉宾',
        title: ''
    },
    {
        time: '17:20-17:40',
        cont: '区块链技术与未来的共享经济',
        guest: '陈伟星',
        title: ''
    },
    {
        time: '17:40-18:00',
        cont: '区块链技术在企业级应用实践',
        guest: '厉　晹 （Roy Li）',
        title: 'Ruff Chain创始人&Ruff CEO'
    },
    {
        time: '18:00-20:30',
        cont: 'BTA百人会晚宴（仅限VIP嘉宾）',
        guest: '吴声 （主持人）',
        title: '场景实验室创始人'
    }
]
// 31号
const data31 = [
    {
        list: [
            {
                time: '09:00',
                cont: '主持人',
                guest: '茹 琳',
                title: '币好CEO'
            },
            {
                time: '09:00-9:35',
                cont: '区块链技术发展——在不完美世界艰难前行',
                guest: '邹 均',
                title: '海纳云CTO'
            },
            {
                time: '09:35-10:10',
                cont: '区块链中间件驱动应用生态规模化落地',
                guest: '吴萌野',
                title: '丝链SilkChain首席架构师'
            },
            {
                time: '10:10-10:45',
                cont: '区块链：去中心化数据库',
                guest: '王 涛',
                title: 'SequoiaDB巨杉数据库联合创始人兼CTO'
            },
            {
                time: '10:45-11:20',
                cont: 'SPoR+PoS混合共识机制打造高性能公有链',
                guest: '吴为龙',
                title: 'Genaro Network创始人兼CTO'
            },
            {
                time: '11:20-11:55',
                cont: '区块链安全质量保障实践',
                guest: '相里朋',
                title: '工信部电子五所高级工程师'
            },
            {
                time: '11:55-13:30',
                cont: '午餐',
                guest: '',
                title: ''
            },
            {
                time: '13:30-14:00',
                cont: '打造高性能公链',
                guest: '杨耀东',
                title: '夸克链基金会科学家、Demo++联合创始人'
            },
            {
                time: '14:00-14:30',
                cont: 'Pallet-“细腰”链通互联网价值体系',
                guest: '朱佩江',
                title: 'Pallet联合创始人'
            },
            {
                time: '14:30-15:00',
                cont: '币安不安？——区块链安全那点事',
                guest: '万 涛',
                title: 'IDF极安客实验室联合创始人'
            },
            {
                time: '15:00-15:20',
                cont: '中场休息',
                guest: '',
                title: ''
            },
            {
                time: '15:20-15:50',
                cont: '深入以太坊DApp架构和开发实战',
                guest: '杨德升',
                title: '原ofo技术副总裁'
            },
            {
                time: '15:50-16:20',
                cont: 'ERC721/ERC821与通用区块链资产平台',
                guest: '张 犁',
                title: 'UDAP联合创始人'
            },
            {
                time: '16:20-16:50',
                cont: '智能合约——构建未来信任的基石',
                guest: '李 谱',
                title: 'Achain技术合伙人'
            },
            {
                time: '16:50-17:20',
                cont: '基于Linux 的挖矿操作系统',
                guest: '康 烁',
                title: '柏链道捷CTO、清华大学区块链中心高级工程师'
            }
        ]
    },
    {
        list: [
            {
                time: '09:00',
                cont: '主持人',
                guest: '商思林',
                title: '火星财经总编辑'
            },
            {
                time: '09:00-9:35',
                cont: '平行宇宙之桥——中心化应用与区块链世界的连接技术',
                guest: '王 玮',
                title: '北京志顶科技创始人'
            },
            {
                time: '09:35-10:10',
                cont: '企业导入区块链的设计模式与实践',
                guest: '许建志',
                title: '微软Azure Data Blockchain首席项目经理主管'
            },
            {
                time: '10:10-10:45',
                cont: '【颠覆VS融合】从产品视角看区块链行业应用变革',
                guest: '陈建闽（阿德）',
                title: 'PMCAFF&外包大师CEO、Nework CEO'
            },
            {
                time: '10:45-11:20',
                cont: '区块链金融科技创新',
                guest: '雷志斌',
                title: '香港应用科技研究院智能软件和系统群组研发总监'
            },
            {
                time: '11:20-11:55',
                cont: '穿越牛熊，Token投资量化技术指南',
                guest: '枪十七',
                title: '控银天下产品负责人'
            },
            {
                time: '11:55-13:30',
                cont: '午餐',
                guest: '',
                title: ''
            },
            {
                time: '13:30-14:00',
                cont: '区块链技术在金融借贷领域的应用实践',
                guest: '付银海',
                title: '泰然金融CTO'
            },
            {
                time: '14:00-14:30',
                cont: '区块链将带给游戏怎样的机会',
                guest: '张宏亮',
                title: '蓝港互动区块链技术&游戏事业部负责人'
            },
            {
                time: '14:30-15:00',
                cont: '区块链游戏绝不是“撸猫”那么简单',
                guest: '朱 江',
                title: '金山云区块链游戏业务负责人'
            },
            {
                time: '15:00-15:20',
                cont: '中场休息',
                guest: '',
                title: ''
            },
            {
                time: '15:20-15:50',
                cont: '游戏区块链化的平凡之路',
                guest: '隋 熙',
                title: 'CoinPaws联合创始人'
            },
            {
                time: '15:50-16:20',
                cont: 'UGC游戏的痛点及妖精购物街基于区块链技术的解决方案',
                guest: '黄 俊',
                title: '妖精购物街项目顾问、御宅游戏创始人'
            },
            {
                time: '16:20-16:50',
                cont: '牛顿：协议经济基础设施',
                guest: '徐继哲',
                title: '牛顿项目创始人&理事长、亦来云联合创始人'
            },
            {
                time: '16:50-17:20',
                cont: '主题演讲',
                guest: '神秘嘉宾',
                title: ''
            }
        ]
    },
    {
        list: [
            {
                time: '09:00',
                cont: '主持人',
                guest: '孟 岩',
                title: 'CSDN副总裁、柏链道捷CEO'
            },
            {
                time: '09:00-9:35',
                cont: '通证经济系统设计——原则和经验',
                guest: '孟 岩',
                title: 'CSDN副总裁、柏链道捷CEO'
            },
            {
                time: '09:35-10:10',
                cont: '证币链之通证关系',
                guest: '王运嘉',
                title: 'VIPcoin创始人、枫玉科技创始人兼CEO'
            },
            {
                time: '10:10-10:45',
                cont: '通证经济系统设计',
                guest: '王 玮',
                title: '北京志顶科技创始人'
            },
            {
                time: '10:45-11:55',
                cont: '圆桌论坛：哪些公链有潜力超越以太坊',
                guest: '孟岩（主持人）',
                title: 'CSDN副总裁、柏链道捷CEO'
            },
            {
                time: '',
                cont: '',
                guest: '元 道',
                title: '中关村区块链产业联盟理事长'
            },
            {
                time: '',
                cont: '',
                guest: '王运嘉',
                title: 'VIPcoin创始人、枫玉科技创始人兼CEO'
            },
            {
                time: '',
                cont: '',
                guest: '王 玮',
                title: '北京志顶科技创始人'
            }
        ]
    },
    {
        list: [
            {
                time: '13:30',
                cont: '主持人',
                guest: '任 铮',
                title: 'W基金负责人'
            },
            {
                time: '13:30-14:00',
                cont: '主题演讲',
                guest: '黄明明',
                title: '明势资本创始人'
            },
            {
                time: '14:00-14:30',
                cont: '主题演讲',
                guest: '黄峤濛',
                title: 'BKFund 联合创始人、首席分析师'
            },
            {
                time: '14:30-15:00',
                cont: '主题演讲',
                guest: '王 峰',
                title: 'W基金创始人'
            },
            {
                time: '15:00-15:20',
                cont: '中场休息',
                guest: '',
                title: ''
            },
            {
                time: '15:20-15:50',
                cont: 'NEO的投资逻辑和对区块链项目的筛选标准',
                guest: '朱威宇',
                title: 'NEO 投资合伙人'
            },
            {
                time: '15:50-16:20',
                cont: '如何做一个永不破发的区块链项目',
                guest: '王紫上',
                title: '波币创始人、云管理作者'
            },
            {
                time: '16:10-17:20',
                cont: '圆桌：2018年区块链投资机会在哪里？',
                guest: '任铮（主持人）',
                title: 'W基金负责人'
            },
            {
                time: '',
                cont: '',
                guest: '陆宏宇',
                title: '德同资本合伙人'
            },
            {
                time: '',
                cont: '',
                guest: '丰 驰',
                title: '创世资本合伙人'
            },
            {
                time: '',
                cont: '',
                guest: 'David Zhu',
                title: 'DAC和Vinci联合创始人'
            }
        ]
    },
    {
        list: [
            {
                time: '09:00',
                cont: '主持人',
                guest: 'Michael Yuan',
                title: 'Cybermiles首席科学家'
            },
            {
                time: '09:00-9:35',
                cont: '主题演讲',
                guest: 'Tim McCallum',
                title: '区块链技术开发者、Google技术导师'
            },
            {
                time: '09:35-10:10',
                cont: '物联网与区块链融合发展辨析',
                guest: '沈 杰',
                title: 'IoT架构国际标准主编、SDChain首席科学家'
            },
            {
                time: '10:10-10:45',
                cont: '主题演讲',
                guest: 'Marc Fleury',
                title: 'JBoss创始人、红帽软件执行副总裁'
            },
            {
                time: '10:45-11:20',
                cont: '芯链：如何通过软硬件结合解决区块链性能瓶颈问题',
                guest: '汪晓明',
                title: 'HPB芯链CEO'
            },
            {
                time: '11:20-11:55',
                cont: '高速异步的DAG分布式账本技术完美释放P2P网络价值',
                guest: '周政军 （Jeff Zhou）',
                title: 'TrustNote基金会创始人、区块链软件和芯片研发专家'
            }
        ]
    },
    {
        list: [
            {
                time: '13:30',
                cont: '主持人',
                guest: '许志宏',
                title: '脑洞大开创始人'
            },
            {
                time: '13:30-14:00',
                cont: '主题演讲',
                guest: 'Any',
                title: 'Bit-z COO'
            },
            {
                time: '14:00-14:30',
                cont: '数字资产投资生存指南',
                guest: '李天贺',
                title: 'Extrade创始人'
            },
            {
                time: '14:30-15:00',
                cont: 'Token二级市场的估值和治理',
                guest: '凌凤岐',
                title: 'CoinTiger创始人'
            },
            {
                time: '15:00-15:20',
                cont: '中场休息',
                guest: '',
                title: ''
            },
            {
                time: '15:20-15:50',
                cont: '去中心化的跨链钱包',
                guest: '陈 勇',
                title: 'Bituniverse创始人'
            },
            {
                time: '15:50-16:20',
                cont: '下一代交易所技术：重建加密资产交易所信誉',
                guest: '王桂杰',
                title: 'ThinkBit创始人'
            },
            {
                time: '16:20-16:50',
                cont: '区块链资产冷存储方案',
                guest: '叶 飞',
                title: '库神钱包创始合伙人&CTO'
            },
            {
                time: '16:50-17:20',
                cont: '圆桌：交易所眼中的好项目',
                guest: '李 成',
                title: 'MasterDax负责人'
            },
            {
                time: '',
                cont: '',
                guest: 'Any',
                title: 'Bit-z COO'
            },
            {
                time: '',
                cont: '',
                guest: '娄焕庆',
                title: 'Litex顾问'
            },
            {
                time: '',
                cont: '',
                guest: '谢智勇',
                title: 'CEC首席战略顾问'
            },
            {
                time: '',
                cont: '',
                guest: 'Jason Zhang',
                title: 'CoinTiger COO'
            }
        ]
    }
]
// 嘉宾
const guestData = [
    {
        list: [
            {
                img: require('./img/5.jpg'),
                name: '曹 锋',
                title: 'Pchain发起人'
            },
            {
                img: require('./img/6.jpg'),
                name: '陈伟星',
                title: '泛城资本董事长、快的打车创始人'
            },
            {
                img: require('./img/7.jpg'),
                name: '陈建闽',
                title: 'PMCAFF创始人& CEO '
            },
            {
                img: require('./img/8.jpg'),
                name: '陈雪涛',
                title: '麟玺创投创始合伙人'
            },
            {
                img: require('./img/9.jpg'),
                name: '达鸿飞',
                title: 'NEO创始人、Onchain分布科技创始人兼CEO'
            },
            {
                img: require('./img/10.jpg'),
                name: '符安文',
                title: 'SCRY创始人兼CEO'
            },
            {
                img: require('./img/11.jpg'),
                name: '傅 盛',
                title: '猎豹移动CEO'
            },
            {
                img: require('./img/12.jpg'),
                name: '付银海',
                title: '泰然金融CTO'
            },
            {
                img: require('./img/13.jpg'),
                name: '何宝宏',
                title: '中国信息通信研究院云计算与大数据研究所所长'
            },
            {
                img: require('./img/14.jpg'),
                name: '黄 建',
                title: '新加坡YEX交易所发起人'
            }
        ]
    },
    {
        list: [
            {
                img: require('./img/15.jpg'),
                name: '蒋 海',
                title: '布比创始人兼CEO'
            },
            {
                img: require('./img/16.jpg'),
                name: '姜孟君（笨总）',
                title: 'Merculet创始人'
            },
            {
                img: require('./img/17.jpg'),
                name: '康 烁',
                title: '柏链道捷CTO、清华大学区块链中心高级工程师'
            },
            {
                img: require('./img/18.jpg'),
                name: '雷志斌',
                title: '香港应用科技研究院智能软件和系统群组研发总监'
            },
            {
                img: require('./img/19.jpg'),
                name: '李 谱',
                title: 'Achain技术合伙人'
            },
            {
                img: require('./img/20.jpg'),
                name: '厉晹 Roy Li',
                title: 'Ruff Chain创始人& Ruff CEO'
            },
            {
                img: require('./img/21.jpg'),
                name: '刘 江',
                title: '美团点评技术学院院长'
            },
            {
                img: require('./img/22.jpg'),
                name: '卢 亮',
                title: 'Cybermiles CEO'
            },
            {
                img: require('./img/23.jpg'),
                name: '枪十七',
                title: '控银天下产品负责人'
            },
            {
                img: require('./img/24.jpg'),
                name: '帅 初',
                title: 'Qtum量子链联合创始人'
            }
        ]
    },
    {
        list: [
            {
                img: require('./img/25.jpg'),
                name: '沈 杰',
                title: '物联网架构国际标准主编、SDChain首席科学家'
            },
            {
                img: require('./img/26.jpg'),
                name: '孙立林',
                title: '矩阵元创始人兼CEO'
            },
            {
                img: require('./img/27.jpg'),
                name: '隋 熙',
                title: 'CoinPaws联合创始人'
            },
            {
                img: require('./img/28.jpg'),
                name: '陶曲明',
                title: '万向区块链股份公司副总经理'
            },
            {
                img: require('./img/29.jpg'),
                name: '万 涛',
                title: 'IDF极安客实验室联合创始人'
            },
            {
                img: require('./img/30.jpg'),
                name: '王 涛',
                title: 'SequoiaDB巨杉数据库联合创始人兼CTO'
            },
            {
                img: require('./img/31.jpg'),
                name: '王 玮',
                title: '北京志顶科技创始人'
            },
            {
                img: require('./img/32.jpg'),
                name: '王运嘉',
                title: 'VIPcoin创始人、枫玉科技创始人兼CEO'
            },
            {
                img: require('./img/33.jpg'),
                name: '王紫上',
                title: '波币创始人、云管理作者'
            },
            {
                img: require('./img/34.jpg'),
                name: '吴萌野',
                title: '丝链SilkChain首席架构师'
            }
        ]
    },
    {
        list: [
            {
                img: require('./img/35.jpg'),
                name: '吴为龙',
                title: 'Genaro Network创始人、吉罗科技CTO'
            },
            {
                img: require('./img/36.jpg'),
                name: '武源文',
                title: '井通网络科技有限公司 CEO'
            },
            {
                img: require('./img/37.jpg'),
                name: '相里朋',
                title: '工信部电子五所高级工程师'
            },
            {
                img: require('./img/38.jpg'),
                name: '许建志',
                title: '微软首席项目经理主管'
            },
            {
                img: require('./img/39.jpg'),
                name: '杨德升',
                title: '原ofo技术副总裁'
            },
            {
                img: require('./img/40.jpg'),
                name: '杨建新',
                title: '井通科技CTO'
            },
            {
                img: require('./img/41.jpg'),
                name: '杨耀东',
                title: '夸克链基金会科学家、Demo++联合创始人'
            },
            {
                img: require('./img/42.jpg'),
                name: '叶 飞',
                title: '库神钱包创始合伙人&CTO;'
            },
            {
                img: require('./img/43.jpg'),
                name: '张宏亮',
                title: '蓝港互动区块链技术&游戏事业部负责人'
            },
            {
                img: require('./img/44.jpg'),
                name: '张 健',
                title: '博晨创始人兼CEO、Zipper技术社区发起人'
            }
        ]
    },
    {
        list: [
            {
                img: require('./img/45.jpg'),
                name: '张 犁',
                title: 'UDAP联合创始人'
            },
            {
                img: require('./img/46.jpg'),
                name: '周 迅',
                title: 'EKT通用积分CEO'
            },
            {
                img: require('./img/47.jpg'),
                name: '周政军（Jeff Zhou）',
                title: 'TrustNote基金会创始人，区块链软件和芯片研发专家'
            },
            {
                img: require('./img/48.jpg'),
                name: '朱 江',
                title: '金山云区块链游戏业务负责人'
            },
            {
                img: require('./img/49.jpg'),
                name: '朱佩江',
                title: 'Pallet联合创始人，中关村区块链产业联盟秘书长'
            },
            {
                img: require('./img/50.jpg'),
                name: '邹 均',
                title: '海纳云CTO'
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
        navState: 1,
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
    // 时间切换
    tabClick = (e) => {
        this.setState({tabState: parseInt(e.target.getAttribute('data-index'))})
    }

    // 31号内容切换
    secondListClick = (e) => {
        this.setState({secondList: parseInt(e.target.getAttribute('data-index'))})
    }

    navClick = (e) => {
        this.setState({navState: parseInt(e.target.getAttribute('data-index'))})
    }

    componentWillMount() {
        this.props.actions.getSpecialRecommend(1, 5, 1, 12)
        this.props.actions.getSpecialNewsList(1, 4, 12)
    }

    componentDidMount() {
        $(window).scrollTop('0')
        // 快讯
        this.getlist(5, '', Cookies.get('hx_user_id'))
        setInterval(() => {
            this.getlist(5, '', Cookies.get('hx_user_id'))
        }, 60000)

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
            let f2 = $('.v2').offset().top - 150
            let f3 = $('.v3').offset().top - 150
            let f4 = $('.v4').offset().top - 150
            let f5 = $('.v5').offset().top - 150
            let f6 = $('.v6').offset().top - 150
            let f7 = $('.v7').offset().top - 500
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
            if (scroT >= f7) {
                aLi.eq(6).addClass('active').parent().siblings().children('p').removeClass('active')
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
        const {specialNewsList, quickNews, intl, specialRecommend} = this.props
        const justNow = intl.formatMessage({id: 'time.justNow'})
        const minuteAgo = intl.formatMessage({id: 'time.minuteAgo'})
        const hourAgo = intl.formatMessage({id: 'time.hourAgo'})
        let currentTime = quickNews.currentTime
        return <div className="show-special">
            <div className="special-top v2">
                <div className="special-nav">
                    <ul>
                        {
                            nav.map((item, index) => {
                                let active = this.state.navState === index ? 'active' : ''
                                return (
                                    <li key={index}>
                                        {
                                            index === 0 ? <p className='' data-index={index}><a href="http://www.huoxing24.com/" target="_blank">{item}</a></p> : <p onClick={this.navClick} className={active} data-index={index}>{item}</p>
                                        }
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div id="mydiv"></div>
                <div className="banner-box">
                    <div className="slogan"><img src={slogan} alt=""/></div>
                    <div className="hx-logo"><img src={hxLogo} alt=""/></div>
                </div>
            </div>
            <div className="box-swiper-bottom">
                <div className="fh-hot clearfix v3">
                    <h6><img src={fhHot} alt=""/></h6>
                    <div className="hot-img">
                        <div className="swiper-container hot-swiper">
                            <div className="swiper-wrapper">
                                {
                                    specialRecommend.inforList.map((item, index) => {
                                        let img = JSON.parse(item.coverPic)
                                        return (
                                            <div className="swiper-slide" key={index}><Link to={`/newsdetail?id=${item.id}`} target="_blank"><img src={img.pc_hot_subject} alt=""/><span>{item.title}</span></Link>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="swiper-pagination hot-pagination"/>
                        </div>
                    </div>
                    <div className="hot-live">
                        <div className="live-cont clearfix">
                            <h6>实时快讯</h6>
                            <Link to={`/livenews`} target="_blank">MORE ></Link>
                        </div>
                        <div className="flash-special">
                            <ul>
                                {
                                    quickNews.inforList.map((item, index) => {
                                        let time = getTime(item.createdTime, currentTime, justNow, minuteAgo, hourAgo)
                                        return (
                                            <li key={index}>
                                                <span>● <font>{time}</font></span>
                                                <p>{item.content}</p>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="fh-news v4">
                    <div className="fh-news-title clearfix">
                        <h6><img src={hotNew} alt=""/></h6>
                        <Link to={`/showSpecialNews`} target="_blank">MORE ></Link>
                    </div>
                    <div className="news-box clearfix">
                        {
                            specialNewsList.inforList.map((item, index) => {
                                let img = JSON.parse(item.coverPic)
                                return (
                                    <div className="news-list" key={index}>
                                        <Link to={`/newsdetail?id=${item.id}`} target="_blank">
                                            <img src={img.pc_subject} alt=""/>
                                            <div className="h5-title">{item.title}</div>
                                            <p>{cutString(item.synopsis, 145)}<span>查看详情></span></p>
                                        </Link>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="fh-time v5">
                    <h6><img src={fhTime} alt=""/></h6>
                    <ul className="clearfix">
                        <li onClick={this.tabClick} className={`first ${this.state.tabState === 1 ? 'active' : ''}`}
                            data-index="1">3月30日
                        </li>
                        <li onClick={this.tabClick} className={`second ${this.state.tabState === 2 ? 'active' : ''}`}
                            data-index="2">3月31日
                        </li>
                    </ul>
                    <div className="time-box">
                        <div className={`tab-list first ${this.state.tabState === 1 ? 'active' : ''}`}>
                            <table>
                                <tbody>
                                    <tr className="time">
                                        <td style={{'width': '150px'}}>时间</td>
                                        <td style={{'width': '440px'}}>议题</td>
                                        <td style={{'width': '150px'}}>演讲嘉宾</td>
                                        <td></td>
                                    </tr>
                                    {
                                        data30.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item.time}</td>
                                                    <td>{item.cont}</td>
                                                    <td>{item.guest}</td>
                                                    <td>{item.title}</td>
                                                </tr>
                                            )
                                        })
                                    }
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
                                    {
                                        data31[this.state.secondList].list.map((item, index) => {
                                            if (this.state.secondList === 2) {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.time}</td>
                                                        <td>{item.cont}</td>
                                                        <td className={`ss${index}`}>{item.guest}</td>
                                                        <td className={`ss${index}`}>{item.title}</td>
                                                    </tr>
                                                )
                                            } else if (this.state.secondList === 3) {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.time}</td>
                                                        <td>{item.cont}</td>
                                                        <td className={`aa${index}`}>{item.guest}</td>
                                                        <td className={`aa${index}`}>{item.title}</td>
                                                    </tr>
                                                )
                                            } else if (this.state.secondList === 5) {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.time}</td>
                                                        <td>{item.cont}</td>
                                                        <td className={`cc${index}`}>{item.guest}</td>
                                                        <td className={`cc${index}`}>{item.title}</td>
                                                    </tr>
                                                )
                                            } else {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.time}</td>
                                                        <td>{item.cont}</td>
                                                        <td>{item.guest}</td>
                                                        <td>{item.title}</td>
                                                    </tr>
                                                )
                                            }
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="initiator v6">
                    <h6><img src={initiator} alt=""/></h6>
                    <div className="initiator-box">
                        {
                            initiatorList.map((item, index) => {
                                return (
                                    <div className="slide-box" key={index}>
                                        <img src={item.img} alt=""/>
                                        <h5>{item.name}<span className="x1"></span><span className="x2"></span></h5>
                                        <p>{item.title}</p>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
                <div className="xc-person">
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
                                                                <h5>{d.name}<span className="x1"></span><span className="x2"></span></h5>
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
                <div className="xc-img-box v7 clearfix">
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
        specialNewsList: state.reducerSpecialNews,
        quickNews: state.quickNews,
        specialRecommend: state.reducerSpecialRecommend
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getSpecialNewsList, getQuickNewsList, getSpecialRecommend}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Special)
