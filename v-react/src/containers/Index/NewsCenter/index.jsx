/**
 * Author：liushaozong
 * Time：2018-01-21 21:34
 * Description：index news list
 */

import React, {Component} from 'react'
import {injectIntl} from 'react-intl'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {getAdInfo} from '../../../actions/ad'

import './index.scss'

import NewsCenterImg from './NewsCenterImg'
// import NewsRightImg from '../NewsRight/NewsRightImg'
// import Ad from '../../../components/public/Ad'
import NewsSubject from './NewsSubject'

// import NewsMarket from './NewsMarket'
// import IndexNewCoin from './IndexNewCoin'

// import img0 from '../img/ad-center-up-0.jpg'
// import img1 from '../img/ad-center-up-1.jpg'

// const adCenterUp = [
//     {
//         img: img0,
//         href: 'http://pixiecoin.io'
//     }, {
//         img: img1,
//         href: 'http://www.huoxing24.com/#/newsdetail/2018030218081835058'
//     }
// ]

const mapStateToProps = (state) => {
    return {
        adInfo: state.adInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getAdInfo}, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
class NewsCenter extends Component {
    render() {
        // const {imgTop, imgBottom, subjectAd} = this.props
        const {imgBottom, subjectAd} = this.props
        return <div className="index-news-center">
            {/* <Ad imgArr={imgTop}/> */}
            <div className="subject-h5">热门专题</div>
            {subjectAd && subjectAd.length !== 0 ? <NewsSubject imgArr={subjectAd}/> : <NewsSubject imgArr={[]}/>}
            {/* <IndexNewCoin/>
            <NewsMarket/> */}
            <NewsCenterImg imgData={imgBottom}/>
        </div>
    }
}

export default injectIntl(NewsCenter)
