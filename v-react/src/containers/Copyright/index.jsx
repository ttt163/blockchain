/**
 * Author：liushaozong
 * Time：2018/01/23
 * Description：news
 */
import React, {Component} from 'react'

import './index.scss'

class CopyRight extends Component {
    componentDidMount() {
        $(window).scrollTop('0')
    }
    render() {
        return <div className="copyright-content">
            <p className="copyright-title">版权声明</p>
            <div className="copyright-content">
                <p>
                    1、火星财经网站刊载的所有内容，包括但不限于文字报道、图片、视频、图表、标志标识、商标、版面设计、专栏目录与名称、内容分类标准等，均受《中华人民共和国著作权法》、《中华人民共和国商标法》、《中华人民共和国专利法》及适用之国际公约中有关著作权、商标权、专利权以及或其它财产所有权法律的保护，相应的版权或许可使用权均属本网站所有。
                </p>
                <p>
                    2、凡未经火星财经书面授权，任何媒体、网站及个人不得转载、复制、重制、改动、展示或使用界面网站的局部或全部的内容或服务，或在非火星财经网站所属服务器上建立镜像。如果已转载，请自行删除。同时，我们保留进一步追究相关行为主体的法律责任的权利。
                </p>
                <p>
                    3、我们希望与各媒体合作，签订著作权有偿使用许可合同。凡侵犯火星财经版权等知识产权的，火星财经必依法追究其法律责任。
                </p>

                <p>
                    4、已经本网站授权使用的，应按照授权合同所规定条款使用。
                </p>

                <p>
                    5、本网站摘录或转载的属于第三方的信息，目的在于传递更多信息，并不代表本网站赞同其观点和对其真实性负责，转载信息版权属于原媒体及作者。如其他媒体、网站或个人擅自转载使用，请自负版权等法律责任。
                </p>
            </div>
        </div>
    }
}

export default (CopyRight)
