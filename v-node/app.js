const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('morgan')
const fileStreamRotator = require('file-stream-rotator')
const fs = require('fs')

const proxyRouter = require('./routes/proxy')
const newsDetailRouter = require('./routes/newsDetail')
const indexRouter = require('./routes/index')
const newsRouter = require('./routes/news')
const liveNewsRouter = require('./routes/flashNews')
const hotNewsRouter = require('./routes/hotNews')
const hotNewsListRouter = require('./routes/hotNewsList')
const newsAutnorRouter = require('./routes/newsAuthor')
const marketsRouter = require('./routes/markets')
const exchangeListRouter = require('./routes/exchangeList')
const projectRouter = require('./routes/marketsProject')
const projectNewsRouter = require('./routes/marketsRelatedNews')
const liveNewsDetailRouter = require('./routes/liveNewsDetail')
const signtureRouter = require('./routes/signture')
const searchRouter = require('./routes/search')
const authorRouter = require('./routes/author')
const publicityRouter = require('./routes/publicity')

const mApply = require('./routes/mApply')
const applyList = require('./routes/applyList')
const video = require('./routes/video')
const videoDetails = require('./routes/videoDetails')
const downloadRouter = require('./routes/download')
const mLiveList = require('./routes/textLive')
const mLiveDetail = require('./routes/textLiveDetail')
// const summitLiveDetail = require('./routes/summitLiveDetail')
const mLogin = require('./routes/mLogin')
const mLiveDetailEn = require('./routes/textLiveDetailEn')
const chinaTour = require('./routes/chinaTour')
// const newsindexRouter = require('./routes/index')
const protocolRouter = require('./routes/m-protocol')
const summitRouter = require('./routes/summit')
const nycSummitRouter = require('./routes/summitNyc')
const buDownload = require('./routes/buDownload')
const huodong = require('./routes/activity')
const huodongDetail = require('./routes/activityDetail')
const mappDown = require('./routes/mappDown') // 打开APP页路由
const appDownWx = require('./routes/appDownWx') // 微信跳转路由
const coinRouter = require('./routes/coinEncyclopedia')
const marketStatisticsRouter = require('./routes/marketStatistics')

const app = express()

// java接口代理
app.use('/info', proxyRouter)
app.use('/market', proxyRouter)
app.use('/passport', proxyRouter)
app.use('/lives', proxyRouter)
app.use('/mgr', proxyRouter)
app.use('/account', proxyRouter)
app.use('/push', proxyRouter)
app.get(['/details.html', 'details-app.html'], function (req, res, next) {
    res.redirect(`/newsdetail/${req.query.id}.html`)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// logger
const logDir = '/data/node_site/www.huoxing24.com/logs'
fs.existsSync(logDir) || fs.mkdirSync(logDir)
const accessLogStream = fileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDir, 'logs-%DATE%.log'),
    frequency: 'daily',
    verbose: true
})

app.use(logger('dev'))
app.use(logger('common', {stream: accessLogStream}))

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public'), {
    index: false
}))

app.use('/', indexRouter)
app.use('/newsdetail', newsDetailRouter)
app.use('/index', indexRouter)
app.use('/news', newsRouter)
app.use('/livenews', liveNewsRouter)
app.use('/liveNewsDetail', liveNewsDetailRouter)
app.use('/hot', hotNewsRouter)
app.use('/hotList', hotNewsListRouter)
app.use('/newsauthor', newsAutnorRouter)
app.use('/markets', marketsRouter)
app.use('/exchangelist', exchangeListRouter)
app.use('/projectNews', projectNewsRouter)
app.use('/project', projectRouter)
app.use('/signture', signtureRouter)
app.use('/search', searchRouter)
app.use('/author', authorRouter)
app.use('/mtc', publicityRouter)
app.use('/mtc2', publicityRouter)
app.use('/mtc3', publicityRouter)
app.use('/mtc4', publicityRouter)
app.use('/mtc5', publicityRouter)

app.use('/mtcsign', mApply)
app.use('/mtcsign2', mApply)
app.use('/mtcsign3', mApply)
app.use('/mtcsign4', mApply)
app.use('/mtcsign5', mApply)
app.use('/applyList', applyList)
app.use('/video', video)
app.use('/videoDetails', videoDetails)
app.use('/app', downloadRouter)
app.use('/liveList', mLiveList)
app.use('/liveDetail', mLiveDetail)
// app.use('/liveDetail', summitLiveDetail)
app.use('/mLogin', mLogin)
app.use('/enLiveDetail', mLiveDetailEn)
app.use('/chinaTour', chinaTour)
app.use('/protocol', protocolRouter)
app.use('/summit', summitRouter)
app.use('/zt', nycSummitRouter)
// app.use('/summit-nyc', nycSummitRouter)
app.use('/buDownload', buDownload)
app.use('/huodong', huodong)
app.use('/huodongDetail', huodongDetail)
app.use('/mappDown', mappDown) // 打开APP页路由
app.use('/appDownWx', appDownWx) // 微信跳转
app.use('/coin', coinRouter)
app.use('/data', marketStatisticsRouter)

// react-router browserhistory
app.get([
    '/personal',
    '/primer',
    '/newcoins',
    '/newcoinsList',
    '/newcoinsDetail',
    '/projectInfo',
    '/projectRelatenews',
    '/copyright',
    '/about',
    '/user',
    '/userMyAttention',
    '/userMyAttentionProject',
    '/userMyAttentionAuthor',
    '/userMyArticle',
    '/userMyInfo',
    '/userBindingPhone',
    '/changePhoneEml',
    '/userChangePassword',
    '/userMyCollection',
    '/userCertification',
    '/edit',
    '/live',
    '/live/liveList',
    '/live/liveDetails',
    '/showSpecial',
    '/showSpecialNews',
    '/wbcworld',
    '/wbcworldNews',
    '/chinaTour',
    '/activity',
    '/mappDown', // 打开APP页路由
    '/appDownWx' // 微信跳转
], function (req, res) {
    res.sendFile(path.resolve(__dirname, 'public/static/index.html'))
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
