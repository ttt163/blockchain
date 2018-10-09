/**
 * Author：zhoushuanglong
 * Time：2017/7/26
 * Description：personal
 */

import React, {Component} from 'react'

import './index.scss'

import ProjectCoinDetail from '../Project/ProjectCoinDetail'
import InfoHeader from './InfoHeader'

export default class Project extends Component {
    render() {
        return [
            <ProjectCoinDetail key="projectCoinDetail" coinid={this.props.location.query.coinid}/>,
            <InfoHeader key="InfoHeader" coinid={this.props.location.query.coinid}/>,
            <div className="project-classify" key="projectClassify">
                {this.props.children}
            </div>
        ]
    }
}
