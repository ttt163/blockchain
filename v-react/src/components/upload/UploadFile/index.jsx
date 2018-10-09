/**
 * Author：tantingting
 * Time：2018/4/3
 * Description：Description
 */

import React, {Component} from 'react'
import {axiosFormData} from '../../../public/index'
import './index.scss'

export default class UploadFile extends Component {
    constructor(props) {
        super(props)
        // console.log(props)
        this.state = {
            'file': null,
            'fileList': [],
            'fileInfo': null,
            fileValue: '',
            uploadData: {
                currIndex: 1,
                uploadId: '',
                fileName: '',
                url: '',
                progress: 0,
                isUpload: false,
                isFinish: false
            }
        }
    }
    // 'fileInfo': {
    //     'uid': null,
    //     'fileName': '',
    //     'fileUrl': ''
    // },
    // componentDidMount() {
    //     const props = this.props
    //     let thisUploadData = this.state.uploadData
    //     this.setState({
    //         uploadData: {
    //             ...thisUploadData,
    //             fileName: !props.fileName ? '' : props.fileName,
    //             url: !props.url ? '' : props.url,
    //             isFinish: !!props.url
    //         }
    //     })
    // }

    // 选择文件
    selectFile = (e) => {
        let files = e.target.files
        let initUploadData = {
            currIndex: 1,
            uploadId: '',
            url: '',
            fileName: files[0].name,
            progress: 0,
            isUpload: false,
            isFinish: false
        }
        // let currFileName = files[0].name
        // let fileValue = `${currFileName.split('.')[0]}${new Date().getTime()}.${files[0].name.split('.')[1]}`
        this.setState({
            file: files[0],
            fileList: files,
            uploadData: initUploadData
        })
        this.props.setUrl('', files[0].name, null)
        this.uploadFile(files[0], initUploadData)
    }

    // 文件删除
    delFile = () => {
        let thisState = {
            'file': null,
            'fileList': [],
            uploadData: {
                currIndex: 1,
                uploadId: '',
                url: '',
                fileName: '',
                progress: 0,
                isUpload: false,
                isFinish: false
            }
        }
        this.setState({...thisState})
        this.props.setUrl('', '', null)
    }

    // 开始上传
    uploadFile = (f, data) => {
        // const {uploadData, file} = this.state
        let uploadData = null
        let file = null
        if (!f) {
            uploadData = this.state.uploadData
            file = this.state.file
        } else {
            uploadData = data
            file = f
        }
        let currIndex = uploadData.currIndex
        let uploadId = uploadData.uploadId
        let totalSize = file.size // 文件大小
        let blockSize = 1024 * 1024 * 2 // 块大小
        let blockCount = Math.ceil(totalSize / blockSize) // 总块数
        // 创建FormData对象
        let formData = new FormData()
        formData.append('fileName', file.name) // 文件名
        formData.append('blockCount', blockCount) // 总块数
        formData.append('currIndex', currIndex) // 当前上传的块下标
        formData.append('uploadId', uploadId) // 上传编号
        formData.append('uploadFile', null)
        formData.append('type', 'video')
        let upLoadInfo = {
            totalSize: totalSize,
            blockSize: blockSize,
            blockCount: blockCount
        }

        this.UploadPost(file, formData, uploadData, upLoadInfo)
    }

