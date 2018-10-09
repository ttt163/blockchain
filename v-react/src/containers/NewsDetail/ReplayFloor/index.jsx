/**
 * Author：zhoushuanglong
 * Time：2018-02-27 21:44
 * Description：replay floor
 */

import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'

import {delCommentReplay, getNewsConments} from '../../../actions/newsComments'

const mapStateToProps = (state) => {
    return {
        newsComments: state.newsComments
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({delCommentReplay, getNewsConments}, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ReplayFloor extends Component {
    state = {
        showAll: false
    }

    checkAll = () => {
        this.setState({
            showAll: true
        })
    }

    checkPart = () => {
        this.setState({
            showAll: false
        })
    }

    replayList = (type) => {
        const This = this

        if (type === 'all') {
            return this.props.data.map(function (item, index) {
                if (item.userNickName !== 'Loading') {
                    return This.itemReplay(item, index)
                }
            })
        } else {
            return this.props.data.map(function (item, index) {
                if (item.userNickName !== 'Loading' && index <= 2) {
                    return This.itemReplay(item, index)
                }
            })
        }
    }

    itemReplay = (item, index) => {
        const This = this
        const userId = Cookies.get('hx_user_id')
        return <li
            onClick={() => {
                This.props.actions.delCommentReplay(item.id, function () {
                    This.props.actions.getNewsConments(This.props.articleId, 1, 5)
                })
            }}
            className="reply-floor-item"
            key={index}>
            <span
                style={{display: userId === This.props.userId ? 'inline-block' : 'none'}}
                className="comment-del-btn">删除</span>
            <p className="reply-floor-author">{item.userNickName}</p>
            <p className="reply-floor-text">{item.content}</p>
        </li>
    }

    render() {
        return <ul className="reply-floor">
            {this.state.showAll ? this.replayList('all') : this.replayList('three')}
            <p
                className="all-reply-floor"
                style={{display: (this.state.showAll === true || this.props.data.length <= 3) ? 'none' : 'block'}}
                onClick={this.checkAll}>
                <span>查看全部回复</span>
            </p>
            <p
                className="all-reply-floor"
                style={{display: (this.state.showAll === false || this.props.data.length <= 3) ? 'none' : 'block'}}
                onClick={this.checkPart}>
                <span>查看部分回复</span>
            </p>
        </ul>
    }
}
