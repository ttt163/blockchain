/**
 * Author：tantingting
 * Time：2018/4/8
 * Description：Description
 */
import React, {Component} from 'react'
import Cropper from 'react-cropper'
// import {Link} from 'react-router'
// import {Link} from 'react-router'
// import Cookies from 'js-cookie'
import {dataURLtoBlob} from '../../../public/'
import 'rc-pagination/assets/index.css'
import 'cropperjs/dist/cropper.css'
// import testImg from './img/test.jpg'

export default class ImgCoorpper extends Component {
    cropImage = () => {
        const {confirm} = this.props
        if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
            return
        }
        let formData = new FormData()
        let imgBlob = dataURLtoBlob(this.cropper.getCroppedCanvas().toDataURL())
        formData.append('uploadFile', imgBlob)
        confirm(formData)
    }

    render() {
        // const {isShow, src, close} = this.props
        const {isShow, src} = this.props
        return (
            <div className="img-corpper-warp" style={{display: !isShow ? 'none' : 'block'}}>
                {/* <div className="mask" onClick={() => close()}></div> */}
                <div className="mask"></div>
                <div className="img-corpper-contain">
                    {/* <div className="img-preview"/> */}
                    <Cropper
                        ref={cropper => {
                            this.cropper = cropper
                        }}
                        src={src}
                        style={{height: 204, width: 280, margin: '0 auto 18px'}}
                        aspectRatio={280 / 204}
                        dragMode='move'
                        guides={true}/>
                    <div className="confirm-btn" onClick={() => this.cropImage()}>确认修改</div>
                </div>
            </div>
        )
    }
}
