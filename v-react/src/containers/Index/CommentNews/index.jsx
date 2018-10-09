/**
 * Author：zhoushuanglong
 * Time：2018-01-20 21:34
 * Description：roll msg
 */

import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import './index.scss'

import {getIndexNewsRecommend} from '../../../actions/news'
import News from '../../../components/index/CommentNews'

class CommentNews extends Component {
    componentWillMount() {
        this.props.actions.getIndexNewsRecommend(15)
    }

    render() {
        const {indexNewsRecommend} = this.props
        return <div>
            <News commentNews={indexNewsRecommend.inforList}/>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        indexNewsRecommend: state.reducerNewRecommend
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getIndexNewsRecommend}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentNews)
