/**
 * Author：liushaozong
 * Time：2018-01-21 21:34
 * Description：index news right - author
 */

import React, {Component} from 'react'
import {Link} from 'react-router'
import {array} from 'prop-types'
import {injectIntl} from 'react-intl'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Cookie from 'js-cookie'

import {getAuthorInfo, attentionAuthor, cancelAttention, getIndexAuthorList} from '../../../../actions/authorinfo'
import {showLogin} from '../../../../actions/loginInfo'

import './index.scss'
/*
const authorData = [
    {
        name: '何玺',
        img: 'http://static.huoxing24.com/usericon/11eea0ad0029487583bbab785fe0efe2/portrait/1520995013333712.png',
        follow: 443,
        contentTitle: '周小川数字货币讲话研读：区块链创业者要注意，这些红线不要踩',
        url: 'http://www.huoxing24.com/#/newsdetail/2018031015352869477?id=fff9d400cb94444fadaefd429516c276',
        id: '11eea0ad0029487583bbab785fe0efe2'
    },
    {
        name: '黄福瑞',
        img: 'http://static.huoxing24.com/usericon/440c3faaf29d4da8b0c7e921a01405a6/portrait/1520995013333456.png',
        follow: 570,
        contentTitle: '火星专栏 | 区块链产业望远镜 （一）: 加密货币矿场与矿工的时代新角色',
        url: 'http://www.huoxing24.com/#/newsdetail/2018031913311526786?id=fff9d400cb94444fadaefd429516c276',
        id: '440c3faaf29d4da8b0c7e921a01405a6'
    },
    {
        name: '陈琳-琳说',
        img: 'http://static.huoxing24.com/usericon/44aa6ee3da88416aa921a91606c28f40/portrait/1521447152636506.png',
        follow: 720,
        contentTitle: '从生命权和财产权谈到加密货币',
        url: 'http://www.huoxing24.com/#/newsdetail/2018031921300348685?id=fff9d400cb94444fadaefd429516c276',
        id: '44aa6ee3da88416aa921a91606c28f40'
    },
    {
        name: '刘昌用',
        img: 'http://static.huoxing24.com/usericon/879cc8863bdc4f888d436abe37c95978/portrait/1521449180040323.png',
        follow: 416,
        contentTitle: '刘昌用：区块链发展将经历六个阶段',
        url: 'http://www.huoxing24.com/#/newsdetail/2018031920560996848?id=fff9d400cb94444fadaefd429516c276',
        id: '879cc8863bdc4f888d436abe37c95978'},
    {
        name: '克里斯李',
        img: 'http://static.huoxing24.com/usericon/93b01565e0844ddab7750563654beeca/portrait/1520128899317298.png',
        follow: 390,
        contentTitle: '火星专栏 | 关于比特币泡沫你需要知道的事',
        url: 'http://www.huoxing24.com/#/newsdetail/2018031512322545556?id=fff9d400cb94444fadaefd429516c276',
        id: '93b01565e0844ddab7750563654beeca'
    },
    {
        name: '币学者',
        img: 'http://static.huoxing24.com/images/2018/03/20/1521477931204258.jpg',
        follow: 780,
        contentTitle: '火星专栏 | 区块链技术的现实入口 效率和安全不是其发展的全部理由',
        url: 'http://www.huoxing24.com/#/newsdetail/2018031820201121378?id=fff9d400cb94444fadaefd429516c276',
        id: 'bf9ca51178d14c00ba3bcfee0b4891e8'
    },
    {
        name: '方军',
        img: 'http://static.huoxing24.com/usericon/d329fdfb4ce0464e971b23bf7840ea3b/portrait/1390311740213302.png',
        follow: 660,
        contentTitle: '方军谈区块链之五：99.99%的区块链项目都将失败',
        url: 'http://www.huoxing24.com/#/newsdetail/2018031413123168197?id=fff9d400cb94444fadaefd429516c276',
        id: 'd329fdfb4ce0464e971b23bf7840ea3b'
    },
    {
        name: '孙霄汉',
        img: 'http://static.huoxing24.com/usericon/fb76c2ee74ca4143a4ea09b7f191f34d/portrait/1521447775766968.png',
        follow: 657,
        contentTitle: '火星专栏 | 孙霄汉：传统投资人的焦虑与治愈',
        url: 'http://www.huoxing24.com/#/newsdetail/2018031117524159143?id=fff9d400cb94444fadaefd429516c276',
        id: 'fb76c2ee74ca4143a4ea09b7f191f34d'
    }
]
*/
const mapStateToProps = (state) => {
    return {
        authorInfo: state.authorInfo,
        loginInfo: state.loginInfo,
        authorList: state.indexAuthorList.listInfo.inforList
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({getAuthorInfo, attentionAuthor, cancelAttention, showLogin, getIndexAuthorList}, dispatch)
})

