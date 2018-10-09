/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：root reducer
 */

import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'

import headerRollMsg from './headerRollMsg'
import commentNews from './commentNews'
import {quickNews} from './quickNews'
import {certifyState} from './certify'
import {followList} from './attetion'
import {hotSubject, hotSubjectTopic} from './hotSubject'
import {reducerSpecialNews, reducerSpecialRecommend, reducerBlockchain} from './special'
import {
    reducerNewList,
    reducerNewRecommend,
    reducerNewCorrelation,
    reducerNewsDetails,
    reducerNewListRecommend,
    reducerHotNews,
    reducerRecommendNews,
    reducerColumnNews,
    reducerMyNews
    // reducerHotLabel
} from './news'
import {
    currencyParticularsReducer,
    currencyParticularsPriceReducer,
    exchangeListReducer,
    currencyNewsReducer,
    getCoinTrend
} from './project'
import {livesList, pastList} from './livesList'
import marketList from './market'
import conceptMarket from './conceptMarket'
import {newCoinsReducer, newCoinsDetailsReducer} from './newCoins'
import {newsComments} from './newsComments'
import reducerUser from './user'
import adInfo from './ad'
import {loginInfo, loginShow} from './loginInfo'
import {authorInfo} from './authorinfo'
import indexAuthorList from './indexAuthorList'

import newsSearch from './newsSearch'

const reducers = Object.assign({
    headerRollMsg,
    commentNews,
    quickNews,
    reducerNewList,
    reducerNewRecommend,
    reducerNewsDetails,
    reducerNewCorrelation,
    reducerNewListRecommend,
    reducerHotNews,
    reducerRecommendNews,
    reducerColumnNews,
    reducerMyNews,
    getCoinTrend,
    marketList,
    conceptMarket,
    currencyParticularsReducer,
    currencyParticularsPriceReducer,
    newCoinsReducer,
    exchangeListReducer,
    newCoinsDetailsReducer,
    currencyNewsReducer,
    newsComments,
    loginInfo,
    reducerUser,
    loginShow,
    newsSearch,
    adInfo,
    authorInfo,
    certifyState,
    followList,
    indexAuthorList,
    livesList,
    pastList,
    reducerSpecialNews,
    reducerSpecialRecommend,
    hotSubject,
    hotSubjectTopic,
    // reducerHotLabel,
    reducerBlockchain,
    routing: routerReducer
})

const rootReducer = combineReducers(reducers)
export default rootReducer
