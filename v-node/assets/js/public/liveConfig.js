/**
 * Author：tantingting
 * Time：2018/8/23
 * Description：Description
 */

// 直播
export class LiveConfig {
    constructor (id, obj) {
        this.player = null
        this.id = id
        this.obj = obj
        this.opt = {
            'id': this.id,
            'source': 'http://live-video.huoxing24.com/mars/meeting_sd.m3u8?auth_key=1540793770-0-0-b04163542526523f536a4bceb2ce61b8',
            'width': '100%',
            'height': '100%',
            'autoplay': true,
            'isLive': true,
            'rePlay': false,
            'playsinline': true,
            'preload': true,
            'controlBarVisibility': 'hover',
            'useH5Prism': true,
            'skinLayout': [
                {
                    'name': 'bigPlayButton',
                    'align': 'blabs',
                    'x': 30,
                    'y': 80
                },
                {
                    'name': 'errorDisplay',
                    'align': 'tlabs',
                    'x': 0,
                    'y': 0
                },
                {
                    'name': 'infoDisplay'
                },
                {
                    'name': 'controlBar',
                    'align': 'blabs',
                    'x': 0,
                    'y': 0,
                    'children': [
                        {
                            'name': 'liveDisplay',
                            'align': 'tlabs',
                            'x': 15,
                            'y': 6
                        },
                        {
                            'name': 'fullScreenButton',
                            'align': 'tr',
                            'x': 10,
                            'y': 10
                        },
                        {
                            'name': 'volume',
                            'align': 'tr',
                            'x': 5,
                            'y': 10
                        }
                    ]
                }
            ]
        }
    }

    init () {
        if (!this.id) {
            this.id = 'player-con'
        } else {
            if (typeof this.id === 'object') {
                this.obj = this.id
                this.id = 'player-con'
            }
        }
        this.opt = {
            ...this.opt,
            ...this.obj,
            'id': this.id
        }
        this.player = new Aliplayer(this.opt, function (player) {
            console.log('播放器创建了。')
        })
    }
}

// 视频播放
export class VideoPlay {
    constructor (warp) {
        this.warp = !warp ? $('.video-box') : warp
        this.video = this.warp.find('video')
        this.currVideo = 0
        this.videoList = [
            'https://hx24-media.huoxing24.com/meeting/2018-08-29-00-02-20_2018-08-29-01-02-20.mp4',
            'https://hx24-media.huoxing24.com/meeting/2018-08-29-01-02-20_2018-08-29-02-02-20.mp4',
            'https://hx24-media.huoxing24.com/meeting/2018-08-29-02-02-20_2018-08-29-03-02-20.mp4',
            'https://hx24-media.huoxing24.com/meeting/2018-08-29-03-02-20_2018-08-29-04-02-20.mp4',
            'https://hx24-media.huoxing24.com/meeting/2018-08-29-04-02-20_2018-08-29-05-02-20.mp4',
            'https://hx24-media.huoxing24.com/meeting/2018-08-29-05-02-20_2018-08-29-06-02-20.mp4',
            'https://hx24-media.huoxing24.com/meeting/2018-08-29-06-02-20_2018-08-29-07-02-20.mp4',
            'https://hx24-media.huoxing24.com/meeting/2018-08-29-07-02-20_2018-08-29-08-02-20.mp4',
            'https://hx24-media.huoxing24.com/meeting/2018-08-29-08-02-20_2018-08-29-08-07-31.mp4',
            'https://hx24-media.huoxing24.com/meeting/2018-08-29-08-13-50_2018-08-29-09-13-50.mp4',
            'https://hx24-media.huoxing24.com/meeting/2018-08-29-09-13-50_2018-08-29-09-41-44.mp4'
        ]
    }

    init () {
        this.video[0].addEventListener('ended', () => {
            this.play()
        })
        this.play()
    }

    play () {
        let video = this.video[0]
        video.src = this.videoList[this.currVideo]
        video.load() // 如果短的话，可以加载完成之后再播放，监听 canplaythrough 事件即可
        video.play()
        this.currVideo++
        if (this.currVideo >= this.videoList.length) {
            this.currVideo = 0 // 播放完了，重新播放
        }
    }
}
