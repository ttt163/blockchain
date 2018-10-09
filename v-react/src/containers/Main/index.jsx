/**
 * Author：zhoushuanglong
 * Time：2017/7/26
 * Description：main
 */

import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'

import './index.scss'
import {urlPath} from '../../public/index'

import HeaderRollMsg from '../../components/main/HeaderRollMsg'
import HeaderNav from '../../components/main/HeaderNav'
import Footer from '../../components/main/Footer'
import Totop from '../../components/main/Totop'

import {getHeaderRollMsg} from '../../actions/index'

const mapStateToProps = (state) => {
    return {
        headerRollMsg: state.headerRollMsg
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getHeaderRollMsg}, dispatch)
    }
}

let timer

@connect(mapStateToProps, mapDispatchToProps)
export default class Main extends Component {
    componentWillMount() {
        Cookies.remove('currentLink')
    }

    getRollMsg = () => {
        this.props.actions.getHeaderRollMsg('zh')
    }

    componentDidMount() {
        const This = this
        this.getRollMsg()

        clearInterval(timer)

        timer = setInterval(function () {
            This.getRollMsg()
        }, 60000)
    }

    render() {
        const {headerRollMsg, children, location} = this.props
        return [
            <div className="header-roll-msg-wrap" key="headerRollMsgWrap">
                <HeaderRollMsg headerRollMsg={headerRollMsg}/>
            </div>,
            <div className="header-nav-wrap" key="headerNavWrap">
                <HeaderNav location={location}/>
            </div>,
            <div
                key="indexChildren"
                className={(urlPath().indexOf('/index') > -1 || urlPath() === '/') ? 'hx-main-other' : ''}>
                {children}
            </div>,
            <div key='clearBoth' style={{clear: 'both'}}/>,
            <Totop key="toTop"/>,
            <Footer key="footer"/>
        ]
    }
}
