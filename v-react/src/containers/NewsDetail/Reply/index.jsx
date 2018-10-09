/**
 * Author：liushaozong
 * Time：2018/01/23
 * Description：news
 */
import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import Cookies from 'js-cookie'
import './index.scss'
import ReplayNews from '../ReplayNews'

// import headImg from '../img/head-img.png'
import {getNewsConments, commentedNews} from '../../../actions/newsComments'
import {getTime} from '../../../public/index'
import {showLogin} from '../../../actions/loginInfo'
import '../../../../node_modules/layui-layer/dist/layer.js'

const mapStateToProps = (state) => {
    return {
        newsComments: state.newsComments,
        loginInfo: state.loginInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getNewsConments, showLogin, commentedNews}, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
export default class Reply extends Component {
    state = {
        page: 1
    }

    componentDidMount() {
        this.props.actions.getNewsConments(this.props.articleId, 1, 5)
    }

    checkMoreReplay = () => {
        let page = this.state.page + 1
        if (page === (this.props.newsComments.pageCount + 1)) {
            layer.msg('暂无更多评论 !')
            return false
        }
        this.setState({
            page: page
        }, () => {
            this.props.actions.getNewsConments(this.props.articleId, this.state.page, 5, 'checkMore')
        })
    }

    commentNews = () => {
        const This = this
        const content = $.trim(this.commentNewsReplay.value)
        if (this.props.newsComments.recordCount <= 5) {
            this.setState({
                page: 1
            })
        }
        if (content === '') {
            layer.msg('请输入评论内容!')
        } else if (content.length > 120) {
            layer.msg('不能大于120个字符!')
        } else {
            this.props.actions.commentedNews(this.props.articleId, content, function () {
                This.props.actions.getNewsConments(This.props.articleId, 1, 5)
                This.commentNewsReplay.value = ''
            })
        }
    }

    ifLogin = () => {
        const {loginInfo} = this.props
        const token = Cookies.get('hx_user_token')
        if (loginInfo.passportId === '') {
            if (token === undefined || token === 'undefined' || token === '') {
                return false
            } else {
                return true
            }
        } else {
            return true
        }
    }

    render() {
        const This = this
        const {intl, newsComments, actions} = this.props
        const justNow = intl.formatMessage({id: 'time.justNow'})
        const minuteAgo = intl.formatMessage({id: 'time.minuteAgo'})
        const hourAgo = intl.formatMessage({id: 'time.hourAgo'})
        const nickUrl = Cookies.get('hx_user_url')
        return <div className="reply-module">
            <div
                className="prompt-not-login"
                style={{display: !This.ifLogin() ? 'block' : 'none'}}>
                <p>请先 <span className="reply-login-button" onClick={() => {
                    actions.showLogin('login')
                }}>登陆</span> 再评论</p>
            </div>
            <div className="reply-section">
                <p className="reply-title">评论（{newsComments.recordCount}条）</p>
                <ul className="reply-content">
                    {newsComments.inforList.map(function (item, index) {
                        const commentTime = getTime(item.comment.createTime, newsComments.currentTime, justNow, minuteAgo, hourAgo)
                        return <ReplayNews
                            key={index}
                            item={item}
                            commentTime={commentTime}
                            articleId={This.props.articleId}/>
                    })}
                </ul>
                {newsComments.recordCount < 5 ? '' : <p className='all-reply-btn' onClick={this.checkMoreReplay}>查看更多评论</p>}
            </div>
            <div
                className="prompt-has-login"
                style={{display: This.ifLogin() ? 'block' : 'none'}}>
                <img src={nickUrl} alt=""/>
                <div className="reply-editor">
                    <div className="editor">
                        <textarea ref={(ref) => {
                            this.commentNewsReplay = ref
                        }}/>
                    </div>
                </div>
                <p className="submit-btn">
                    <span onClick={this.commentNews}>评论</span>
                </p>
            </div>
        </div>
    }
}
