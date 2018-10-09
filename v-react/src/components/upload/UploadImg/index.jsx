/**
 * Author：tantingting
 * Time：2018/4/3
 * Description：Description
 */

import React, {Component} from 'react'
import './index.scss'
// import testImg from './img/test.jpg'
import {axiosFormData} from '../../../public/index'
import ImgCorpper from './imgCorpper'

export default class UploadImg extends Component {
    constructor(props) {
        super(props)
        this.state = {
            'imgUrl': !props.url ? '' : props.url,
            'filePath': '',
            'isFinish': !!props.url,
            'isMask': false,
            'isUploading': false,
            'showPreview': false,
            'isShowImgCorpper': false
        }
    }

    // 选择文件
    selectImg = (e) => {
        e.preventDefault()
        this.setState({'filePath': e.target.value})
        let files = []
        if (!e.dataTransfer) {
            files = e.target.files
        } else if (e.target) {
            files = e.dataTransfer.files
        }
        let file = files[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            this.setState({imgUrl: reader.result})
        }
        this.setState({'isShowImgCorpper': true})
    }

    // 上传文件
    submitImg = (formData, fn) => {
        const {setUrl} = this.props
        let self = this
        self.setState({'isShowImgCorpper': false, 'isUploading': true})
        axiosFormData('POST', '/mgr/pic/upload', formData, function (res) {
            // console.log(res)
            if (res.code === 1) {
                self.setState({'imgUrl': res.obj, isFinish: true})
                setUrl(res.obj)
            }
            if (fn) {
                fn(res)
            }
        })
    }

    // 删除文件
    delFile = () => {
        let initData = {
            'imgUrl': '',
            'filePath': '',
            'isFinish': false,
            'isMask': false,
            'isUploading': false,
            'showPreview': false,
            'isShowImgCorpper': false
        }
        this.setState(initData)
        this.props.setUrl('')
    }

    render() {
        const {imgUrl, isFinish, isMask, showPreview, isUploading, isShowImgCorpper, filePath} = this.state
        return (
            <div className="upload-img">
                {/* 上传 */}
                <div className="upload-img-select" style={{display: !isFinish ? 'block' : 'none'}}>
                    <div className="select-box" style={{display: !isUploading ? 'block' : 'none'}}>
                        <div className="select-bg">
                            <i className="iconfont iconfont-add"></i>
                            <div>上传图片</div>
                        </div>
                        <input type="file" onChange={(e) => this.selectImg(e)} value={filePath} />
                    </div>
                    <div className="uploading-box" style={{display: !isUploading ? 'none' : 'block'}}>
                        <div>文件上传中</div>
                        <div className="upload-img-progress">
                            <div className="upload-img-progress-bg">
                                <div className="upload-img-progress-bar"></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 上传完成 */}
                <div className="upload-img-finish" onMouseEnter={() => this.setState({'isMask': true})} onMouseLeave={() => this.setState({'isMask': false})} style={{display: !isFinish ? 'none' : 'block'}}>
                    <div className="img-content">
                        <img src={`${imgUrl}`}/>
                        <div className="upload-img-mask" style={{zIndex: !isMask ? '-1' : '5'}}>
                            <i onClick={() => this.setState({'showPreview': true})} className="iconfont iconfont-look"></i>
                            <i onClick={() => this.delFile()} className="iconfont iconfont-del"></i>
                        </div>
                    </div>
                </div>

                {/* 预览图片 */}
                <div className="upload-img-preview" style={{display: !showPreview ? 'none' : 'block'}}>
                    <div className="preview-contain">
                        <div onClick={() => this.setState({'showPreview': false})} className="mask"></div>
                        <div className="img-preview-body">
                            <div onClick={() => this.setState({'showPreview': false})} className="close iconfont iconfont-close"></div>
                            <div className="img-content">
                                <img src={imgUrl} />
                            </div>
                        </div>
                    </div>
                </div>
                {/* 图片剪裁 */}
                <ImgCorpper isShow={isShowImgCorpper} src={imgUrl} confirm={(formData, fn) => this.submitImg(formData, fn)} close={() => this.setState({'isShowImgCorpper': false})} />
            </div>
        )
    }
}
