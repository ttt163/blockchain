const gulp = require('gulp')
const clean = require('gulp-clean')
const cleanCSS = require('gulp-clean-css')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const webpack = require('webpack')
const gulpWebpack = require('gulp-webpack')
const runSequence = require('run-sequence')
const connect = require('gulp-connect')
const stylelint = require('gulp-stylelint')
const imagemin = require('gulp-imagemin')
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector')
const fileinclude = require('gulp-file-include')
const del = require('del')
const gulpDel = require('./gulp-del')
const strReplace = require('./gulp-str-replace')

const webpackconfig = require('./webpack.config.js')
const {host, port, publicPath} = require('./config.js')
const viewsFolder = 'views'
/* ----------------------------------------handle ejs---------------------------------------- */
// ejs include
gulp.task('includeEjs', () => {
    return gulp.src('assets/ejs/*.ejs')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(strReplace({
            '../../img': '/img',
            '../img': '/img',
            '../../js': '/js',
            '../js': '/js',
            '../../css': '/css',
            '../css': '/css'
        }))
        .pipe(gulp.dest(viewsFolder))
        .pipe(connect.reload())
})

/* ----------------------------------------handle css---------------------------------------- */
// stylelint
gulp.task('lintCss', () => {
    return gulp.src(['assets/css/*.scss', 'assets/css/*/*.scss'])
        .pipe(stylelint({
            reporters: [
                {formatter: 'string', console: true}
            ]
        }))
})

// sass
gulp.task('sass', ['lintCss'], () => {
    return gulp.src('assets/css/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/css'))
        .pipe(connect.reload())
})

// postcss
gulp.task('postcss', ['sass'], () => {
    const plugins = [
        autoprefixer({browsers: ['last 2 versions', 'ie >= 8', '> 5% in CN']})
    ]
    return gulp.src('public/css/*.css')
        .pipe(strReplace({
            '../../img': '/img',
            '../img': '/img',
            '../../fonts': '/fonts',
            '../fonts': '/fonts'
        }))
        .pipe(sourcemaps.init())
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/css'))
        .pipe(connect.reload())
})

