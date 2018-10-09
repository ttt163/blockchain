import React, {Component} from 'react'
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import './index.scss'
import './reset.scss'

let rotateTimer = 0

export default class ReactMusicPlayer extends Component {
    state = {
        isPaused: false,
        totalTime: 0,
        playPer: 0,
        bufferedPer: 0,
        playedLeft: 0,
        volumnLeft: 0,
        remainTime: 0,
        angle: 0,
        mouseDown: false,
        musicListShow: false,
        currentMusic: {},
        isPlayed: false
    }

    componentDidMount() {
        let audio = this.refs.audio
        this.setState({
            currentMusic: this.props.info[0]
        })
        audio.addEventListener('canplay', () => {
            // 获取总时间
            let totalTime = parseInt(this.refs.audio.duration)
            this.setState({
                totalTime: this.getTime(totalTime),
                // remainTime: this.getTime(totalTime),
                remainTime: '00:00',
                playedLeft: this.refs.played.getBoundingClientRect().left,
                volumnLeft: this.refs.totalVolume.getBoundingClientRect().left
            })
        })
        // 设置初始音量
        this.refs.volumeProgress.style.width = '100%'
        audio.volume = 1
    }

    last = () => {
        this.setState({
            angle: 0
        })
        if (!this.state.currentMusic.src) {
            return
        }
        let current = ''
        this.props.info.forEach((v, i) => {
            if (v.src === this.state.currentMusic.src) {
                current = i
            }
        })
        if (current > 0) {
            this.setState({
                currentMusic: this.props.info[current - 1]
            }, () => {
                this.play()
            })
        } else {
            this.setState({
                currentMusic: this.props.info[this.props.info.length - 1]
            }, () => {
                this.play()
            })
        }
    }

    play = () => {
        clearInterval(rotateTimer)
        let audio = this.refs.audio
        if (audio.paused && this.state.currentMusic.src) {
            audio.play()
            this.setState({
                isPaused: true,
                isPlayed: true
            }, () => {
                rotateTimer = setInterval(() => {
                    this.setState({
                        angle: this.state.angle + 1
                    }, () => {
                        this.refs.musicAvatar.style.transform = `rotate(${this.state.angle}deg)`
                    })
                }, 33)
            })
        } else {
            audio.pause()
            this.setState({
                isPaused: false
            }, () => {
                clearInterval(rotateTimer)
            })
        }

        audio.addEventListener('timeupdate', () => {
            // 设置播放进度条
            let playPer = audio.currentTime / audio.duration
            this.refs.played.style.width = playPer * 100 + '%'
            // 设置缓冲进度条
            let timeRages = audio.buffered
            let bufferedTime = 0
            if (timeRages.length !== 0) {
                bufferedTime = timeRages.end(timeRages.length - 1)
            }
            let bufferedPer = bufferedTime / audio.duration
            this.refs.buffered.style.width = bufferedPer * 100 + '%'
            // 设置剩余时间
            let remainTime = parseInt(audio.duration - audio.currentTime)
            console.log(remainTime)

            this.setState({
                // remainTime: this.getTime(remainTime)
                remainTime: this.getTime(parseInt(audio.currentTime))
            })
            if (audio.ended) {
                this.next()
            }
        })
    }

    next = () => {
        this.setState({
            angle: 0
        })
        if (!this.state.currentMusic.src) {
            return
        }
        let current = ''
        this.props.info.forEach((v, i) => {
            if (v.src === this.state.currentMusic.src) {
                current = i
            }
        })
        if (current < this.props.info.length - 1) {
            this.setState({
                currentMusic: this.props.info[current + 1]
            }, () => {
                this.play()
            })
        } else {
            this.setState({
                currentMusic: this.props.info[0]
            }, () => {
                this.play()
            })
        }
    }

    // PC端设置进度条
    setTimeOnPc(e) {
        let audio = this.refs.audio
        if (audio.currentTime !== 0) {
            let audio = this.refs.audio
            let newWidth = (e.pageX - this.state.playedLeft) / this.refs.progress.offsetWidth
            this.refs.played.style.width = newWidth * 100 + '%'
            audio.currentTime = newWidth * audio.duration
        }
    }

    // PC端点击事件
    clickChangeTime = (e) => {
        if (!e.pageX) {
            return
        }
        this.setTimeOnPc(e)
    }

