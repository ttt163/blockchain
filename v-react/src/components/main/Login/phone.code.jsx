/**
 * Author：tantingting
 * Time：2018/3/30
 * Description：Description
 */
import React, {Component} from 'react'
import './phone.code.scss'

export default class PhoneCode extends Component {
    render() {
        // constructor () {
        //     super()
        //     this.state = {
        //         curr
        //     }
        // }
        const {isShow, selectCode} = this.props
        // console.log(this.props)
        return (
            <div className="phone-code-box" style={{'display': !isShow ? 'none' : 'block'}}>
                <div className="code-contain">
                    <div className="code-item select" onClick={() => selectCode('86')}>
                        <div className="left">China（中国大陆）</div>
                        <div className="right">86</div>
                    </div>
                    <div className="code-item">
                        <div className="left">Argentina（阿根廷）</div>
                        <div className="right">54</div>
                    </div>
                    <div className="code-item">
                        <div className="left">China（中国大陆）</div>
                        <div className="right">86</div>
                    </div>
                    <div className="code-item">
                        <div className="left">Argentina（阿根廷）</div>
                        <div className="right">54</div>
                    </div>
                    <div className="code-item">
                        <div className="left">China（中国大陆）</div>
                        <div className="right">86</div>
                    </div>
                    <div className="code-item">
                        <div className="left">Argentina（阿根廷）</div>
                        <div className="right">54</div>
                    </div>
                    <div className="code-item">
                        <div className="left">China（中国大陆）</div>
                        <div className="right">86</div>
                    </div>
                </div>
            </div>
        )
    }
}
