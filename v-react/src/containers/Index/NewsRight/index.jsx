/**
 * Author：liushaozong
 * Time：2018-01-21 21:34
 * Description：index news list
 */

import React from 'react'
import {injectIntl} from 'react-intl'

import './index.scss'

// import NewsInformation from './NewsInformation'
import NewAuthor from './NewAuthor'
// import NewsRightImg from './NewsRightImg'

const NewsRight = (props) => {
    // const {quickNewsList, imgArr} = props
    // const {imgArr} = props
    return <div className="index-news-right">
        {/* <NewsRightImg imgArr={imgArr}/> */}
        <NewAuthor />
        {/* <NewsInformation quickNewsList={quickNewsList}/> */}
    </div>
}

export default injectIntl(NewsRight)
