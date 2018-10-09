/**
 * Author：liushaozong
 * Time：2018-01-21 21:34
 * Description： news - img
 */

import React, {Component} from 'react'

import './index.scss'
import newImg from './img/news-330-160.jpg'

class Ad extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imgArr: []
        }
    }

    render() {
        let {imgArr, imgSize} = this.props
        return <div className="news-img clearfix">
            {
                imgArr.map((item, index) => {
                    return <a
                        key={index}
                        href={item.url}
                        target="_blank"
                        style={{
                            width: (imgSize && imgSize.width) || '100%',
                            height: (imgSize && imgSize.height) || '100%'
                        }}>
                        <img src={item.img_url} alt=""/>
                        <span className={`${item.useType === 1 ? 'active' : ''}`}/>
                    </a>
                })
            }
        </div>
    }
}

Ad.defaultProps = {
    imgData: [newImg, newImg]
}

export default Ad