    // PC端拖动进度条
    mouseDown = () => {
        this.setState({
            mouseDown: true
        })
    }

    slideChangeTime = (e) => {
        if (this.state.mouseDown) {
            this.setTimeOnPc(e)
        }
    }

    mouseUp = () => {
        this.setState({
            mouseDown: false
        })
    }

    startChangeTime = (e) => {
        if (this.refs.audio.currentTime !== 0) {
            this.setTime(e)
        }
    }

    moveProgress = (e) => {
        let audio = this.refs.audio
        if (audio.currentTime !== 0) {
            this.setTime(e)
        }
    }

    getTime = (musicTime) => {
        if (musicTime) {
            if (musicTime < 60) {
                musicTime = `00:${musicTime < 10 ? `0${musicTime}` : musicTime}`
            } else {
                musicTime = `${parseInt(musicTime / 60) < 10 ? `0${parseInt(musicTime / 60)}` : parseInt(musicTime / 60)}:${musicTime % 60 < 10 ? `0${musicTime % 60}` : musicTime % 60}`
            }
            return musicTime
        } else {
            return `00:00`
        }
    }

    setTime = (e) => {
        let audio = this.refs.audio
        let newWidth = (e.touches[0].pageX - this.state.playedLeft) / this.refs.progress.offsetWidth
        this.refs.played.style.width = newWidth * 100 + '%'
        audio.currentTime = newWidth * audio.duration
    }

    /* 移动端改变音量 */
    setVolume = (pageX) => {
        let audio = this.refs.audio
        let volumeRate = (pageX - this.state.volumnLeft) / this.refs.totalVolume.offsetWidth
        if (volumeRate > 0.01 && volumeRate <= 1) {
            audio.volume = volumeRate
            this.refs.volumeProgress.style.width = volumeRate * 100 + '%'
        } else if (volumeRate <= 0.01) {
            audio.volume = 0
        } else {
            audio.volume = 1
        }
    }

    startMoveVolume = (e) => {
        if (this.refs.audio.currentTime !== 0) {
            this.setVolume(e.touches[0].pageX)
        }
    }

    moveVolume = (e) => {
        if (this.refs.audio.currentTime !== 0) {
            this.setVolume(e.touches[0].pageX)
        }
    }

    // PC端改变音量
    clickChangeVolume = (e) => {
        if (this.refs.audio.currentTime !== 0) {
            this.setVolume(e.pageX)
        }
    }

    mouseDownVulume = () => {
        this.setState({
            mouseDown: true
        })
    }

    slideChangeVolume = (e) => {
        if (this.state.mouseDown && this.refs.audio.currentTime !== 0) {
            this.setVolume(e.pageX)
        }
    }

    mouseUpVolume = () => {
        this.setState({
            mouseDown: false
        })
    }

    mouseLeave = () => {
        this.setState({
            mouseDown: false
        })
    }

    // 展开播放列表
    showMusicList = () => {
        this.setState({
            musicListShow: !this.state.musicListShow
        })
    }

    playThis = (i) => {
        this.setState({
            currentMusic: this.props.info[i]
        }, () => {
            this.play()
        })
    }

    delMusic = (i, id) => {
        let audio = this.refs.audio
        this.setState({})
        if (this.props.info[i].src === this.state.currentMusic.src) {
            if (i <= this.props.info.length - 1 && this.props.info[i + 1]) {
                this.setState({
                    currentMusic: this.props.info[i + 1]
                }, () => {
                    this.play()
                    this.props.onDel(i, id)
                })
            } else if (!this.props.info[i + 1] && this.props.info[i - 1]) {
                // 都删除完了
                // console.log(`山的是最后一条`)
                clearInterval(rotateTimer)

                this.setState({
                    currentMusic: this.props.info[0]
                }, () => {
                    this.play()
                })
                this.props.onDel(i, id)
            } else {
                // 都删除完了
                // console.log(`都删除完了`)
                clearInterval(rotateTimer)
                audio.currentTime = 0
                this.refs.buffered.style.width = 0
                this.refs.played.style.width = 0
                this.setState({
                    currentMusic: {},
                    isPlayed: false,
                    musicListShow: false

                }, () => {
                    this.props.onDel(i, id)
                })
            }
        } else {
            // console.log(`删除的不是播放的`)
            this.props.onDel(i, id)
        }
    }

