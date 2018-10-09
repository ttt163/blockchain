/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：outer jsx
 */

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {Router, browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

import {IntlProvider, addLocaleData} from 'react-intl'
import en from 'react-intl/locale-data/en'
import zh from 'react-intl/locale-data/zh'
import zhCN from './locale/zh'
// import enUS from './locale/en'

import 'intl-polyfill'

import rootRoutes from './routes'
import store from './store/index'
import './public/index.scss'

import {isPc, getQueryString} from './public/index'

addLocaleData([...en, ...zh])
const history = syncHistoryWithStore(browserHistory, store)

window.onload = () => {
    if (isPc() === false) {
        if (window.location.href.indexOf('newsdetail') !== -1) {
            window.location.href = `http://m.huoxing24.com/details.html?id=${getQueryString('id')}`
        } else if (window.location.href.indexOf('wbcworld') !== -1) {
            window.location.href = `http://m.huoxing24.com/exhibition.html`
        } else {
            window.location.href = 'http://m.huoxing24.com/'
        }
    }

    const pageLoadingEle = document.getElementById('pageLoading')
    pageLoadingEle.className = 'lk-loading'
    setTimeout(function () {
        pageLoadingEle.parentNode.removeChild(pageLoadingEle)
    }, 300)

    render(
        <IntlProvider locale='zh' messages={zhCN}>
            <Provider store={store}>
                <Router history={history}>
                    {rootRoutes}
                </Router>
            </Provider>
        </IntlProvider>,
        document.getElementById('root')
    )
}
