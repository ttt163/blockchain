/**
 * Author：liushaozong
 * Time：2018/02/21
 * Description：news
 */
import React, {Component} from 'react'

import Article from '../Article/index'

export default class MyArticle extends Component {
    render() {
        return <Article location={this.props.location} articletype='userMyCollection'/>
    }
}
