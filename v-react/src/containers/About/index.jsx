/**
 * Author：liushaozong
 * Time：2018/01/23
 * Description：news
 */
import React, {Component} from 'react'

import './index.scss'

// import logo from './img/logo.png'
import bd from './img/bd.png'
import tg from './img/tg.png'
import qrcode from './img/qrcode.jpg'

class About extends Component {
    componentDidMount() {
        $(window).scrollTop('0')
    }

    render() {
        return <div className="about-content">
            <div className="logo-content">
                {/* <img src={logo} alt="" className="logo"/> */}
            </div>
            <div className="about-content-div">
                <div className="about-content">
                    <p className="title">关于我们</p>
                    <p className="en-title">ABOUT US</p>
                    <div className="content">
                        <p>
                            海南天辰网络科技有限公司于2018年2月5日创立，其主要业务《火星财经》是首个24小时区块链财经资讯门户，全天候不间断报道全球区块链新闻，并致力于让最广大民众参与到区块链重构世界的过程中去。
                        </p>
                        <p>
                            继互联网之后，区块链正成为人类社会的第四次科技革命，它不仅在颠覆交易、社交、通信等现代社会基础行业的技术构成，还在重塑着人类的一切生产关系。区块链不仅把一切信息互联，还把价值互联互通，使之保持真实、高效流动。未来，将是一个区块链无处不在，重塑每个人的时代，一场国民性的区块链启蒙运动正在兴起。
                        </p>
                        <p>
                            在这一剧烈变动期，区块链领域信息极度不对称，项目良莠混杂。《火星财经》生逢其时，我们的股东与团队中无任何区块链直接利益方，我们将始终秉承独立客观的媒体立场，为广大投资者提供真实、有用的专业区块链资讯。同时，我们也希望用最通俗易懂的方式传播这些信息。
                        </p>
                        <p className="believe">
                            《火星财经》将与全球最具好奇心，最具向上动力和最具活力的人群始终站在一起。
                        </p>
                        <p>
                            我们相信，区块链终将改变世界。
                        </p>
                    </div>
                    <div className="contact-us" style={{display: 'none'}}>
                        <p className="title">联系我们</p>
                        <p className="en-title">CONTACT US</p>
                        <div className="bd">
                            <img src={bd} alt=""/>
                            <p className="mail">商务合作邮箱</p>
                            <p className="mail-add">bd@huoxing24.com</p>
                        </div>
                        <div className="tg">
                            <img src={tg} alt=""/>
                            <p className="mail">投稿邮箱</p>
                            <p className="mail-add">tougao@huoxing24.com</p>
                        </div>
                    </div>
                    <div className="follow-us" style={{display: 'none'}}>
                        <p className="title">关注我们</p>
                        <p className="en-title">FOLLOW US</p>
                        <div className="qrcode">
                            <img src={qrcode} alt="" className="code"/>
                            <p className="">微信公众号</p>
                        </div>
                        <div className="follow">
                            <a className="tele" target="_blank" href="https://t.me/huoxing24"></a>
                            <a className="sina" target="_blank" href="http://weibo.com/huoxing24"></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default (About)
