/**
 * Author：liushaozong
 * Time：2018-01-21 21:34
 * Description：index news-center - img
 */

import React from 'react'
import Ad from '../../../../components/public/Ad'
import './index.scss'
import newImg1 from './img/home-img1-0.jpg'
import newImg2 from './img/home-img6.jpg'
// import newImg3 from './img/home-img3.jpg'
import newImg4 from './img/home-img4.jpg'
// import newImg5 from './img/home-img5.jpg'

const NewsCenterImg = (props) => {
    const {imgData} = props
    return <div className="news-center-img clearfix">
        <Ad imgArr={imgData}/>
    </div>
}

NewsCenterImg.defaultProps = {
    imgData: [
        {
            img: newImg1,
            imgHref: 'http://www.huoxing24.com/#/newsdetail/2018030117375683668'
        },
        {
            img: newImg2,
            imgHref: 'http://www.huoxing24.com/#/newsdetail/2018022821001342369'
        },
        {
            img: newImg4,
            imgHref: 'http://www.huoxing24.com/#/newsdetail/2018020111503925728'
        }
    ]
}

export default (NewsCenterImg)
