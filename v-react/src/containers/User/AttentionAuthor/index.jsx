import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
// import Pagination from 'rc-pagination'
import Cookies from 'js-cookie'

import {getFollowlist} from '../../../actions/user'
import {attentionAuthor, cancelAttention} from '../../../actions/authorinfo'

import authorImg from '../img/portrait.png'

import './index.scss'
import 'rc-pagination/assets/index.css'

const mapStateToProps = (state) => {
    return {
        followList: state.followList.list
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({getFollowlist, attentionAuthor, cancelAttention}, dispatch)
})

@connect(mapStateToProps, mapDispatchToProps)
export default class AttentionAuthor extends Component {
    componentDidMount() {
        this.props.actions.getFollowlist({
            passportid: Cookies.get('hx_user_id'),
            token: Cookies.get('hx_user_token')
        })
    }
    attention = (id) => {
        this.props.actions.attentionAuthor({
            passportid: Cookies.get('hx_user_id'),
            token: Cookies.get('hx_user_token'),
            authorId: id
        }, () => {
            this.props.actions.getFollowlist({
                passportid: Cookies.get('hx_user_id'),
                token: Cookies.get('hx_user_token')
            })
        })
    }

    cancel = (id) => {
        this.props.actions.cancelAttention({
            passportid: Cookies.get('hx_user_id'),
            token: Cookies.get('hx_user_token'),
            authorId: id
        }, () => {
            this.props.actions.getFollowlist({
                passportid: Cookies.get('hx_user_id'),
                token: Cookies.get('hx_user_token')
            })
        })
    }
    render() {
        const {followList} = this.props
        return (
            <div className='author-attention'>
                {followList && followList.length !== 0 ? <ul className="author-content">
                    {followList.map((item, index) => {
                        return <li key={index} className="author-item">
                            <img src={item.iconUrl || authorImg} alt="" className="author-head-img" onClick={() => { window.open(`/newsauthor?userId=${item.passportId}`) }}/>
                            <div className="author-info" onClick={() => { window.open(`/newsauthor?userId=${item.passportId}`) }}>
                                <p className="nickname">{item.nickName || '姓名获取失败'}</p>
                                <p className="article-num">文章数量</p>
                                <span className="count">{item.articleCount || 0}</span>
                            </div>
                            {item.ifCollect !== 1 ? <p className="cancel-attention" onClick={() => { this.attention(item.passportId) }}>重新关注</p> : <p className="cancel-attention" onClick={() => { this.cancel(item.passportId) }}>取消关注</p>}
                        </li>
                    })}
                </ul> : <div className='noAttention'>您还没有关注的作者</div>
                }
                {/*
                <div className="pagination">
                    <Pagination
                        total={0} current={1} pageSize={20}
                    />
                </div>
                */}
            </div>
        )
    }
}