    render() {
        return (
            <div id='react-music-player' style={{marginBottom: '20px'}}>
                <div className='react-music-player-wrapper'>
                    <div className='react-music-player-inner'>
                        <div className='left-control'>
                            <span className='icon-last' onClick={this.last}/>
                            <span
                                className={this.state.isPaused && this.state.currentMusic.src ? 'icon-pause' : 'icon-play'}
                                onClick={this.play}/>
                            <span className='icon-next' onClick={this.next}/>
                        </div>
                        <div className='music-box'>
                            <div className='picture' style={{display: 'none'}}>
                                {this.state.currentMusic.src ? <img src={this.state.currentMusic.img} ref='musicAvatar' alt='图片丢失了'/> : null}
                            </div>
                            <div className='music-info'>
                                <div className='music-name'>
                                    {this.state.currentMusic.src ? (`${this.state.currentMusic.artist}${this.state.currentMusic.name}`) : `等待播放`}
                                </div>
                                <div
                                    className='progress-wrapper'
                                    ref='progress'
                                    onTouchMove={this.moveProgress}
                                    onTouchStart={this.startChangeTime}
                                    onClick={this.clickChangeTime}
                                    onMouseDown={this.mouseDown}
                                    onMouseMove={this.slideChangeTime}
                                    onMouseUp={this.mouseUp}
                                    onMouseLeave={this.mouseLeave}>
                                    <div className='progress'>
                                        <div className='progress-buffered' ref='buffered'/>
                                        <div className='progress-played' ref='played'/>
                                    </div>
                                </div>
                                <div className='time clearfix'>
                                    <div
                                        className='remain-time'>{this.state.currentMusic.src ? this.state.remainTime : `00:00`}</div>
                                    <span style={{display: 'none'}}>/</span>
                                    <div
                                        className='total-time'>{this.state.currentMusic.src ? this.state.totalTime : `00:00`}</div>
                                </div>
                            </div>
                        </div>
                        <div className='music-list-btn' onClick={this.showMusicList}>
                            <span className='icon-menu' style={{display: 'none'}}/>
                        </div>

                        <div className='right-control' style={{display: 'none'}}>
                            <div
                                className='volume-control-wrapper'
                                onTouchMove={this.moveVolume}
                                onTouchStart={this.startMoveVolume}
                                onClick={this.clickChangeVolume}
                                onMouseDown={this.mouseDownVulume}
                                onMouseMove={this.slideChangeVolume}
                                onMouseUp={this.mouseUpVolume}
                                onMouseLeave={this.mouseLeave}>
                                <div
                                    className='volume-control'
                                    ref='totalVolume'>
                                    <div className='volume-progress' ref='volumeProgress'/>
                                </div>

                            </div>
                            <span className='icon-volume'/>
                        </div>
                        <audio src={this.state.currentMusic.src ? this.state.currentMusic.src : ''} ref='audio'/>
                    </div>
                </div>
                <div className="music-list-wrap">
                    {this.state.musicListShow ? <div className='music-list'>
                        <div className='music-list-title' style={{display: 'none'}}>
                            <span>语音列表</span>
                        </div>
                        <div className='single-music-wrapper'>
                            {
                                this.props.info.map((v, i) => {
                                    return (
                                        <div
                                            className='single-music'
                                            onClick={this.playThis.bind(this, i)}
                                            style={
                                                this.state.currentMusic.src === v.src && this.state.isPlayed ? {
                                                    // background: '#33beff',
                                                    // color: '#fff'
                                                } : null} key={v.src}>
                                            <div className='single-music-play'>
                                                <span
                                                    className={this.state.currentMusic.src === v.src && this.state.isPlayed ? 'icon-playing' : 'icon-play'}/>
                                            </div>
                                            <div className='single-music-name'>{v.name}</div>
                                            <div
                                                className='single-music-artist'
                                                style={{display: 'none'}}>{v.artist}</div>
                                            <div className='single-music-del' style={{display: 'none'}}>
                                                <span className='icon-del' onClick={() => {
                                                    this.delMusic(i, v.id)
                                                }}/>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div> : null}
                </div>
                {/* <ReactCSSTransitionGroup
                    transitionName='music-list-model'
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {this.state.musicListShow ? <div className='modal' onClick={this.showMusicList}/> : null}
                </ReactCSSTransitionGroup> */}
            </div>
        )
    }
}
