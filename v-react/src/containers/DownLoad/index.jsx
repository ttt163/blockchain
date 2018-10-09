/**
 * Author：liushaozong
 * Time：2018/01/23
 * Description：news
 */
import React, {Component} from 'react'

import './index.scss'
import phone from './img/phone.png'
import downLogo from './img/download-logo.png'
import downEwm from './img/ewm.jpg'

class DownLoad extends Component {
    componentDidMount() {
        $(window).scrollTop('0')
    }

    render() {
        return <div className="down-load">
            <div className="down-cont">
                <div className="phone"><img src={phone} alt=""/></div>
                <div className="down-load-box">
                    <div className="down-log"><img src={downLogo} alt=""/></div>
                    <div className="down-ewm">
                        <p>
                            <img src={downEwm} alt=""/>
                        </p>
                    </div>
                    <div className="down-btn">
                        <a className="ios" href='https://itunes.apple.com/cn/app/id1343659925?mt=8' target="_black"></a>
                        <a className="android" href='http://android.myapp.com/myapp/detail.htm?apkName=com.linekong.mars24&ADTAG=mobile#opened' target="_black"></a>
                    </div>
                </div>
            </div>
            <div className="phone-shade"></div>
        </div>
    }
}

export default (DownLoad)
