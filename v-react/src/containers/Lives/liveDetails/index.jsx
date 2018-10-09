/**
 * Author：liushaozong
 * Time：2018/02/27
 * Description：search
 */
import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import Cookies from 'js-cookie'

import {timestampToTime} from '../../../public/index'
import {getPastList} from '../../../actions/live'

import './index.scss'
import titleImg from '../img/introduce.png'
import rr from '../img/r-r.png'
import guest from '../img/guest-title.png'
import wfewm from '../img/wf-ewm.png'
import liveState01 from '../img/live-start.png'
import liveState02 from '../img/live-in.png'
import liveState03 from '../img/live-over.png'
@injectIntl
class LivesDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            liveList: [],
            hintState: '',
            room: {
                guest: {
                    description: '',
                    headUrl: '',
                    userName: ''
                },
                presenter: {
                    description: '',
                    headUrl: '',
                    userName: ''
                },
                webcast: {
                    wbackImage: '',
                    beginTime: '',
                    coverPic: '',
                    desc: '',
                    guestId: '',
                    presenterId: '',
                    status: '',
                    title: '',
                    updateIime: ''
                }
            },
            over: true
        }
    }

    liveListState(state) {
        if (state === 0) {
            return <span><img src={liveState01} alt=""/></span>
        } else if (state === 1) {
            return <span><img src={liveState02} alt=""/></span>
        } else if (state === 2) {
            return <span><img src={liveState03} alt=""/></span>
        }
    }

    componentWillMount() {
        this.props.actions.getPastList({
            castId: this.props.location.query.castId
        })
        this.setState({hintState: Cookies.get('status')})
        let listStatus = this.props.location.query.status
        if (listStatus === '0' || listStatus === '1') {
            let This = this
            let websocket = null
            // 判断当前浏览器是否支持WebSocket
            if ('WebSocket' in window) {
                websocket = new WebSocket('ws://www.huoxing24.com/push/websocket/text')
            } else {
                alert('当前浏览器 Not support websocket')
            }
            // 连接发生错误的回调方法
            websocket.onerror = () => {
                console.log('WebSocket连接发生错误')
            }
            // 连接成功建立的回调方法
            websocket.onopen = () => {
                console.log('WebSocket连接成功')
                websocket.send(`{'type': 0, 'castId': ${this.props.location.query.castId}}`)
            }
            // 接收到消息的回调方法
            websocket.onmessage = function (event) {
                // setMessageInnerHTML(event.data)
                let dataArr = JSON.parse(event.data)
                if (dataArr.type === 0) {
                    This.setState({liveList: dataArr.data.contentList})
                    This.setState({room: dataArr.data.room})
                } else if (dataArr.type === 1) {
                    let dataCont = dataArr.data.content
                    let dataUser = dataArr.data.user
                    let addList = [{
                        content: {
                            castId: dataCont.castId,
                            content: dataCont.content,
                            contentId: dataCont.contentId,
                            createTime: dataCont.createTime,
                            userId: dataCont.userId
                        },
                        user: {
                            createTime: dataUser.createTime,
                            description: dataUser.description,
                            headUrl: dataUser.headUrl,
                            userName: dataUser.userName,
                            userType: dataUser.userType,
                            userId: dataUser.userType
                        }
                    }]

                    This.setState({liveList: addList.concat(This.state.liveList)})
                } else if (dataArr.type === 2) {
                    This.state.liveList.map((item, index) => {
                        if (item.content.contentId === dataArr.data.contentId) {
                            This.state.liveList.splice(index, 1)
                            This.setState({liveList: This.state.liveList})
                        }
                    })
                } else if (dataArr.type === 3) {
                    let list = This.state.liveList
                    This.state.liveList.map((item, index) => {
                        if (item.content.contentId === dataArr.data.contentId) {
                            list[index].content.content = dataArr.data.content
                            This.setState({liveList: list})
                        }
                    })
                } else if (dataArr.type === 4) {
                    Cookies.set('status', 4)
                    This.setState({over: false})
                    This.setState({hintState: Cookies.get('status')})
                } else if (dataArr.type === 5) {
                    Cookies.set('status', 5)
                    This.setState({hintState: Cookies.get('status')})
                }
                if (This.state.liveList.length === 0) {
                    $('.not-message').show()
                } else {
                    $('.not-message').hide()
                }
            }
            this.setState({hintState: Cookies.get('status')})
            // 连接关闭的回调方法
            websocket.onclose = () => {
                console.log('WebSocket连接关闭')
            }
            // 关闭WebSocket连接
            const closeWebSocket = () => {
                websocket.close()
            }
            // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
            window.onbeforeunload = () => {
                closeWebSocket()
            }
        }
    }

    componentDidMount() {
    }

    render() {
        const {pastListR} = this.props
        let cookStatus = Cookies.get('status')
        return <div className="live-details clearfix">
            <div className="introduce-box">
                <h5><img src={titleImg} alt=""/></h5>
                <div className="introduce-text">
                    <p>{cookStatus === '2' || cookStatus === '4' ? pastListR.data.room.webcast.desc : this.state.room.webcast.desc}</p>
                </div>
                <div className="live-ewm">
                    <p className="wx-01">加入微信群<span><img src={wfewm} alt=""/><font></font></span></p>
                    <p className="live-mob">手机看直播<span><img src={wfewm} alt=""/><font></font></span></p>
                </div>
            </div>
            <div className="live-cont-left clearfix">
                <div className={`live-state state${this.state.hintState}`}></div>
                <div className="live-tab-box clearfix">
                    {
                        ((cookStatus === '4' && this.state.over) || cookStatus === '2') ? pastListR.data.contentList.map((item, index) => {
                            let time = timestampToTime(item.content.createTime)
                            return (
                                <div className="live-cont clearfix" key={index} data-id={item.content.contentId}>
                                    <div className="live-portrait"><img src={item.user.headUrl} alt=""/></div>
                                    <div className="live-right-cont">
                                        <div className="live-cont-top">
                                            <p className="name">{item.user.userName}</p>
                                            <p className="time">{time}</p>
                                        </div>
                                        <div className="rr"><img src={rr} alt=""/></div>
                                        <div className="live-cont-text" dangerouslySetInnerHTML={{__html: item.content.content}}>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : (this.state.liveList.length === 0) ? <div className="no-cont">暂无直播内容...</div> : this.state.liveList.map((item, index) => {
                            let time = timestampToTime(item.content.createTime)
                            return (
                                <div className="live-cont clearfix" key={index} data-id={item.content.contentId}>
                                    <div className="live-portrait"><img src={item.user.headUrl} alt=""/></div>
                                    <div className="live-right-cont">
                                        <div className="live-cont-top">
                                            <p className="name">{item.user.userName}</p>
                                            <p className="time">{time}</p>
                                        </div>
                                        <div className="rr"><img src={rr} alt=""/></div>
                                        <div className="live-cont-text" dangerouslySetInnerHTML={{__html: item.content.content}}>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="live-cont-right">
                <div className="guest-title"><img src={guest} alt=""/></div>
                <div className="figure">
                    <div className="portrait"><img src={cookStatus === '2' || cookStatus === '4' ? pastListR.data.room.guest.headUrl : this.state.room.guest.headUrl} alt=""/></div>
                    <div className="name">
                        <h5>{cookStatus === '2' || cookStatus === '4' ? pastListR.data.room.guest.userName : this.state.room.guest.userName}</h5>
                        <p>{cookStatus === '2' || cookStatus === '4' ? pastListR.data.room.guest.description : this.state.room.guest.description}</p>
                    </div>
                </div>
                <div className="wf-ewm">
                    <p className="title1">查看往期内容</p>
                    <img src={wfewm} alt=""/>
                    <p className="title2">扫描关注王峰十问</p>
                </div>
            </div>
        </div>
    }
}
const mapStateToProps = (state) => {
    return {
        pastListR: state.pastList
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getPastList}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(LivesDetails))
