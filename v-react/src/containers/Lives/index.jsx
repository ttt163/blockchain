/**
 * Author：liushaozong
 * Time：2018/02/27
 * Description：search
 */
import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import './index.scss'
import {getLivesList} from '../../actions/live'
import banner from './img/top-bg.jpg'
// import wx from './img/wx.png'
import floatL from './img/float-f.png'
import floatR from './img/float-r.png'

let liveTopStyle = {
    width: '100%',
    background: `url(${banner}) top center no-repeat`
}
class Lives extends Component {
    state = {
        searchVal: this.props.location.query.val,
        searchListState: true
    }

    componentWillMount() {
        this.props.actions.getLivesList({
            status: '-3',
            pageSize: 9,
            currentPage: 1
        })
    }

    componentDidMount() {
        $('#socialShare').html($('#socialShareRoot').html())
    }

    render() {
        return <div className="live-wrap clearfix">
            <div className="live-banner" style={liveTopStyle}>
                <div className="live-introduce">
                    <div className="float-l"><img src={floatL} alt=""/></div>
                    <div className="float-r"><img src={floatR} alt=""/></div>
                    <div className="introduce-box">
                        <p>分享到</p>
                        <div className="share social-share" id="socialShare"></div>
                    </div>
                </div>
                <div className="live-box clearfix">
                    {this.props.children}
                </div>
            </div>
        </div>
    }
}
const mapStateToProps = (state) => {
    return {
        livesList: state.livesList
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getLivesList}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Lives))
