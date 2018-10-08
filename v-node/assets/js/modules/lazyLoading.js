/**
 * Author：tantingting
 * Time：2018/7/3
 * Description：Description
 */
export default class LazyLoading {
    constructor (warp) {
        this.warp = warp
        this.winH = $(window).height() // 可见高度
        this.imgObj = [] // 图片对象
        this.time = 5000 // 5s自动加载图片
        this.cId = 0
    }

    init = () => {
        let self = this
        this.warp.find('img').each(function () {
            let imgSrc = $(this).data('src')
            if (!imgSrc) {} else {
                let isVisible = self.isVisible($(this))
                if (isVisible) {
                    self.showImg($(this), imgSrc)
                } else {
                    self.imgObj.push({node: $(this), url: imgSrc})
                }
            }
        })
        self.setTime(self.imgObj)
        $(window).on('scroll', function () {
            clearTimeout(self.cId)
            for (let index = 0; index < self.imgObj.length; index++) {
                let item = self.imgObj[index]
                let isVisible = self.isVisible(item.node)
                if (isVisible) {
                    self.showImg(item.node, item.url, index)
                }
            }
            self.setTime(self.imgObj)
        })
    }

    setTime = (imgObj) => {
        let self = this
        this.cId = setTimeout(() => {
            for (let index = 0; index < imgObj.length; index++) {
                let item = imgObj[index]
                self.showImg(item.node, item.url, index)
            }
        }, this.time)
    }

    isVisible = ($node) => {
        let winScrollTop = $(window).scrollTop()
        let $nodeOffsetTop = $node.offset().top
        let isShow = !$node.is(':visible') || $nodeOffsetTop > this.winH + winScrollTop
        if (isShow) {
            return false
        } else {
            return true
        }
    }

    showImg = ($node, src, index) => {
        $node.attr('src', src)
        $node.removeAttr('data-src')
        if (index === undefined) {
            return
        }
        this.imgObj = [
            ...this.imgObj.slice(0, index),
            ...this.imgObj.slice(index + 1)
        ]
    }
}
