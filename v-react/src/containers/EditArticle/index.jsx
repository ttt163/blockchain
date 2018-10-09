/**
 * Author：zhoushuanglong
 * Time：2018-03-03 19:39
 * Description：edit article
 */

import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {browserHistory} from 'react-router'
import Cookies from 'js-cookie'

import {titleArr} from '../../public/index'
import PostEditor from '../../components/public/PostEditor'
import '../../../node_modules/layui-layer/dist/layer.js'
// import videoUrl from './img/video.png'

import './index.scss'

import {sendArticle, uploadvideo} from '../../actions/user'

import UploadFile from '../../components/upload/UploadFile'
import UploadImg from '../../components/upload/UploadImg'

const mapStateToProps = (state) => {
    return {
        loginInfo: state.loginInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({sendArticle, uploadvideo}, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class EditArtile extends Component {
    state = {
        selectedRadio: titleArr[0].value,
        content: '',
        pcUrl: '',
        mUrl: '',
        aName: '',
        vName: '',
        aUrl: '',
        vUrl: '',
        aFileInfo: null,
        vFileInfo: null,
        timeId: 0
    }

    // componentWillMount() {
    //     this.getArticleInfo()
    // }

    componentDidMount() {
        this.getArticleInfo()
        this.setState({timeId: setInterval(() => {
            this.saveArticleInfo()
            console.log('存储了')
        }, 10 * 1000)})
    }

    componentWillUnmount() {
        const {timeId} = this.state
        this.setState({timeId: clearInterval(timeId)})
    }

    // 获取本地缓存
    getArticleInfo = () => {
        let articleInfo = !localStorage.getItem('articleInfo') ? null : JSON.parse(localStorage.getItem('articleInfo'))
        if (!articleInfo) {
            return
        }
        // articleInfo = JSON.parse(articleInfo)
        this.articleTitle.value = articleInfo.title
        this.articleSynopsis.value = articleInfo.synopsis
        this.setState({
            content: articleInfo.content,
            selectedRadio: articleInfo.channelId,
            pcUrl: articleInfo.video.pcImg,
            mUrl: articleInfo.video.mImg,
            vName: articleInfo.video.name,
            vUrl: articleInfo.video.url,
            aUrl: articleInfo.audio.url,
            aName: articleInfo.audio.name,
            aFileInfo: articleInfo.audio.info,
            vFileInfo: articleInfo.video.info
        })
        let uploadAudio = this.uploadAudio
        let uploadVideo = this.uploadVideo
        let uploadAudioData = uploadAudio.state.uploadData
        let uploadVideoData = uploadVideo.state.uploadData
        uploadAudio.setState({
            uploadData: {
                ...uploadAudioData,
                fileName: !articleInfo.audio.name ? '' : articleInfo.audio.name,
                url: !articleInfo.audio.url ? '' : articleInfo.audio.url,
                isFinish: !!articleInfo.audio.url
            }
        })
        uploadVideo.setState({
            uploadData: {
                ...uploadVideoData,
                fileName: !articleInfo.video.name ? '' : articleInfo.video.name,
                url: !articleInfo.video.url ? '' : articleInfo.video.url,
                isFinish: !!articleInfo.video.url
            }
        })
    }

    // 本地存储
    saveArticleInfo = () => {
        const {vUrl, pcUrl, mUrl, aUrl, aName, vName, aFileInfo, vFileInfo} = this.state
        const channelId = this.state.selectedRadio
        const title = $.trim(this.articleTitle.value)
        const synopsis = $.trim(this.articleSynopsis.value)
        const content = $.trim(this.state.content)
        let infoData = {
            title: title,
            channelId: channelId,
            synopsis: synopsis,
            content: content,
            audio: {
                url: aUrl,
                name: aName,
                info: aFileInfo
            },
            video: {
                url: vUrl,
                name: vName,
                pcImg: pcUrl,
                mImg: mUrl,
                info: vFileInfo
            }
        }
        localStorage.setItem('articleInfo', JSON.stringify(infoData))
        // 图片字段是: `cover_pic`,然后里面是json字符串,包含下面几个key :pc_recommend:pc端推荐封面;pc:列表显示;wap_big:手机推介封面;wap_small:实际列表封面;video_pc:pc端视频封面;video_m:手机端封面;pc_subject:pc专题封面;pc_hot_subject:pc专题推介位封面;m_subject:专题手机端封面;m_hot_subject:专题手机端推介封面;',
    }

    publishArticle = () => {
        const {vUrl, pcUrl, mUrl, vFileInfo, aFileInfo} = this.state
        const passportid = Cookies.get('hx_user_id')
        const token = Cookies.get('hx_user_token')
        const author = Cookies.get('hx_user_nickname')
        const channelId = this.state.selectedRadio
        const title = $.trim(this.articleTitle.value)
        const synopsis = $.trim(this.articleSynopsis.value)
        const content = $.trim(this.state.content)
        let coverPic = null

        if (title === '') {
            layer.msg('标题不能为空!')
            return
        } else if (content === '') {
            layer.msg('内容不能为空!')
            return
        } else if (synopsis === '') {
            layer.msg('摘要不能为空!')
            return
        } else if (vUrl !== '') {
            if (pcUrl === '') {
                layer.msg('视频PC封面不能为空!')
                return
            } else if (mUrl === '') {
                layer.msg('视频M端封面不能为空!')
                return
            }
        }
        let params = new URLSearchParams()
        coverPic = {
            video_pc: pcUrl,
            video_m: mUrl
        }
        let aFileArr = []
        let vFileArr = []
        aFileArr.push(aFileInfo)
        vFileArr.push(vFileInfo)
        /* if (!aFileInfo) {
            aFileArr = null
        } else {
            aFileArr.push(aFileInfo)
        }
        if (!vFileArr) {
            vFileArr = null
        } else {
            vFileArr.push(vFileInfo)
        } */
        params.append('channelId', parseInt(channelId))
        params.append('title', title)
        params.append('content', content)
        params.append('synopsis', synopsis)
        params.append('author', author)
        params.append('token', token)
        params.append('passportId', passportid)
        params.append('tags', '')
        // params.append('coverPic', '')
        params.append('audio', !aFileInfo ? '' : JSON.stringify(aFileArr))
        params.append('video', !vFileInfo ? '' : JSON.stringify(vFileArr))
        params.append('coverPic', !vFileInfo ? '' : JSON.stringify(coverPic))

        this.props.actions.sendArticle(params, function (data) {
            if (data.code === 1) {
                layer.msg('发布成功!')
                localStorage.removeItem('articleInfo')
                setTimeout(() => {
                    browserHistory.push({
                        pathname: `/userMyArticle`
                    })
                }, 500)
            } else {
                layer.msg(data.msg)
            }
        })
        // 图片字段是: `cover_pic`,然后里面是json字符串,包含下面几个key :pc_recommend:pc端推荐封面;pc:列表显示;wap_big:手机推介封面;wap_small:实际列表封面;video_pc:pc端视频封面;video_m:手机端封面;pc_subject:pc专题封面;pc_hot_subject:pc专题推介位封面;m_subject:专题手机端封面;m_hot_subject:专题手机端推介封面;',
    }

    radioChange = (value) => {
        this.setState({
            selectedRadio: value
        })
    }

    getContent = (content) => {
        // console.log(content)
        this.setState({
            content: content
        })
    }

    handleChange = (event) => {
        // console.log(event)
    }

    clearEditor = () => {
        this.articleTitle.value = ''
        this.articleSynopsis.value = ''
        this.postEditor.clearContent()
        // 视频音频， 视频封面图片
        if (this.state.vUrl !== '') {
            this.uploadPcImg.delFile()
            this.uploadMImg.delFile()
        }
        this.uploadAudio.delFile()
        this.uploadVideo.delFile()
        this.setState({
            pcUrl: '',
            mUrl: '',
            aName: '',
            vName: '',
            aUrl: '',
            vUrl: ''
        })
        // 清除本地缓存
        localStorage.removeItem('articleInfo')
    }

    render() {
        const This = this
        const {vUrl, pcUrl, mUrl, aUrl, vName, aName} = this.state
        const authorName = Cookies.get('hx_user_nickname')
        // console.log(this.state)
        return <div className="edit-article">
            <div className="edit-article-con">
                <table>
                    <tbody>
                        <tr>
                            <th>作者：</th>
                            <td>{authorName}</td>
                        </tr>
                        <tr>
                            <th>频道：</th>
                            <td>{titleArr.map(function (item, index) {
                                if (item.value !== '8' && item.value !== '9') {
                                    return <div key={index} className="edit-radio">
                                        <input
                                            onChange={This.handleChange}
                                            checked={This.state.selectedRadio === item.value ? 'checked' : ''}
                                            name="channel"
                                            value={item.value}
                                            type="radio"/>
                                        <span>{item.label}</span>
                                        <div onClick={() => {
                                            This.radioChange(item.value)
                                        }} className="edit-radio-mask"/>
                                    </div>
                                }
                            })}</td>
                        </tr>
                        {/* 音频 */}
                        <tr>
                            <th valign='top'>上传音频：</th>
                            <td>
                                <UploadFile ref={(ref) => {
                                    this.uploadAudio = ref
                                }} isBtn={false} url={aUrl} fileName={aName} setUrl={(url, name, fileInfo) => this.setState({'aUrl': url, 'aName': name, 'aFileInfo': fileInfo})} title=' 点击上传音频'/>
                            </td>
                        </tr>
                        {/* 视频 */}
                        <tr>
                            <th valign='top'>上传视频：</th>
                            <td>
                                <div>
                                    <UploadFile ref={(ref) => {
                                        this.uploadVideo = ref
                                    }} isBtn={false} url={vUrl} fileName={vName} setUrl={(url, name, fileInfo) => this.setState({'vUrl': url, 'vName': name, 'vFileInfo': fileInfo})} title=' 上传视频'/>
                                </div>
                            </td>
                        </tr>
                        {/* 视频封面 */}
                        {
                            !vUrl ? <tr></tr> : (
                                <tr>
                                    <th><span>*</span>视频PC封面：</th>
                                    <td>
                                        <div className="news-upload-img">
                                            <UploadImg ref={(ref) => {
                                                this.uploadPcImg = ref
                                            }} url={pcUrl} setUrl={(url) => this.setState({'pcUrl': url})}/>
                                            <span>用于 PC 端新闻中视频封面展示, 建议尺寸: 280px * 205px</span>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                        {/* 视频封面 */}
                        {
                            !vUrl ? <tr></tr> : (
                                <tr>
                                    <th><span>*</span>视频M端封面：</th>
                                    <td>
                                        <div className="news-upload-img">
                                            <UploadImg ref={(ref) => {
                                                this.uploadMImg = ref
                                            }} url={mUrl} setUrl={(url) => this.setState({'mUrl': url})}/>
                                            <span>用于 M 端新闻中视频封面展示, 建议尺寸: 280px * 205px</span>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                        <tr>
                            <th><span>*</span>标题：</th>
                            <td><input ref={(ref) => {
                                this.articleTitle = ref
                            }} className="edit-input" type="text" placeholder="请输入标题"/></td>
                        </tr>
                        <tr>
                            <th><span>*</span>摘要：</th>
                            <td><input ref={(ref) => {
                                this.articleSynopsis = ref
                            }} className="edit-input" type="text" placeholder="请输入摘要"/></td>
                        </tr>
                        <tr>
                            <th valign="top"><span>*</span>内容：</th>
                            <td>
                                <PostEditor ref={(ref) => {
                                    this.postEditor = ref
                                }} getContent={this.getContent} content = {!localStorage.getItem('articleInfo') ? null : JSON.parse(localStorage.getItem('articleInfo')).content} />
                            </td>
                        </tr>
                        <tr>
                            <th/>
                            <td>
                                <button className="edit-button" onClick={this.publishArticle}>提交</button>
                                <button className="edit-button clear" onClick={this.clearEditor}>清空</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    }
}
