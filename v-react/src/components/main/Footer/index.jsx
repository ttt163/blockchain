/**
 * Author：zhoushuanglong
 * Time：2018-01-30 18:23
 * Description：footer
 */
import React, {Component} from 'react'
import {Link} from 'react-router'

import {urlPath} from '../../../public/index'

import './index.scss'
import code from './img/newQrcode.jpg'
import tenques from './img/tenques.png'

export default class Footer extends Component {
    render() {
        const {hotData, aboutData, sColor} = this.props
        // return <div className={`footer-main ${(urlPath().toLowerCase() === '/app' || urlPath().toLowerCase() === '/showspecial' || urlPath() === '/wbcworldNews' || urlPath().toLowerCase() === '/wbcworld' || urlPath() === '/exhibitionNews') ? 'app' : ''}`} style={{'background': sColor === 'undefined' ? '#2e2e30' : sColor}}>
        return <div
            className={`footer-main ${(urlPath().toLowerCase() === '/app' || urlPath().toLowerCase() === '/showspecial' || urlPath() === '/wbcworldNews' || urlPath().toLowerCase() === '/wbcworld' || urlPath() === '/exhibitionNews') ? 'app' : ''}`}
            style={{'background': sColor === 'undefined' ? '#2e2e30' : sColor}}>
            <div className="footer-partner">
                <div className="footer-share-con">
                    <div className="footer-share">
                        <div className="list l1">
                            <div className="wx-fx">
                                <div className="arrow_down"/>
                                <p><img src={tenques} alt=""/><span>王峰十问</span></p>
                                <p><img src={code} alt=""/><span>火星财经</span></p>
                            </div>
                        </div>
                        <div className="list l2"><a href="https://t.me/huoxing24" target="_blank"/></div>
                        <div className="list l3"><a href="http://weibo.com/huoxing24" target="_blank"/></div>
                    </div>
                </div>
                <div className="footer-partner-con">
                    <h3>内容合作</h3>
                    <div className="ft-partner-link clearfix">
                        {aboutData.map((item, index) => {
                            return (
                                <a
                                    target="_blank" href={item.url} key={index}
                                    className="linekong">{item.text}<span/>
                                </a>
                            )
                        })}
                    </div>
                    <div className="cooperation">
                        <h4>广告合作</h4>
                        <h4>QQ：<span>133000693</span></h4>
                        <h4>手机：<span>‭13133477779‬</span></h4>
                        <h4>商务邮箱：<span>bd@huoxing24.com</span></h4>
                        <h4>投稿邮箱：<span>tougao@huoxing24.com</span></h4>
                    </div>
                </div>
            </div>
            <div className="footer-copyright">
                <div className="hot-label">
                    <h5>热门标签</h5>
                    <ul>
                        {
                            hotData.map((item, index) => {
                                return (
                                    <li key={index}><Link target="_blank" to={`/hot?tags=${item}`}>{item}</Link></li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="footer-copyright-con">
                    Copyright ©2018 Huoxing24 Ltd. All Rights Reserved.&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;琼ICP备18001237号-2
                </div>
                <div className="fo-left clearfix">
                    <Link to="/about">关于我们</Link>
                    <span className="cutline"/>
                    <Link to="/copyright">版权声明</Link>
                </div>
            </div>
        </div>
    }
}

Footer.defaultProps = {
    hotData: ['王峰十问', 'DAO', '监管', '比特币', '挖矿', '智能合约', '去中心化', '侧链', '硬分叉', '瑞波币', 'bitcoin', '比特币扩容', '区块链', '加密货币', '以太坊', '数字货币', '中本聪', 'ETC', '数字货币', 'EOS'],
    aboutData: [
        {text: '蓝港互动', url: 'http://new.linekong.com/'},
        {text: '小青音箱', url: 'http://www.xiaoqing.store'},
        {text: '牛眼', url: 'https://niuyan.com/'},
        {text: 'CSDN', url: 'https://www.csdn.net/'},
        {text: 'Block.cc', url: 'https://block.cc/'},
        {text: '网易区块链', url: 'http://play.163.com/special/blockchain/'},
        {text: '巴比特', url: 'http://www.8btc.com/'},
        // {text: '金色财经', url: 'http://www.jinse.com/'},
        {text: '链得得', url: 'http://www.chaindd.com/'},
        {text: 'FN财经', url: 'http://www.fn.com'},
        {text: '链向财经', url: 'https://www.chainfor.com/'},
        {text: '金牛财经', url: 'http://www.jinniu.cn/'},
        {text: '陀螺财经', url: 'http://www.tuoluocaijing.cn/'},
        {text: '非小号', url: 'https://www.feixiaohao.com/'},
        {text: '币问', url: 'https://www.bitask.org'},
        {text: '金融界区块链', url: 'http://bc.jrj.com.cn/'},
        {text: '币牛牛', url: 'https://www.coinbull.one'},
        {text: '比特快讯', url: 'https://www.bitnews.vip'},
        {text: '要发车', url: 'https://www.yaofache.com/'},
        {text: '币风', url: 'http://www.coinwind.com/'},
        {text: '白鲸财经', url: 'http://www.baijing.io'},
        {text: '猎云财经', url: 'https://www.lieyuncj.com/'},
        {text: '芬果财经', url: 'http://www.xn--gtv651d.com/'}
    ]
}