@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class NewsAuthor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            authorArr: []
        }
    }

    componentWillMount() {
        this.handleList()
    }

    handleList() {
        this.props.actions.getIndexAuthorList({
            currentPage: 1,
            pageSize: 50,
            myPassportId: Cookie.get('hx_user_id')
        })
    }

    attention = (item) => {
        if (Cookie.get('hx_user_token') !== undefined) {
            this.props.actions.attentionAuthor({
                passportid: Cookie.get('hx_user_id'),
                token: Cookie.get('hx_user_token'),
                authorId: item
            }, () => {
                this.handleList()
            })
        } else {
            this.props.actions.showLogin('login')
        }
    }

    cancelAttention = (item) => {
        this.props.actions.cancelAttention({
            passportid: Cookie.get('hx_user_id'),
            token: Cookie.get('hx_user_token'),
            authorId: item
        }, () => {
            this.handleList()
        })
    }

    render() {
        const {authorList} = this.props
        return <div className="news-author clearfix">
            {authorList ? <div className="box-author clearfix">
                <p className="title">
                    {this.props.intl.formatMessage({id: 'title.columnAuthor'})}
                </p>
                {authorList.map((item, index) => {
                    return <div className="list-author" key={index}>
                        <div className="portrait-img">
                            <Link to={`/newsauthor?userId=${item.passportId}`} target="_blank">
                                <img src={item.iconUrl} alt=""/>
                                {(() => {
                                    if (parseInt(item.vGrade) === 0) {
                                        return <span className="v-ordinary"></span>
                                    } else if (parseInt(item.vGrade) === 1) {
                                        return <span className="v-personal"></span>
                                    } else if (parseInt(item.vGrade) === 2) {
                                        return <span className="v-enterprise"></span>
                                    }
                                })()}
                            </Link>
                            <div className="name-follower">
                                <Link to={`/newsauthor?userId=${item.passportId}`} target="_blank" className="author-call" title={item.nickName}>{item.nickName}</Link>
                                <p className="crowd">粉丝：<span>{item.followCount}</span></p>
                            </div>
                        </div>
                        {item.news && <Link to={`/newsdetail?id=${item.news.id}`} target="_blank" className="article-title">{item.news.title}</Link>}
                        {(() => {
                            if (item.passportId === Cookie.get('hx_user_id')) {
                                return <div className="owner">
                                    <span>关注</span>
                                </div>
                            } else {
                                if (item.ifCollect === 1) {
                                    return <div className="cancel-attention" onClick={() => { this.cancelAttention(item.passportId) }}>
                                        <span>已关注</span>
                                    </div>
                                } else {
                                    return <div className="attention" onClick={() => { this.attention(item.passportId) }}>
                                        <span>+ 关注</span>
                                    </div>
                                }
                            }
                        })()}
                    </div>
                })}
            </div> : <div className="box-author clearfix"/>}
        </div>
    }
}

NewsAuthor.defaultProps = {
    authorData: []
}

NewsAuthor.propTypes = {
    authorData: array.isRequired
}

export default NewsAuthor
