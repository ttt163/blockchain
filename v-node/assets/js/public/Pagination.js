/**
 * Author：tantingting
 * Time：2017/12/4
 * Description：Description
 */

export default class Pagination {
    constructor (ul, opt) {
        // 配置参数
        let defaults = {
            total: 0, // 数据总条数
            size: 10, // 每页显示的条数,
            current: 1, // 当前第几页
            prevContent: '上一页', // 上一页内容
            nextContent: '下一页', // 下一页内容
            keepShowPN: true, // 是否一直显示上一页下一页
            nextCount: 2, // 当前页前后分页个数
            changePage: function (currPage) {} // 回调
        }
        let _opt = {
            ...defaults,
            ...opt
        }
        this.opt = {
            ..._opt,
            total: parseInt(_opt.total), // 数据总条数
            size: parseInt(_opt.size), // 每页显示的条数,
            current: parseInt(_opt.current), // 当前第几页
            nextCount: parseInt(_opt.nextCount) // 当前页前后分页个数
        }
        this.pageCount = Math.ceil(this.opt.total / this.opt.size) // 总页数,默认为1
        this.prevStr = ` <li class="prev"><a title="上一页">${this.opt.prevContent}</a></li>`
        this.nextStr = ` <li class="next"><a title="下一页">${this.opt.nextContent}</a></li>`
        this.dotStr = `<li class="pagination-dot"><span>•••</span></li>`
        this.liStr = ``
        this.ul = ul
        this.changePage = this.opt.changePage
    }

    init () {
        const _this = this
        this.liStr = ''
        this.getLi()
        this.ul.empty()
        if (this.pageCount > 1) {
            let _str = ''
            if (!this.opt.keepShowPN) {
                _str = this.liStr
            } else {
                _str = this.prevStr + this.liStr + this.nextStr
            }
            this.ul.html(_str)
        }
        // this.ul.find(`.pagination-item[data-page=${this.opt.current}]`).addClass('curr')
        this.ul.find(`.pagination-item`).filter(function () {
            return parseInt($(this).attr('data-page')) === _this.opt.current
        }).addClass('curr')
        // 点击页数
        this.ul.find('.pagination-item').on('click', function () {
            let Page = $(this).data('page')
            _this.change(Page)
        })

        // 下一页
        this.ul.find('.next').on('click', () => {
            if (this.pageCount > parseInt(this.opt.current)) {
                let Page = this.opt.current + 1
                this.change(Page)
            }
        })
        // 上一页
        this.ul.find('.prev').on('click', () => {
            if (this.opt.current > 1) {
                let Page = this.opt.current - 1
                this.change(Page)
            }
        })
    }

    change (page) {
        this.opt = {
            ...this.opt,
            current: page
        }
        this.init()
        this.changePage(page)
    }

    getLi () {
        let start = this.getPageStartAndEnd().start
        let end = this.getPageStartAndEnd().end
        this.liStr += `<li class="pagination-item" data-page="1"><a title="1">1</a></li>`
        let _liItem = ''
        for (let i = start; i <= end; i++) {
            _liItem += `<li class="pagination-item" data-page="${i}"><a title="${i}">${i}</a></li>`
        }
        if (start === 2) {
            if (end === this.pageCount - 1) {
                this.liStr += _liItem
            } else {
                this.liStr += _liItem + this.dotStr
            }
        } else {
            if (end === this.pageCount - 1) {
                this.liStr += this.dotStr + _liItem
            } else {
                this.liStr += this.dotStr + _liItem + this.dotStr
            }
        }
        this.liStr += `<li class="pagination-item" data-page="${this.pageCount}"><a title="${this.pageCount}">${this.pageCount}</a></li>`
    }

    getDotStr () {
        let _str = ''
        if (this.pageCount > this.opt.pageCount) {

        }
        return _str
    }

    getPageStartAndEnd () {
        let start = 0
        let end = 0
        if (this.pageCount > this.opt.nextCount * 2 + 3) {
            // 总页数大于前后个数+当前页+首尾页，需要省略
            if (this.opt.current < this.opt.nextCount * 2) {
                // curr=1,2,3页
                start = 2
                end = start + 3
            } else if (this.opt.current > this.pageCount - this.opt.nextCount * 2) {
                // curr=47,48,49,50
                end = this.pageCount - 1
                start = end - 3
            } else {
                // 如curr=45  分页1...43 44 45 46 47 ...50
                start = this.opt.current - 2
                end = this.opt.current + 2
            }
        } else {
            start = 2
            end = this.pageCount - 1
        }

        return {
            start: start,
            end: end
        }
    }
}

/* <ul class="f-pagination" id="pagination">
    <li class="pagination-item prev"><a>上一页</a></li>
    <li class="pagination-item"><a>1</a></li>
    <li class="pagination-item curr"><a>2</a></li>
    <li class="pagination-dot"><span>...</span></li>
    <li class="pagination-item"><a>6</a></li>
    <li class="pagination-item"><a>7</a></li>
    <li class="pagination-item next"><a>下一页</a></li>
</ul> */

/* let pageTotal = $('#pagination').data('total')
    let pag = new Pagination($('#pagination'), {
        prevContent: '<i class="iconfont iconfont-left"></i>',
        nextContent: '<i class="iconfont iconfont-right"></i>',
        total: pageTotal, // 数据总条数
        size: 20, // 每页显示的条数,
        current: 1, // 当前第几页
        changePage: (p) => {
            getPageData(p)
        }
    })
    pag.init() */
