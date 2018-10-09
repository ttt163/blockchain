/**
 * Author：liushaozong
 * Time：2018-01-21 21:34
 * Description：index news-center - img
 */

import React, {Component} from 'react'
import Ad from '../../../../components/public/Ad'

import './index.scss'

// import newImg from './img/advertising1.jpg'
// import newImg2 from './img/advertising2.jpg'
import newImg2 from './img/ad-right-0.jpg'
// import newImg1 from './img/question-index-img.jpg'
import newImg1 from './img/right-1.jpeg'
import newImg3 from './img/right-3.jpeg'

class NewsRightImg extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false
        }
    }

    render() {
        // const {show} = this.state
        return <div className="news-right-img clearfix">
            {/* <div
                className="questionnaire-index"
                onClick={() => {
                    this.setState({
                        show: true
                    })
                }}>
                <img src={newImg1}/>
            </div>
            <div className="questionaire-popup" style={{display: show ? 'block' : 'none'}}>
                <div className="questionaire-mask"/>
                <div className="questionaire-con">
                    <div className="iframe-wrap">
                        <iframe
                            height="100%"
                            allowtransparency="true"
                            style={{width: '100%', border: 'none', overflow: 'auto'}}
                            frameBorder="0"
                            src="http://huoxing24.mikecrm.com/obJeoME"/>
                    </div>
                    <a className="questionaire-close" onClick={() => {
                        this.setState({
                            show: false
                        })
                    }}>×</a>
                </div>
            </div> */}
            <Ad imgArr={this.props.imgArr}/>
        </div>
    }
}

NewsRightImg.defaultProps = {
    imgData: [
        {
            img: newImg1,
            href: 'http://pixiecoin.io/index.html'
        }, {
            img: newImg2,
            href: 'http://www.huoxing24.com/#/newsdetail/2018022819242091703'
        }, {
            img: newImg3,
            href: 'http://www.huoxing24.com/#/newsdetail/2018030319522099286'
        }
    ]
}

export default NewsRightImg
