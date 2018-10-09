import React, {Component} from 'react'
import moment from 'moment'

import './index.scss'

export default class UserArticle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: 'none'
        }
    }
    showReason(article) {
        if (article.status === 2) {
            this.setState({
                show: 'block'
            })
        }
    }
    hideReason(article) {
        if (article.status === 2) {
            this.setState({
                show: 'none'
            })
        }
    }
    render() {
        const {modalname} = this.props
        const {coverPic, title, synopsis, publishTime, tags, iconUrl, author, id, passportId, status, nopassReason} = this.props.article
        const tagsArr = tags && tags.length > 0 ? tags.split(',') : []
        const img = coverPic ? JSON.parse(coverPic).pc : require('../../../containers/User/img/articleImg.png')
        let t = publishTime ? moment(publishTime, 'x').fromNow() : ''
        let time = publishTime ? moment(publishTime, 'x').format('YYYY-MM-DD') : ''
        // let userId = modalname === 'myArticle' ? Cookies.get('hx_user_id') : passportId
        if (/second/.test(t)) {
            time = '刚刚'
        } else if (/minute/.test(t)) {
            time = t.split(' ')[0].replace('a', 1) + '分钟前'
        } else if (/hour/.test(t)) {
            time = t.split(' ')[0].replace('a', 1) + '小时前'
        }
        return <div className='user-article'>
            <a href={`/newsdetail?id=${id}`} target='_blank' className="title"><img src={img}/></a>
            <div className="right-panel">
                <a href={`/newsdetail?id=${id}`} target='_blank' className={`title ${modalname === 'userMyArticle' && (status === 2 || status === 0) ? 'spe' : ''}`}>{title}</a>
                {(() => {
                    if (modalname === 'userMyArticle') {
                        if (status === 2) {
                            return <div className="statusDiv" onMouseOver={() => { this.showReason(this.props.article) }} onMouseOut={() => { this.hideReason(this.props.article) }}>
                                <span className="statusType notPass">
                                    审核未通过
                                </span>
                                <p className="reason" style={{display: `${this.state.show}`}}>原因：{nopassReason.trim() === '' ? '未填写' : nopassReason}</p>
                            </div>
                        } else if (status === 0) {
                            return <div className="statusDiv">
                                <span className="statusType checking">审核中</span>
                            </div>
                        } else if (status === -1) {
                            return <div className="statusDiv">
                                <span className="statusType hadDel">文章已被删除</span>
                            </div>
                        }
                    }
                })()}
                <div className="desc">{synopsis}</div>
                <div className="bottom">
                    {
                        modalname === 'userMyArticle' ? <div className="labels">
                            {
                                tagsArr.length > 0 && tagsArr.map((d, i) => {
                                    return (
                                        <div key={i} className='label'>{d}</div>
                                    )
                                })
                            }
                        </div> : <div className='userinfo' onClick={() => { window.open(`/newsauthor?userId=${passportId}`) }}>
                            <img src={iconUrl || require('../../../containers/User/img/articleImg.png')}/>
                            <span>{author}</span>
                        </div>
                    }
                    <div className={`time ${modalname === 'userMyCollection' ? 'myCollect' : ''}`}>{time}</div>
                </div>
            </div>
        </div>
    }
}
