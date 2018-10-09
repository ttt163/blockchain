/**
 * Author：tantingting
 * Time：2017/9/21
 * Description：Description
 */
import React, {Component} from 'react'

import Simditor from 'simditor'
import '../../../../node_modules/simditor/styles/simditor.css'

import LargedefaultImg from './img/default-large.png'
import './index.scss'
import {URL} from '../../../public/index'

const EDITTOOLBAR = [
    'title',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'fontScale',
    'color',
    'ol',
    'ul',
    'blockquote',
    'code',
    'table',
    'link',
    'image',
    'hr',
    'indent',
    'outdent',
    'alignment'
]
let editor = ''

export default class PostEditor extends Component {
    state = {
        postContent: ''
    }

    componentDidMount() {
        editor = new Simditor({
            textarea: $('.editor'),
            defaultImage: LargedefaultImg,
            placeholder: '这里输入新闻内容...',
            toolbar: EDITTOOLBAR,
            upload: {
                // url: '/pic/upload', // 文件上传的接口地址
                url: `${URL}/pic/upload`, // 文件上传的接口地址
                params: null, // 键值对,指定文件上传接口的额外参数,上传的时候随文件一起提交
                fileKey: 'uploadFile', // 服务器端获取文件数据的参数名
                connectionCount: 3,
                leaveConfirm: '正在上传文件',
                success: function (result) {
                    let msg = ''
                    let imgPath = ''
                    if (result.code !== 1) {
                        msg = result.msg || this._t('uploadFailed')
                        imgPath = this.defaultImage
                    } else {
                        imgPath = result.obj
                    }
                    console.log(msg)
                    return imgPath
                }
            }
        })
        // console.log(this.props)

        editor.setValue(!this.props.content ? '' : this.props.content)
        this.setState({'postContent': this.props.content}, function () {
            this.props.getContent(this.props.content)
        })

        editor.on('valuechanged ', (e) => {
            const This = this
            this.setState({'postContent': editor.getValue()}, function () {
                This.props.getContent(this.state.postContent)
            })
        })
    }

    // 清空
    clearContent() {
        editor.setValue('')
        this.setState({
            postContent: ''
        })
    }

    render() {
        return <div className="editor-post-content">
            <textarea className="editor" defaultValue=""/>
            <div className="btns">
                {/* <button className="mr10" onClick={this.clearContent}>清空</button> */}
            </div>
        </div>
    }
}
