/**
 * Author：tantingting
 * Time：2018/4/20
 * Description：Description
 */
import React, {Component} from 'react'
import './index.scss'
import Ad from '../../../../components/public/Ad'

export default class AdSwiper extends Component {
    componentDidMount() {
        let mySwiper = new window.Swiper('#adSwiper', {
            loop: true,
            autoplay: 3000,
            // 如果需要分页器
            pagination: '.swiper-pagination',
            // 如果需要前进后退按钮
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev'
        })

        $('.ad-swiper').on('mouseenter', function () {
            mySwiper.stopAutoplay()
        })
        $('.ad-swiper').on('mouseleave', function () {
            mySwiper.startAutoplay()
        })
    }
    render() {
        const {adData} = this.props
        return (
            <div id="adSwiper" className="ad-swiper swiper-container">
                <div className="swiper-wrapper">
                    {
                        adData.map((item, index) => (
                            <div key={index} className="swiper-slide">
                                <Ad imgArr={[item]} />
                            </div>
                        ))
                    }
                </div>
                {/* <!-- 如果需要分页器 --> */}
                <div className="swiper-pagination"></div>

                {/* <!-- 如果需要导航按钮 --> */}
                <div className="swiper-button-prev"></div>
                <div className="swiper-button-next"></div>
            </div>
        )
    }
}
