/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：store
 */

import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import { browserHistory } from 'react-router'

import rootReducer from '../reducers/index'

const router = routerMiddleware(browserHistory)
export default createStore(rootReducer, composeWithDevTools(
    applyMiddleware(thunk, router)
))
