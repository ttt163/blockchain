/**
 * Author：liushaozong
 * Time：2018/02/21
 * Description：news
 */
import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Cropper from 'react-cropper'
// import {Link} from 'react-router'
import {FormattedMessage, injectIntl} from 'react-intl'
// import {Link} from 'react-router'
import Cookies from 'js-cookie'

import {updateImg, uploadImg, updateNickName, changeIntro} from '../../../actions/user'
import {setLoginInfo} from '../../../actions/loginInfo'
import {dataURLtoBlob} from '../../../public/'

// import './index.scss'
import './hxh.scss'
import 'rc-pagination/assets/index.css'
import 'cropperjs/dist/cropper.css'
import articleTitleImg from '../img/articleTitleImg.png'
import infoImg from '../img/portrait.png'

const mapStateToProps = (state) => {
    return {
        updateInfo: state.reducerUser.updateInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({uploadImg, updateImg, updateNickName, changeIntro, setLoginInfo}, dispatch)
    }
}

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class MyInformation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            src: infoImg,
            choiceImg: false,
            cropResult: null,
            nickNamestatus: 'span',
            nickVal: Cookies.get('hx_user_nickname'),
            phoneVal: Cookies.get('hx_user_phone'),
            intro: Cookies.get('hx_user_intro'),
            strlen: 100 - Cookies.get('hx_user_intro').length
        }
    }

    componentDidMount() {
        // $(window).scrollTop('0')
    }

    // 图片更新
    imgOnChange = (e) => {
        e.preventDefault()
        let files
        if (e.dataTransfer) {
            files = e.dataTransfer.files
        } else if (e.target) {
            files = e.target.files
        }
        const reader = new FileReader()
        reader.onload = () => {
            this.setState({src: reader.result})
        }
        reader.readAsDataURL(files[0])
        this.setState({
            choiceImg: true
        })
    }

    cropImage = () => {
        if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
            return
        }
        let form = {
            type: 'user',
            data: JSON.stringify({
                passportid: Cookies.get('hx_user_id'),
                token: Cookies.get('hx_user_token')
            })
        }
        let formData = new FormData()
        for (let key in form) {
            formData.append(key, form[key])
        }
        let imgBlob = dataURLtoBlob(this.cropper.getCroppedCanvas().toDataURL())
        formData.append('uploadFile', imgBlob, `hx_user_${Date.parse(new Date())}.${imgBlob.type.split('/')[1]}`)
        // console.log(formData)
        this.props.actions.uploadImg(formData)
        this.setState({
            choiceImg: false,
            cropResult: this.cropper.getCroppedCanvas().toDataURL()
        })
    }

    // 更改昵称
    changeNickName = () => {
        this.setState({
            nickNamestatus: 'input'
        })
    }

    // 更改简介
    changeIntro() {
        const {actions} = this.props
        const {introVal} = this.state
        actions.changeIntro({
            introduce: introVal,
            passportid: Cookies.get('hx_user_id'),
            token: Cookies.get('hx_user_token')
        })
    }

    changeNickVal = (e) => {
        switch (e.target.id) {
            case 'intro':
                this.setState({
                    introVal: e.target.value,
                    strlen: 100 - e.target.value.length
                })
                break
            case 'nickname':
                this.setState({
                    nickVal: e.target.value
                })
                break
            case 'phone':
                this.setState({
                    phoneVal: e.target.value
                })
                break
            default:
                break
        }
    }

    // 确认更改
    confirmNickName = () => {
        const {setLoginInfo, updateNickName} = this.props.actions
        if (!this.state.nickVal.match(/^[\u4E00-\u9FA5a-zA-Z0-9_]{1,16}$/)) {
            layer.msg('输入的昵称含有非法字符，16个字符以内，并且只能由字母、数字与文字组成')
        } else {
            this.setState({
                nickNamestatus: 'span'
            })
            updateNickName({
                passportid: Cookies.get('hx_user_id'),
                token: Cookies.get('hx_user_token'),
                nickName: this.state.nickVal
            }, (data) => {
                if (data.code === 1) {
                    Cookies.set('hx_user_nickname', this.state.nickVal)
                    setLoginInfo({nickName: this.state.nickVal})
                    // window.location.reload()
                } else {
                    layer.msg(data.msg)
                }
            })
        }
    }

    render() {
        const {src, choiceImg, cropResult, nickVal, strlen} = this.state
        const {obj} = this.props.updateInfo
        return <div className="attention-info">
            <div className="attention-info-title"><img src={articleTitleImg} alt=""/><FormattedMessage
                id="attention.myInfo"/></div>
            <div className="info-pagination">
                <div className="info-img">
                    <img
                        src={!cropResult ? (!Cookies.get('hx_user_url') ? infoImg : Cookies.get('hx_user_url')) : obj}
                        alt=""/>
                    {choiceImg && <div className="img-preview"/>}
                </div>
                {choiceImg && <Cropper
                    ref={cropper => {
                        this.cropper = cropper
                    }}
                    src={src}
                    preview=".img-preview"
                    style={{height: 200, width: 300, margin: '0 auto 20px'}}
                    aspectRatio={1}
                    dragMode='move'
                    guides={true}/>}
                {!choiceImg ? <div className="btns">
                    <input type="file" onChange={this.imgOnChange} className="hidden-input" />
                    <div className="info-btn">
                        <FormattedMessage id="user.portrait.btn"/>
                    </div>
                </div> : <div className="btns">
                    <div className="info-btn" onClick={this.cropImage}>
                        <FormattedMessage id="user.portrait.confirmBtn"/>
                    </div>
                </div>}
                <div className="info-introduce">
                    <p>1.上传图片大小不超过2MB</p>
                    <p>2.如果要展示完整头像，可上传宽高尺寸为1:1的图片</p>
                </div>
            </div>
            <div className="info-list">
                {/* {
                    nickNamestatus === 'span' ? <p>
                        <FormattedMessage id="user.name"/>
                        <font className="info-name">{nickVal || '昵称'}</font>
                        <a onClick={this.changeNickName}>
                            <FormattedMessage id="user.info.amend"/>
                        </a>
                    </p> : <p>
                        <FormattedMessage id="user.name"/>
                        <input type="text" className="nick-name-input" onChange={this.changeNickVal} defaultValue={nickVal}/>
                        <a onClick={this.confirmNickName}>
                            <FormattedMessage id="user.portrait.confirmBtn"/>
                        </a>
                    </p>
                } */}
                <p>
                    <FormattedMessage id="user.name"/>
                    <input
                        type="text"
                        className="nick-name-input"
                        id='nickname'
                        onChange={this.changeNickVal}
                        defaultValue={nickVal}
                    />
                    <a onClick={this.confirmNickName}>
                        <FormattedMessage id="user.portrait.confirmBtn"/>
                    </a>
                </p>

                {/* <p>
                    <FormattedMessage id="user.mailbox"/>
                    <font className="info-mailbox">zhuceyouxiang@163.com</font>
                    <Link to="/user/ChangePhoneEml"><FormattedMessage id="user.info.amend"/></Link>
                </p>
                */}

                {
                    Cookies.get('hx_user_phone') ? <p>
                        <FormattedMessage id="user.phone"/>
                        <input
                            type="text"
                            className="nick-name-input disabled"
                            defaultValue={Cookies.get('hx_user_phone')}
                            disabled={true}
                        />
                        <a className="done"><FormattedMessage id='user.info.phone'/></a>
                    </p> : <p>
                        <FormattedMessage id="user.phone"/>
                        <input
                            type="text"
                            className="nick-name-input"
                            id='phone'
                            onChange={this.changeNickVal}
                            placeholder='暂无'
                        />
                        <a ><FormattedMessage id='user.info.nophone'/></a>
                    </p>
                }
                <p className='user_intro'>
                    <FormattedMessage id="user.intro" />
                    {
                        Cookies.get('hx_user_intro') ? <textarea
                            type="text"
                            className="nick-name-input"
                            id='intro'
                            maxLength={100}
                            onChange={this.changeNickVal}
                            defaultValue={Cookies.get('hx_user_intro')}
                        /> : <textarea
                            type="text"
                            className="nick-name-input"
                            id='intro'
                            maxLength={100}
                            onChange={this.changeNickVal}
                            placeholder='请编辑您的个人简介'
                        />
                    }
                    <i>{strlen}/100</i>
                </p>
                <a className='user_intro' onClick={() => { this.changeIntro() }}>
                    <FormattedMessage id="user.portrait.confirm"/>
                </a>
            </div>
            <div className="bind-phone-modal">
                <div className="modal-bg"></div>
                <div className="modal-content">
                    <img src={require('../img/modal-close.png')} className="close"/>
                    <div className="modal-title">绑定手机号</div>
                    <p className="error">
                        <img src={require('../img/error.png')} className="error-icon"/>
                        <span>请输入正确的手机号</span>
                    </p>
                    <div className="input-wrap">
                        <img src={require('../img/bind-phone-before.png')} className="icon"/>
                        <input type="text" placeholder='请输入手机号码'/>
                    </div>
                    <div className="input-wrap">
                        <img src={require('../img/bind-phone-verb-before.png')} className="icon"/>
                        <input type="text" placeholder='请输入验证码'/>
                        <div className="btn">获取验证码</div>
                    </div>
                    <div className="submit">绑定</div>
                </div>
            </div>
        </div>
    }
}
