/**
 * Author：zhoushuanglong
 * Time：2018-02-27 22:08
 * Description：replay news
 */

import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import '../../../../node_modules/layui-layer/dist/layer.js'

import ReplayFloor from '../ReplayFloor'
import {conmentReplay, delCommentReplay, getNewsConments} from '../../../actions/newsComments'

const mapStateToProps = (state) => {
    return {
        newsComments: state.newsComments
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({conmentReplay, delCommentReplay, getNewsConments}, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ReplayNews extends Component {
    state = {
        show: false
    }

    replayShow = () => {
        this.setState({
            show: !this.state.show
        })
    }

    replayComment = () => {
        const This = this
        const content = $.trim(this.commentReplay.value)

        if (content === '') {
            layer.msg('请输入评论内容!')
        } else if (content.length > 120) {
            layer.msg('不能大于120个字符!')
        } else {
            this.props.actions.conmentReplay(this.props.articleId, this.props.item.comment.id, content, function () {
                This.commentReplay.value = ''
            })
        }
    }

    render() {
        const This = this
        const {item, commentTime} = this.props
        const userId = Cookies.get('hx_user_id')
        return <li className="reply-item">
            <p className="head-img">
                <img src={item.comment.userIcon} alt=""/>
            </p>
            <div className="reply-detail">
                <p className="reply-author">{item.comment.userNickName}</p>
                <p className="reply-words">{item.comment.content}</p>
            </div>
            <div className="reply-info">
                <span className="reply-date">{commentTime}</span>
                <p className="reply-info-item">
                    <span onClick={this.replayShow}><i className="iconfont">&#xe691;</i>回复</span>
                    <span
                        style={{display: userId === item.comment.userId ? 'inline-block' : 'none'}}
                        className="comment-del-btn"
                        onClick={() => {
                            this.props.actions.delCommentReplay(item.comment.id, function () {
                                This.props.actions.getNewsConments(This.props.articleId, 1, 5)
                            })
                        }}>删除</span>
                    {/* <span><i className="iconfont">&#xe681;</i>赞</span> */}
                </p>
            </div>
            <div className="reply-editor-section" style={{display: this.state.show ? 'block' : 'none'}}>
                <div className="reply-editor">
                    <div className="editor"><textarea ref={(ref) => {
                        this.commentReplay = ref
                    }}/></div>
                </div>
                <div className="reply-editor-btns">
                    <div className="reply-btn reply-btn-submit disabled" onClick={this.replayComment}>回复</div>
                    <div className="reply-btn reply-btn-cancel" onClick={this.replayShow}>取消</div>
                </div>
            </div>
            <ReplayFloor
                data={item.replies}
                articleId={This.props.articleId}
                userId={item.comment.userId}/>
        </li>
    }
}
