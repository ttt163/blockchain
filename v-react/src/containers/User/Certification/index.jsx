import React, {Component} from 'react'
// import {number} from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {browserHistory} from 'react-router'
import {injectIntl, FormattedMessage} from 'react-intl'
import {dataURLtoBlob} from '../../../public/'
import Cookies from 'js-cookie'

import './index.scss'

import {certify, getUserInfo, updaterealauth} from '../../../actions/certify'
import {uploadImgCerfy} from '../../../actions/user'
import '../../../../node_modules/layui-layer/dist/layer.js'

const mapStateToProps = (state) => ({
    userInfo: state.loginInfo

})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({certify, uploadImgCerfy, getUserInfo, updaterealauth}, dispatch)
})

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class Certification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            iconFront: '',
            iconBack: '',
            showFront: true,
            showBack: true,
            showFrontLoading: false,
            showBackLoading: false,
            uploadFrontSuccess: 0,
            uploadBackSuccess: 0,
            errMsg1: '',
            errMsg2: '',
            showErrMsg1: false,
            showErrMsg2: false,
            identityName: '',
            identityNum: '',
            accept: false,
            showServer: false
        }
    }

    componentDidMount() {
        // console.log(1)
        this.props.actions.getUserInfo({
            passportids: Cookies.get('hx_user_id')
        })
    }

    imgOnChange = (e) => {
        const This = this
        // const {uploadImgCerfy} = this.props.actions
        let index = e.target.name
        const {uploadImgCerfy} = this.props.actions
        // e.preventDefault()
        let files
        if (e.dataTransfer) {
            files = e.dataTransfer.files
        } else if (e.target) {
            files = e.target.files
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
        const reader = new FileReader()
        reader.onload = (event) => {
            let url = event.currentTarget.result
            let imgBlob = dataURLtoBlob(url)
            formData.append('uploadFile', imgBlob, `hx_user_realauth_${Date.parse(new Date())}.${imgBlob.type.split('/')[1]}`)
            index.toString() === '0' ? This.setState({
                iconFront: url,
                showFront: false,
                showFrontLoading: true,
                uploadFrontSuccess: 0
            }, () => {
                uploadImgCerfy(formData, (data) => {
                    if (data.code === 1) {
                        This.setState({
                            uploadFrontSuccess: 1
                        })
                        setTimeout(() => {
                            This.setState({
                                showFrontLoading: false,
                                iconFront: data.obj
                            })
                        }, 500)
                    } else {
                        This.setState({
                            showFront: true,
                            uploadFrontSuccess: -1
                        })
                    }
                })
            }) : This.setState({
                iconBack: url,
                showBack: false,
                showBackLoading: true,
                uploadBackSuccess: 0
            }, () => {
                uploadImgCerfy(formData, (data) => {
                    if (data.code === 1) {
                        This.setState({
                            uploadBackSuccess: 1
                        })
                        setTimeout(() => {
                            This.setState({
                                showBackLoading: false,
                                iconBack: data.obj
                            })
                        }, 500)
                    } else {
                        This.setState({
                            uploadBackSuccess: -1
                        })
                    }
                })
            })
        }
        reader.readAsDataURL(files[0])
    }

    handleSelect() {
        this.setState({
            accept: !this.state.accept
        })
    }

    handleChange(e, i) {
        switch (i) {
            case 0:
                let temp1 = e.target.value !== '' ? 0 : 1
                let errMsgName = temp1 ? '请输入您的姓名' : ''
                this.setState({
                    identityName: e.target.value,
                    showErrMsg1: temp1,
                    errMsg1: errMsgName
                })
                break
            case 1:
                let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
                let temp2 = (e.target.value === '' || !reg.test(e.target.value)) ? 1 : 0
                let errMsgNum = e.target.value === '' ? '请输入您的身份证号码' : temp2 ? '您输入的身份证号码有误' : ''
                this.setState({
                    identityNum: e.target.value,
                    showErrMsg2: temp2,
                    errMsg2: errMsgNum
                })
                break
        }
    }

    authored() {
        const {certify} = this.props.actions
        const {
            iconFront,
            iconBack,
            identityName,
            identityNum,
            uploadFrontSuccess,
            uploadBackSuccess,
            accept
        } = this.state
        let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
        if (!accept) {
            layer.msg('请勾选火星服务条款')
            return
        }
        if (identityName === '') {
            this.setState({
                errMsg2: '请输入您的姓名',
                showErrMsg1: 1
            })
            return
        }
        if (identityNum === '') {
            this.setState({
                errMsg2: '请输入您的身份证号码',
                showErrMsg2: 1
            })
            return
        }
        if (!reg.test(identityNum)) {
            this.setState({
                errMsg: '您输入的身份证号码格式错误',
                showErrMsg2: 1
            })
            return
        }
        if (uploadFrontSuccess === -1 || uploadBackSuccess === -1 || iconFront === '' || iconBack === '') {
            layer.msg('请上传证件照')
            return false
        }

        if (uploadFrontSuccess === 0 || uploadBackSuccess === 0) {
            layer.msg('证件照上传中，请稍后提交！')
            return false
        }
        certify({
            idFaceUrl: iconFront,
            idBackUrl: iconBack,
            identityName,
            identityNum,
            passportid: Cookies.get('hx_user_id'),
            token: Cookies.get('hx_user_token')
        })
    }

    renderContent() {
        const { updaterealauth } = this.props.actions
        const {realAuth} = this.props.userInfo
        let {
            showBack,
            showFront,
            uploadFrontSuccess,
            uploadBackSuccess,
            errMsg1,
            errMsg2,
            showErrMsg1,
            showErrMsg2,
            accept
        } = this.state
        const formArr = [{
            title: '身份证姓名',
            placeholder: '请输入姓名'
        }, {
            title: '身份证号码',
            placeholder: '请输入身份证号码'
        }]
        const fileArr = [{
            desc: '身份证正面'
        }, {
            desc: '身份证背面'
        }]
        let el = ''
        switch (realAuth) {
            case -1:
                el = (
                    <div className='noBindPhone red'>
                        <img src={require('../img/prompt.png')} alt=""/>
                        <p>提示</p>
                        <p>认证失败，请重新认证</p>
                        <div onClick={
                            () => {
                                updaterealauth({
                                    // passportid: Cookies.get('hx_user_id'),
                                    // token: Cookies.get('hx_user_token'),
                                    userid: Cookies.get('hx_user_id'),
                                    state: -2
                                }, () => {
                                    Cookies.set('hx_user_realAuth', -2)
                                })
                            }
                        }>重新认证</div>
                    </div>
                )
                break
            case -2:
                if (!Cookies.get('hx_user_phone')) {
                    el = (
                        el = (
                            <div className='noBindPhone'>
                                <img src={require('../img/prompt.png')} alt=""/>
                                <p>提示</p>
                                <p>实名认证前，请先绑定手机号码</p>
                                <div onClick={browserHistory.push('/user')}>绑定手机号</div>
                            </div>
                        )
                    )
                } else {
                    el = (
                        <div className='nocertify'>
                            <div className="form">
                                {
                                    formArr.map((d, i) => {
                                        return (
                                            <div key={i} className="item">
                                                <span>{d.title}</span>
                                                <div><input type="text" placeholder={d.placeholder} onChange={(e) => { this.handleChange(e, i) }}/></div>
                                                {
                                                    i === 0 && showErrMsg1 ? <p className='active'>{errMsg1}</p> : ''
                                                }
                                                {
                                                    i === 1 && showErrMsg2 ? <p className='active'>{errMsg2}</p> : ''
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="photos">
                                <p className='title'>上传身份证照片</p>
                                <div className="file-select-box">
                                    {
                                        fileArr.map((d, i) => {
                                            return (
                                                <div className='file-select-wrapper' key={i}>
                                                    {
                                                        i === 0 && this.state.iconFront !== '' ? <img className="file" src={this.state.iconFront}/> : ''
                                                    }
                                                    {
                                                        i === 1 && this.state.iconBack !== '' ? <img className="file" src={this.state.iconBack}/> : ''
                                                    }
                                                    {
                                                        (i === 0 && !this.state.showFrontLoading) || (i === 0 && uploadFrontSuccess === -1) ? <img className={!showFront ? 'hide' : ''} src={require('../img/file-plus.png')} alt=""/> : ''
                                                    }
                                                    {
                                                        (i === 1 && !this.state.showBackLoading) || (i === 1 && uploadBackSuccess === -1) ? <img className={!showBack ? 'hide' : ''} src={require('../img/file-plus.png')} alt=""/> : ''
                                                    }
                                                    {
                                                        (i === 0 && !this.state.showFrontLoading) || (i === 0 && uploadFrontSuccess === -1) ? <span className={!showFront ? 'hide' : ''}>{d.desc}</span> : ''
                                                    }
                                                    {
                                                        (i === 1 && !this.state.showBackLoading) || (i === 1 && uploadBackSuccess === -1) ? <span className={!showBack ? 'hide' : ''}>{d.desc}</span> : ''
                                                    }
                                                    {
                                                        i === 0 && this.state.showFrontLoading ? <div className={`loading ${uploadFrontSuccess === -1 ? 'red' : ''}`}>{uploadFrontSuccess === 1 ? '上传成功' : (uploadFrontSuccess === 0 ? '上传中...' : '上传失败')}</div> : ''
                                                    }
                                                    {
                                                        i === 1 && this.state.showBackLoading ? <div className={`loading  ${uploadBackSuccess === -1 ? 'red' : ''}`}>{uploadBackSuccess === 1 ? '上传成功' : (uploadBackSuccess === 0 ? '上传中...' : '上传失败')}</div> : ''
                                                    }
                                                    <input name={i} ref={i} type="file" onChange={this.imgOnChange}/>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <p className='support'>支持jpeg、png等格式，照片大小不超过5M。</p>
                                <p className="server"><img onClick={() => { this.handleSelect() }} src={accept ? require('../img/pact-selected.png') : require('../img/ pact-noselected.png')} alt=""/><span>我已阅读并接受</span> <a onClick={() => { this.setState({showServer: true}) }}>《火星财经服务条款》</a></p>
                                <div className="submit" onClick={() => { this.authored() }}>确定</div>
                            </div>
                        </div>
                    )
                }
                break
            case 0:
                el = (
                    <img className='certify-img' src={require('../img/certifing.png')} alt=""/>
                )
                break
            case 1:
                el = (
                    <img className='certify-img' src={require('../img/certifed.png')} alt=""/>
                )
                break
            default:
                break
        }
        return el
    }

    render() {
        const {showServer} = this.state
        return (
            <div className='certification'>
                <div className="attention-head">
                    <div className="project-title">
                        <img src={require('../img/authenticate.png')} alt=""/>
                        <FormattedMessage id="attention.certification"/>
                        {/* <span className="num">(123 个) </span> */}
                    </div>
                    {/* <div className="search-content">
                        <input type="text" placeholder="输入作者名称"/>
                        <img src={searchImg} alt=""/>
                    </div> */}
                </div>
                <div className="content">
                    {
                        this.renderContent()
                    }
                </div>
                <div className={`background-000 ${showServer ? 'show' : ''}`} onClick={() => { this.setState({showServer: false}) }}></div>
                <section className={`account-box protocol ${showServer ? 'show' : ''}`}>
                    <i className="fork" title="叉号" onClick={() => { this.setState({showServer: false}) }}></i>
                    <div className="protocol-content">
                        <h3>火星财经媒体平台服务协议</h3>
                        <div>
                            <p>【首部及导言】</p>
                            <p>欢迎您使用火星财经媒体平台！</p>
                            <p>为使用火星财经媒体平台服务（以下简称“本服务”），您应当阅读并遵守《火星财经媒体平台服务协议》（以下简称“本协议”）。请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款，以及开通或使用某项服务的单独协议，并选择接受或不接受。限制、免责条款可能以加粗形式提示您注意。 除非您已阅读并接受本协议及相关协议的所有条款，否则您无权使用本服务。您对本服务的登录、查看、发布信息等行为即视为您已阅读并同意本协议的约束。 如果您未满18周岁，请在法定监护人的陪同下阅读本协议及其他上述协议，并特别注意未成年人使用条款。</p>
                            <p>一、【协议的范围】</p>
                            <p>1.1本协议是您与火星财经之间关于您使用火星财经媒体平台服务所订立的协议。“火星财经”是指海南天辰网络科技有限公司及其相关服务可能存在的运营关联单位。“平台用户”是指注册、登录、使用火星财经媒体平台帐号的个人或组织，在本协议中更多地称为“您”。“其他用户”是指包括订阅用户等除平台用户本人外与本服务相关的用户。</p>
                            <p>1.2 本服务以包括但不限于火星财经网、火星财经软件、火星财经M站等火星财经业务平台为传播渠道,由火星财经针对个人或企业推出的信息发布和品牌推广服务。平台用户注册火星财经媒体平台帐号后可以通过火星财经媒体平台进行信息发布、品牌推广以及订阅用户评论管理等操作。</p>
                            <p>二、【帐号注册及帐号权限】</p>
                            <p>您在使用本服务前需要注册一个火星财经媒体平台帐号，火星财经媒体平台帐号为微信账户与手机号码共同绑定生成。</p>
                            <p>2.2火星财经媒体平台将对您的注册帐号信息进行审查。您应当对您提供的帐号资料的真实性、合法性、准确性和有效性独立承担责任。如因此给火星财经或第三方造成损害的，您应当依法予以赔偿。</p>
                            <p>2.3火星财经有权将您通过火星财经媒体平台所发布的消息（包括但不限于文字、图片、视频、图表等）进行不改变原意的修改，并在包括但不限于火星财经网、火星财经软件、火星财经M站等火星财经业务平台上推送给公众。火星财经及其关联方、合作方对您通过火星财经媒体平台所上传发布的任何内容具有全世界范围内的、永久的、不可撤销的、免费的、非独家的使用权。</p>
                            <p>2.4使用本服务，您可获得以下权限：</p>
                            <section>2.4.1 通过火星财经媒体平台进行消息管理及与订阅用户进行互动；</section>
                            <section>2.4.2 获取您的火星财经媒体平台帐号的订阅用户量及消息点击次数量；</section>
                            <section>2.4.3在得到火星财经同意的情况下，您有权通过火星财经媒体平台进行发布品牌推广信息和/或付费订阅等商业活动。您亦同意，火星财经有权就您通过火星财经媒体平台进行商业活动收取技术服务成本费。</section>
                            <p>三、【平台用户个人信息保护】</p>
                            <p>3.1您在申请本服务的过程中，可能需要提供一些必要的信息，请保持这些信息的真实、准确、合法、有效并注意及时更新，以便火星财经向您提供及时有效的帮助，或更好地为您提供服务。根据相关法律法规和政策，请您填写真实的身份信息。若您填写的信息不完整或不准确，则可能无法使用本服务或在使用过程中受到限制。</p>
                            <p>3.2火星财经与平台用户一同致力于个人信息的保护，保护平台用户个人信息是火星财经的一项基本原则。未经你的同意，火星财经不会向火星财经以外的任何公司、组织或个人披露你的个人信息，但法律法规另有规定的除外。</p>
                            <p>3.3您应对通过本服务了解、接收或可接触到的包括但不限于其他用户在内的任何人的个人信息予以充分尊重，您不应以搜集、复制、存储、传播或以其他任何方式使用其他用户的个人信息，否则，由此产生的后果由您自行承担。</p>
                            <p>四、【平台内容规范】</p>
                            <p>4.1本条所述平台内容是指您使用本服务过程中所制作、复制、发布、传播的任何内容，包括但不限于火星财经媒体平台帐号头像、名称、平台用户说明等注册信息，或文字、语音、图片、视频、图文等发送、回复或自动回复消息和相关链接页面，以及其他使用火星财经媒体平台帐号或火星财经媒体平台服务所产生的内容。</p>
                            <p>4.2您在使用本服务时需遵守法律法规、社会主义制度、国家利益、公民合法权益、社会公共秩序、道德风尚及信息真实性等“七条底线”要求。</p>
                            <p>您不得利用本服务制作、复制、发布、传播如下法律、法规和政策禁止的内容：</p>
                            <section>(1) 反对宪法所确定的基本原则的；</section>
                            <section>(2) 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</section>
                            <section>(3) 损害国家荣誉和利益的；</section>
                            <section>(4) 煽动民族仇恨、民族歧视，破坏民族团结的；</section>
                            <section>(5) 破坏国家宗教政策，宣扬邪教和封建迷信的；</section>
                            <section>(6) 散布谣言，扰乱社会秩序，破坏社会稳定的；</section>
                            <section>(7) 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</section>
                            <section>(8) 侮辱或者诽谤他人，侵害他人合法权益的；</section>
                            <section>(9)煽动非法集会、结社、游行、示威、聚众扰乱社会秩序；</section>
                            <section>(10)以非法民间组织名义活动的；</section>
                            <section>(11) 含有法律、法规和政策禁止的其他内容的信息。</section>
                            <p>4.您理解并同意，火星财经一直致力于为平台用户提供文明健康、规范有序的网络环境，您不得利用本服务制作、复制、发布、传播如下干扰火星财经平台正常运营，以及侵犯其他用户或第三方合法权益的内容：</p>
                            <section>(1) 含有任何性或性暗示的；</section>
                            <section>(2) 广告、骚扰、垃圾信息的；</section>
                            <section>(3) 涉及他人隐私、个人信息或资料的；</section>
                            <section>(4) 侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的；</section>
                            <section>(5) 含有其他干扰企鹅媒体平台正常运营和侵犯其他用户或第三方合法权益内容的信息。</section>
                            <p>五、【平台使用规则】</p>
                            <p>5.1本条所述平台使用是指您使用本服务所进行的任何行为，包括但不限于注册登录、帐号运营推广以及其他使用火星财经媒体平台帐号或火星财经媒体平台服务所进行的行为。</p>
                            <p>5.2 您不得利用火星财经媒体平台帐号或火星财经媒体平台服务进行如下行为：</p>
                            <section>(1) 提交、发布虚假信息，或冒充、利用他人名义的；</section>
                            <section>(2) 强制、诱导其他用户关注、点击链接页面或分享信息的；</section>
                            <section>(3) 虚构事实、隐瞒真相以误导、欺骗他人的；</section>
                            <section>(4) 侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的；</section>
                            <section>(5) 未经火星财经书面许可利用火星财经媒体平台帐号为第三方进行推广的（包括但不限于加入第三方链接、广告等行为）；</section>
                            <section>(6) 未经火星财经书面许可使用插件、外挂或其他第三方工具、服务接入本服务和相关系统；</section>
                            <section>(7) 利用火星财经媒体平台帐号或火星财经媒体平台服务从事任何违法犯罪活动的；</section>
                            <section>(8) 制作、发布与以上行为相关的方法、工具，或对此类方法、工具进行运营或传播，无论这些行为是否为商业目的；</section>
                            <section>(9) 其他违反法律法规规定、侵犯其他用户合法权益、干扰产品正常运营或火星财经未明示授权的行为。</section>
                            <p>六、【帐号管理】</p>
                            <p>6.1火星财经媒体平台帐号的所有权归海南天辰网络科技有限公司所有，平台用户完成申请注册手续后，获得火星财经媒体平台帐号的使用权，该使用权仅属于初始申请注册人，禁止赠与、借用、租用、转让或售卖。海南天辰网络科技有限公司因经营需要，有权终止本服务。</p>
                            <p>6.2您有责任妥善保管注册帐户信息及帐户密码的安全，您需要对注册帐户以及密码下的行为承担法律责任。您同意在任何情况下不向他人透露帐户或密码信息。在您怀疑他人在使用您的帐户或密码时，您同意立即通知海南天辰网络科技有限公司。</p>
                            <p>6.3您应遵守本协议的各项条款，正确、适当地使用本服务，如您违反本协议中的任何条款，海南天辰网络科技有限公司有权依据本协议终止对您的火星财经媒体平台帐号提供服务。同时，火星财经保留在任何时候收回火星财经媒体平台帐号、平台用户名的权利。</p>
                            <p>七、【数据的储存】</p>
                            <p>7.1 火星财经不对你在本服务中相关数据的删除或储存失败负责。</p>
                            <p>7.2火星财经有权根据实际情况自行决定单个平台用户在本服务中数据的最长储存期限，并在服务器上为其分配数据最大存储空间等。你可根据自己的需要自行备份本服务中的相关数据。</p>
                            <p>7.3如果你停止使用本服务或服务被终止或取消，火星财经可以从服务器上永久地删除你的数据。服务停止、终止或取消后，火星财经没有义务向你返还任何数据。</p>
                            <p>八、【风险及免责】</p>
                            <p>8.1您理解并同意，本服务仅为平台用户提供信息分享、传播及获取的平台，您必须为自己注册帐户下的一切行为负责，包括您所发表内容的真实性、合法性、准确性、有效性，以及承担因本服务使用行为产生的结果。平台用户应对火星财经媒体平台中的内容自行加以判断，并承担因使用内容而引起的所有风险，包括因对内容真实性、合法性、准确性、有效性的依赖而产生的风险。火星财经无法且不会对因平台用户行为而导致的损失或损害承担责任。</p>
                            <p>如果你发现任何人违反本协议规定或以其他不当的方式使用火星财经媒体平台服务，请立即向火星财经媒体平台举报或投诉，我们将依法进行处理。</p>
                            <p>8.2您理解并同意，因业务发展需要，火星财经保留单方面对本服务的全部或部分服务内容在任何时候不经任何通知的情况下变更、暂停、限制、终止或撤销的权利，平台用户需承担此风险。</p>
                            <p>九、【知识产权声明】</p>
                            <p>9.1火星财经在本服务中提供的内容（包括但不限于网页、文字、图片、音频、视频、图表等）的知识产权归火星财经所有，平台用户在使用本服务中所产生的内容的知识产权归平台用户或相关权利人所有。</p>
                            <p>9.2 除另有特别声明外，火星财经提供本服务时所依托软件的著作权、专利权及其他知识产权均归火星财经所有。</p>
                            <p>9.3火星财经在本服务中所使用的“火星财经”等商业标识，其著作权或商标权归技术呢财经所有。</p>
                            <p>9.4上述及其他任何本服务包含的内容的知识产权均受到法律保护，未经火星财经、平台用户或相关权利人书面许可，任何人不得以任何形式进行使用或创造相关衍生作品。</p>
                            <p>十、【法律责任】</p>
                            <p>10.1如果火星财经发现或收到他人举报或投诉平台用户违反本协议约定的，火星财经有权不经通知随时对相关内容进行删除，并视行为情节对违规帐号处以包括但不限于警告、删除部分或全部订阅用户、限制或禁止使用全部或部分功能、帐号封禁直至注销的处罚，并公告处理结果。</p>
                            <p>10.2您理解并同意，腾讯有权依合理判断对违反有关法律法规或本协议规定的行为进行处罚，对违法违规的任何人士采取适当的法律行动，并依据法律法规保存有关信息向有关部门报告等，平台用户应独自承担由此而产生的一切法律责任。</p>
                            <p>10.3您理解并同意，因您违反本协议或相关的服务条款的规定，导致或产生的任何第三方主张的任何索赔、要求或损失，包括合理的律师费，您应当赔偿火星财经与合作公司、关联公司，并使之免受损害。</p>
                            <p>十一、【协议的生效与变更】</p>
                            <p>11.1 您使用本服务即视为您已阅读并同意受本协议的约束。</p>
                            <p>11.2 火星财经有权在必要时修改本协议条款。您可以在相关服务页面查阅最新版本的协议条款。</p>
                            <p>11.3本协议条款变更后，如果您继续使用火星财经媒体平台服务，即视为您已接受修改后的协议。如果您不接受修改后的协议，应当停止使用本服务。</p>
                            <p>十二、【其他】</p>
                            <p>12.1 本协议签订地为中华人民共和国北京市海淀区。</p>
                            <p>12.2本协议的成立、生效、履行、解释及纠纷解决，适用中华人民共和国大陆地区法律（不包括冲突法）。</p>
                            <p>12.3若您和火星财经之间发生任何纠纷或争议，首先应友好协商解决；协商不成的，您同意将纠纷或争议提交本协议签订地有管辖权的人民法院管辖。</p>
                            <p>12.4 本协议所有条款的标题仅为阅读方便，本身并无实际涵义，不能作为本协议涵义解释的依据。</p>
                            <p>12.5 本协议条款无论因何种原因部分无效或不可执行，其余条款仍有效，对双方具有约束力。</p>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}