// minify css, add manifest
gulp.task('hashCss', () => {
    return gulp.src('public/css/*.css')
        .pipe(rev())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('public/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('public/rev/css'))
})

/* ----------------------------------------handle js---------------------------------------- */
// import webpack build js
gulp.task('buildJs', () => {
    return gulp.src('assets/js/*.js')
        .pipe(gulpWebpack(webpackconfig, webpack))
        .pipe(strReplace({
            '../../img': '/img',
            '../img': '/img'
        }))
        .pipe(gulp.dest('public'))
        .pipe(connect.reload())
})

// add manifest
gulp.task('hashJs', () => {
    return gulp.src('public/js/*.*')
        .pipe(rev())
        .pipe(gulp.dest('public/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('public/rev/js'))
})

/* ----------------------------------------handle img---------------------------------------- */
// copy img
gulp.task('copyImg', () => {
    return gulp.src(['assets/img/*', 'assets/img/*/*.*', 'assets/img-not-hash/*', 'assets/img-not-hash/*/*.*'])
        .pipe(gulp.dest('public/img'))
        .pipe(connect.reload())
})

// minify img, add manifest
gulp.task('hashImg', () => {
    return gulp.src(['public/img/*', 'public/img/*/*.*'])
        .pipe(rev())
        .pipe(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true,
            multipass: true
        }))
        .pipe(gulp.dest('public/img'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('public/rev/img'))
})

/* ----------------------------------------handle fonts---------------------------------------- */
// copy fonts
gulp.task('copyFontsDev', () => {
    return gulp.src(['assets/fonts/*', 'assets/fonts/*/*'])
        .pipe(gulp.dest('public/fonts'))
        .pipe(connect.reload())
})

gulp.task('copyFontsBuild', () => {
    return gulp.src(['assets/fonts/*', 'assets/fonts/*/*'])
        .pipe(rev())
        .pipe(gulp.dest('public/fonts'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('public/rev/fonts'))
})

/* ----------------------------------------clean public---------------------------------------- */
// clean public folder
gulp.task('cleanPublic', () => {
    return gulp.src(['public/css', 'public/js', 'public/img', 'public/rev', 'public/fonts', viewsFolder], {read: false})
        .pipe(clean({force: true}))
})
// del manifest source file
gulp.task('delManifestSourceFile', (callback) => {
    return gulp.src('public/rev/*/*')
        .pipe(gulpDel(function (fileArr) {
            del(fileArr, callback)
        }))
})
// clean public/rev folder
gulp.task('cleanRev', () => {
    return gulp.src(['public/rev'], {read: false})
        .pipe(clean({force: true}))
})

/* ----------------------------------------rev collector---------------------------------------- */
gulp.task('revCssFonts', () => { // fonts in css
    return gulp.src(['public/rev/fonts/*.json', 'public/css/*.css'])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                '/fonts': publicPath + '/fonts'
            }
        }))
        .pipe(gulp.dest('public/css'))
})
gulp.task('revCssImg', () => { // img in css
    return gulp.src(['public/rev/img/*.json', 'public/css/*.css'])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                '/img': publicPath + '/img'
            }
        }))
        .pipe(gulp.dest('public/css'))
})
gulp.task('revJsImg', () => { // img in js
    return gulp.src(['public/rev/img/*.json', 'public/js/*.js'])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                '/img': publicPath + '/img'
            }
        }))
        .pipe(gulp.dest('public/js'))
})
gulp.task('revHtmlImg', () => { // img in html
    return gulp.src(['public/rev/img/*.json', `${viewsFolder}/*.ejs`])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                '/img': publicPath + '/img'
            }
        }))
        .pipe(gulp.dest(viewsFolder))
})
gulp.task('revHtmlCss', () => { // css in html
    return gulp.src(['public/rev/css/*.json', `${viewsFolder}/*.ejs`])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                '/css': publicPath + '/css'
            }
        }))
        .pipe(gulp.dest(viewsFolder))
})
gulp.task('revHtmlJs', () => { // js in html
    return gulp.src(['public/rev/js/*.json', `${viewsFolder}/*.ejs`])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                '/js': publicPath + '/js'
            }
        }))
        .pipe(gulp.dest(viewsFolder))
})

/* ----------------------------------------watch---------------------------------------- */
gulp.task('connect', () => {
    connect.server({
        root: ['public', viewsFolder],
        host: host,
        port: port,
        livereload: true
    })
})

gulp.task('watch', () => {
    gulp.watch(['assets/ejs/*.ejs', 'assets/ejs/*/*.ejs'], ['includeEjs'])
    gulp.watch(['assets/css/*.scss', 'assets/css/*/*.scss'], ['postcss'])
    gulp.watch(['assets/js/*.js', 'assets/js/*/*.js'], ['buildJs'])
    gulp.watch(['assets/img/*', 'assets/img/*/*'], ['copyImg'])
    gulp.watch(['assets/fonts/*', 'assets/fonts/*/*'], ['copyFonts'])
})

/* ----------------------------------------dev build---------------------------------------- */
gulp.task('dev', (callback) => runSequence(
    'cleanPublic',
    ['includeEjs', 'postcss', 'buildJs', 'copyImg', 'copyFontsDev'],
    callback
))

gulp.task('watchServer', (callback) => runSequence(
    ['watch', 'connect'],
    callback
))

gulp.task('build', (callback) => runSequence(
    'cleanPublic',
    ['includeEjs', 'postcss', 'buildJs', 'copyImg', 'copyFontsBuild'],
    ['hashCss', 'hashJs', 'hashImg'],
    'revCssFonts',
    'revJsImg',
    'revCssImg',
    'revHtmlImg',
    'revHtmlCss',
    'revHtmlJs',
    'delManifestSourceFile',
    'cleanRev',
    callback
))
