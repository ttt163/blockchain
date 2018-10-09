/**
 * Author：liushaozong
 * Time：2018/02/21
 * Description：news
 */
import React, {Component} from 'react'
import {injectIntl} from 'react-intl'
import {Link} from 'react-router'

// import Pagination from 'rc-pagination'

import './index.scss'
// import attentionTitle from '../img/authorTitleImg.png'
// import searchImg from '../img/search.png'
// import attentionCancel from '../img/attention-cancel.png'

@injectIntl
class MyAttention extends Component {
    componentDidMount() {
        // $(window).scrollTop('0')
    }

    render() {
        const tabArr = [{
            path: '/userMyAttentionProject',
            desc: '关注的项目'
        }, {
            path: '/userMyAttentionAuthor',
            desc: '关注的作者'
        }]
        const {pathname} = this.props.location
        return <div className="my-attention">
            <div className="attention-head clearfixed">
                {/* <div className="project-title">
                    <img src={attentionTitle} alt=""/>
                    <FormattedMessage id="attention.author"/>
                    <span className="num">(123 个) </span>
                </div>
                <div className="search-content">
                    <input type="text" placeholder="输入作者名称"/>
                    <img src={searchImg} alt=""/>
                </div> */}
                <ul>
                    {
                        tabArr.map((d, i) => {
                            return (
                                <Link
                                    key={i}
                                    className={pathname === d.path || (pathname === '/userMyAttention' && i === 0) ? 'active' : ''}
                                    to={d.path}
                                >
                                    {d.desc}
                                </Link>
                            )
                        })
                    }
                </ul>
            </div>
            {
                this.props.children
            }
        </div>
    }
}

export default (MyAttention)