    UploadPost = (file, formData, uploadData, upLoadInfo) => {
        // const {uploadData} = this.state
        const {setUrl} = this.props
        let currIndex = uploadData.currIndex
        let uploadId = uploadData.uploadId
        let self = this
        // this.setState({'isUpload': true})
        this.setState({uploadData: {...uploadData, isUpload: true}})
        try {
            let start = (currIndex - 1) * upLoadInfo.blockSize
            let end = Math.min(upLoadInfo.totalSize, start + upLoadInfo.blockSize)
            let uploadFile = file.slice(start, end)
            formData.set('uploadFile', uploadFile)
            formData.set('currIndex', currIndex)
            formData.set('uploadId', uploadId)
            axiosFormData('POST', '/mgr/file/upload', formData, (res) => {
                // console.log(res)
                if (res.code === 1) {
                    let num = currIndex / upLoadInfo.blockCount * 100
                    if (currIndex + 1 >= upLoadInfo.blockCount) {
                        num = 100
                    }
                    // console.log(`${num.toFixed(2)}%`)
                    // $('#progress').text((num).toFixed(2) + '%')
                    if (currIndex < upLoadInfo.blockCount) {
                        // self.setState({'currIndex': currIndex + 1, videoProgress: num.toFixed(2)})
                        self.setState({uploadData: {...uploadData, currIndex: currIndex + 1, progress: num.toFixed(2), uploadId: res.obj}})
                        let uploadDataObj = {...uploadData, currIndex: currIndex + 1, progress: num.toFixed(2), uploadId: res.obj}
                        self.UploadPost(file, formData, uploadDataObj, upLoadInfo)
                    }
                    // self.setState({uploadData: {...uploadData, currIndex: currIndex + 1, progress: num.toFixed(2), uploadId: res.obj}})
                    // self.UploadPost(file, formData, totalSize, blockCount, blockSize)
                } else if (res.code < 0) {
                    console.log('code:' + res.code + '; msg:' + res.msg)
                } else if (res.code === 2) {
                    console.log('上传成功')
                    // self.setState({'vUrl': res.obj})
                    let fileInfo = {
                        'uid': `rc-upload-${file.lastModified}-${Math.round(Math.random() * 99)}`,
                        'fileName': file.name,
                        'fileUrl': res.obj
                    }
                    self.setState({uploadData: {...uploadData, url: res.obj, isUpload: false, isFinish: true, fileName: file.name, fileInfo: fileInfo}})
                    setUrl(res.obj, file.name, fileInfo)
                    // console.log('code:' + res.code + '; msg:' + res.msg + '; url:' + res.obj)
                }
            })
        } catch (e) {
            alert(e)
        }
    }

    render() {
        const {title, isBtn} = this.props
        const {file, uploadData, fileValue} = this.state
        return (
            <div className="upload-file">
                <div className="file-select">
                    <div className="file-select-btn">
                        <i className="iconfont iconfont-upload"></i>
                        <span>{title}</span>
                    </div>
                    <input type="file" value={fileValue} onChange={(e) => this.selectFile(e)}/>
                </div>
                {
                    !isBtn ? '' : (
                        <div style={{display: !file ? 'none' : 'block'}} className="file-list clearfix">
                            <div>
                                <i className="iconfont iconfont-file"></i>
                                <span>{!file ? '' : file.name}</span>
                            </div>
                            <i onClick={() => this.delFile()} className="iconfont iconfont-close"></i>
                        </div>
                    )
                }
                <div style={{display: !uploadData.isFinish ? 'none' : 'block'}} className="file-finish-list">
                    <a href={uploadData.url} target="_blank" className="file-name">{uploadData.fileName}</a>
                    <a onClick={() => this.delFile()} className="del-btn" href="javascript:void(0)">删除</a>
                </div>
                {
                    !isBtn ? '' : (
                        <a className={!file || uploadData.isFinish ? 'upload-btn disabled' : !uploadData.isUpload ? 'upload-btn primary' : 'upload-btn primary loading'} onClick={() => !file || uploadData.isFinish || uploadData.isUpload ? '' : this.uploadFile()} href="javascript:void(0)">开始上传</a>
                    )
                }
                <div className="file-progress" style={{display: !uploadData.isUpload ? 'none' : 'block'}}>
                    <div className="file-progress-bg">
                        <div style={{'width': `${uploadData.progress}%`}} className="file-progress-bar"></div>
                    </div>
                    <div className="file-progress-text">{uploadData.progress}%</div>
                </div>
            </div>
        )
    }
}
